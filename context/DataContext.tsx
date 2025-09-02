import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { AuthState, Employee, Role, Schedule, Attendance, Feedback, GeoSettings, EmployeeType, ShiftCode } from '../types';

// !!! DÁN URL WEB APP BẠN ĐÃ SAO CHÉP Ở BƯỚC 3 VÀO ĐÂY !!!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzMpPJLFtbEra0bHmo6fQg_EYoEaUmy8GPKg9UvY0IpgGMdCfZgFYnCYoMdr_0NK9cC/exec';

// --- Context Definition ---
export interface DataContextType {
  auth: AuthState;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>, password: string) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  resetEmployeePassword: (id: string, newPass: string) => Promise<void>;
  schedules: Schedule;
  updateSchedule: (employeeId: string, date: string, shiftCode: ShiftCode | null) => Promise<void>;
  attendance: Attendance[];
  addOrUpdateAttendance: (record: Attendance) => Promise<void>;
  feedback: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'submittedAt' | 'employeeName'>) => Promise<void>;
  geoSettings: GeoSettings;
  updateGeoSettings: (settings: GeoSettings) => Promise<void>;
  changePassword: (userId: string, newPass: string, role: Role) => Promise<boolean>;
  isLoading: boolean;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Helper function for API calls ---
const callGoogleScript = async (action: string, payload?: any) => {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({ action, payload }),
  });
  return response.json();
};

// --- Provider Component ---
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState<AuthState>({ user: null });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedules, setSchedules] = useState<Schedule>({});
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [geoSettings, setGeoSettings] = useState<GeoSettings>({ latitude: 0, longitude: 0, radius: 0 });

  // Fetch all initial data from Google Sheet on load
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await callGoogleScript('getInitialData');
        if (data) {
          setEmployees(data.employees || []);
          
          // Convert schedule array to object map
          const scheduleMap: Schedule = {};
          (data.schedules || []).forEach((item: any) => {
              if (!scheduleMap[item.employeeId]) scheduleMap[item.employeeId] = {};
              scheduleMap[item.employeeId][item.date] = item.shiftCode;
          });
          setSchedules(scheduleMap);

          setAttendance(data.attendance || []);
          setFeedback(data.feedback || []);
          
          // Convert settings array to object
          const settingsObj: GeoSettings = (data.settings || []).reduce((obj: any, item: any) => {
              obj[item.key] = parseFloat(item.value);
              return obj;
          }, {});
          setGeoSettings(settingsObj);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // Fix: The check for the placeholder URL caused a TypeScript error because the URL is now a constant.
    // Since the URL is set, we can call fetchInitialData directly.
    fetchInitialData();
  }, []);

  const login = async (username: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    const response = await callGoogleScript('login', { username, password });
    setIsLoading(false);
    if (response.success && response.user) {
      setAuth({ user: response.user });
      return true;
    }
    return false;
  };

  const logout = () => setAuth({ user: null });

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>, password: string) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const response = await callGoogleScript('addEmployee', { employee: newEmployee, password });
    if (response.success) {
      setEmployees(prev => [...prev, response.employee]);
    }
  };
  
  const updateEmployee = async (updatedEmployee: Employee) => {
    // For simplicity, we just update the local state. 
    // A full implementation would need a backend update.
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
  };
  
  const deleteEmployee = async (id: string) => {
    // For simplicity, we just update the local state.
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };
  
  const resetEmployeePassword = async (id: string, newPass: string) => {
    await callGoogleScript('changePassword', { userId: id, newPass });
  };
  
  const changePassword = async (userId: string, newPass: string): Promise<boolean> => {
    const response = await callGoogleScript('changePassword', { userId, newPass });
    return response.success;
  };

  const updateSchedule = async (employeeId: string, date: string, shiftCode: ShiftCode | null) => {
    // This is a simplified update. A real app would handle removals too.
    if(shiftCode) {
        await callGoogleScript('updateSchedule', { employeeId, date, shiftCode });
    }
    // Update local state for immediate feedback
    setSchedules(prev => {
      const newSchedules = JSON.parse(JSON.stringify(prev));
      if (!newSchedules[employeeId]) newSchedules[employeeId] = {};
      if (shiftCode) {
        newSchedules[employeeId][date] = shiftCode;
      } else {
        delete newSchedules[employeeId][date];
      }
      return newSchedules;
    });
  };

  const addOrUpdateAttendance = async (record: Attendance) => {
    const response = await callGoogleScript('addOrUpdateAttendance', record);
    if (response.success) {
      setAttendance(prev => {
        const existingIndex = prev.findIndex(a => a.id === record.id);
        if (existingIndex > -1) {
          const newAttendance = [...prev];
          newAttendance[existingIndex] = record;
          return newAttendance;
        }
        return [...prev, record];
      });
    }
  };

  const addFeedback = async (feedbackData: Omit<Feedback, 'id' | 'submittedAt'|'employeeName'>) => {
    const employee = employees.find(e => e.id === feedbackData.employeeId);
    const newFeedback: Feedback = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      employeeName: employee?.name || 'Unknown',
    };
    const response = await callGoogleScript('addFeedback', newFeedback);
    if (response.success) {
        setFeedback(prev => [...prev, response.feedback]);
    }
  };

  const updateGeoSettings = async (settings: GeoSettings) => {
      await callGoogleScript('updateGeoSettings', settings);
      setGeoSettings(settings);
  };

  const contextValue = useMemo(() => ({
    auth, login, logout,
    employees, addEmployee, updateEmployee, deleteEmployee, resetEmployeePassword,
    schedules, updateSchedule,
    attendance, addOrUpdateAttendance,
    feedback, addFeedback,
    geoSettings, updateGeoSettings,
    changePassword,
    isLoading
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [auth, employees, schedules, attendance, feedback, geoSettings, isLoading]);

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

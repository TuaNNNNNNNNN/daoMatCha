
export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum EmployeeType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
}

export enum ShiftCode {
  FS = 'FS', // Full-time Sáng
  FC = 'FC', // Full-time Chiều
  PS = 'PS', // Part-time Sáng
  PC = 'PC', // Part-time Chiều
  PT = 'PT', // Part-time Tối
}

export interface Shift {
  code: ShiftCode;
  name: string;
  start: string;
  end: string;
  hours: number;
}

export interface Employee {
  id: string;
  name: string;
  username: string;
  password?: string; // Hashed password, not sent to client
  type: EmployeeType;
  baseSalary: number; // VND per hour
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  shiftCode: ShiftCode;
  checkIn: string | null;
  checkOut: string | null;
  checkInLocation: GeolocationCoordinates | null;
  checkOutLocation: GeolocationCoordinates | null;
  date: string; // YYYY-MM-DD
  approvedOTHours: number;
  isLate: boolean;
}

export interface Schedule {
  [employeeId: string]: {
    [date: string]: ShiftCode; // YYYY-MM-DD
  };
}

export interface Feedback {
  id: string;
  employeeId: string;
  employeeName: string;
  message: string;
  submittedAt: string;
}

export interface GeoSettings {
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

export interface AuthState {
  user: {
    id: string;
    username: string;
    role: Role;
    name?: string;
  } | null;
}

export interface PayrollData {
    employeeId: string;
    employeeName: string;
    employeeType: EmployeeType;
    totalHours: number;
    totalOT: number;
    lateCount: number;
    penalty: number;
    basePay: number;
    otPay: number;
    totalPay: number;
}


import { Shift, ShiftCode, GeoSettings, EmployeeType } from './types';

export const SALARY_RATES = {
  [EmployeeType.FULL_TIME]: 22000,
  [EmployeeType.PART_TIME]: 20000,
};

export const SHIFT_DEFINITIONS: Record<ShiftCode, Shift> = {
  [ShiftCode.FS]: { code: ShiftCode.FS, name: 'Full-time Sáng', start: '07:00', end: '15:00', hours: 8 },
  [ShiftCode.FC]: { code: ShiftCode.FC, name: 'Full-time Chiều', start: '15:00', end: '23:00', hours: 8 },
  [ShiftCode.PS]: { code: ShiftCode.PS, name: 'Part-time Sáng', start: '07:00', end: '12:00', hours: 5 },
  [ShiftCode.PC]: { code: ShiftCode.PC, name: 'Part-time Chiều', start: '12:00', end: '18:00', hours: 6 },
  [ShiftCode.PT]: { code: ShiftCode.PT, name: 'Part-time Tối', start: '18:00', end: '23:00', hours: 5 },
};

export const DEFAULT_GEO_SETTINGS: GeoSettings = {
  latitude: 20.943865,
  longitude: 106.306292,
  radius: 200, // meters
};

export const LATE_THRESHOLD_MINUTES = 15;
export const LATE_PENALTY_AMOUNT = 50000;

export const OT_LIMITS = {
    [EmployeeType.FULL_TIME]: 5,
    [EmployeeType.PART_TIME]: 10,
};

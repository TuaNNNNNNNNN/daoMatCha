
import { Shift } from '../types';

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatDateTime = (isoString: string | null): string => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'medium',
    });
};

export const calculateHours = (start: string | null, end: string | null): number => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
};

export const isLateCheckIn = (checkInTime: Date, shift: Shift): boolean => {
    const [shiftHour, shiftMinute] = shift.start.split(':').map(Number);
    const shiftStartTime = new Date(checkInTime);
    shiftStartTime.setHours(shiftHour, shiftMinute + 15, 0, 0); // 15 minutes grace period
    return checkInTime > shiftStartTime;
};

export const getWeekRange = (date: Date): { start: Date, end: Date } => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    start.setDate(diff);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23,59,59,999);
    return { start, end };
};

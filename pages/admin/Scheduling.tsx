
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { SHIFT_DEFINITIONS } from '../../constants';
import { Employee, ShiftCode } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Scheduling: React.FC = () => {
    const { employees, schedules, updateSchedule } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());

    const changeWeek = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + offset * 7);
            return newDate;
        });
    };

    const getWeekDays = (start: Date): Date[] => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(day.getDate() + i);
            days.push(day);
        }
        return days;
    };
    
    const weekStart = new Date(currentDate);
    const dayOfWeek = weekStart.getDay();
    const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
    weekStart.setDate(diff);

    const weekDays = getWeekDays(weekStart);

    const handleShiftChange = (employeeId: string, date: string, shiftCode: string) => {
        updateSchedule(employeeId, date, shiftCode as ShiftCode);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <Button onClick={() => changeWeek(-1)}>&lt; Tuần trước</Button>
                <h2 className="text-xl font-bold">
                    Tuần từ {weekDays[0].toLocaleDateString('vi-VN')} - {weekDays[6].toLocaleDateString('vi-VN')}
                </h2>
                <Button onClick={() => changeWeek(1)}>Tuần sau &gt;</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-center text-gray-500 border-collapse border border-gray-300">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 border border-gray-300">Nhân viên</th>
                            {weekDays.map(day => (
                                <th key={day.toISOString()} className="px-4 py-3 border border-gray-300">
                                    {day.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp: Employee) => (
                            <tr key={emp.id} className="bg-white border-b">
                                <td className="px-4 py-2 border border-gray-300 font-medium text-gray-900">{emp.name}</td>
                                {weekDays.map(day => {
                                    const dateString = day.toISOString().split('T')[0];
                                    const assignedShift = schedules[emp.id]?.[dateString];
                                    return (
                                        <td key={dateString} className="px-4 py-2 border border-gray-300">
                                            <select
                                                value={assignedShift || ''}
                                                onChange={e => handleShiftChange(emp.id, dateString, e.target.value)}
                                                className="block w-full p-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            >
                                                <option value="">Nghỉ</option>
                                                {Object.values(SHIFT_DEFINITIONS).map(shift => (
                                                    <option key={shift.code} value={shift.code}>{shift.code}</option>
                                                ))}
                                            </select>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default Scheduling;

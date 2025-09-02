
import React from 'react';
import { useData } from '../../hooks/useData';
import Card from '../../components/ui/Card';
import { calculateHours, formatDateTime } from '../../utils/date';
import { SHIFT_DEFINITIONS } from '../../constants';

const AttendanceReport: React.FC = () => {
    const { attendance, employees } = useData();

    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'N/A';
    
    const sortedAttendance = [...attendance].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Card title="Báo cáo chấm công">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nhân viên</th>
                            <th scope="col" className="px-6 py-3">Ngày</th>
                            <th scope="col" className="px-6 py-3">Ca</th>
                            <th scope="col" className="px-6 py-3">Check-in</th>
                            <th scope="col" className="px-6 py-3">Check-out</th>
                            <th scope="col" className="px-6 py-3">Giờ làm</th>
                            <th scope="col" className="px-6 py-3">Trễ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAttendance.map(record => (
                            <tr key={record.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-gray-900">{getEmployeeName(record.employeeId)}</td>
                                <td className="px-6 py-4">{new Date(record.date).toLocaleDateString('vi-VN')}</td>
                                <td className="px-6 py-4">{SHIFT_DEFINITIONS[record.shiftCode].name}</td>
                                <td className="px-6 py-4">{formatDateTime(record.checkIn)}</td>
                                <td className="px-6 py-4">{formatDateTime(record.checkOut)}</td>
                                <td className="px-6 py-4">{calculateHours(record.checkIn, record.checkOut)} giờ</td>
                                <td className="px-6 py-4">{record.isLate ? <span className="text-red-500">Có</span> : 'Không'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default AttendanceReport;


import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import Card from '../../components/ui/Card';
import { calculateHours, formatDateTime } from '../../utils/date';
import { SHIFT_DEFINITIONS } from '../../constants';
import { calculatePayroll } from '../../services/payrollService';

const MyAttendance: React.FC = () => {
    const { auth, attendance, employees } = useData();
    const employeeId = auth.user?.id || '';
    const employee = employees.find(e => e.id === employeeId);

    const myAttendance = attendance.filter(a => a.employeeId === employeeId)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(lastDayOfMonth.toISOString().split('T')[0]);

    const payrollData = useMemo(() => {
        if (!employee) return null;
        const data = calculatePayroll([employee], attendance, new Date(startDate), new Date(endDate));
        return data[0];
    }, [employee, attendance, startDate, endDate]);

    return (
        <div className="space-y-6">
            <Card title="Bảng lương dự tính">
                 <div className="flex gap-4 mb-4 items-center">
                    <div>
                        <label htmlFor="startDate" className="text-sm font-medium">Từ ngày:</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="ml-2 p-2 border rounded"/>
                    </div>
                    <div>
                        <label htmlFor="endDate" className="text-sm font-medium">Đến ngày:</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="ml-2 p-2 border rounded"/>
                    </div>
                </div>
                {payrollData && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                         <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-500">Lương cơ bản</p>
                            <p className="text-xl font-bold">{payrollData.basePay.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-500">Lương OT</p>
                            <p className="text-xl font-bold">{payrollData.otPay.toLocaleString('vi-VN')}đ</p>
                        </div>
                         <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-sm text-red-500">Phạt</p>
                            <p className="text-xl font-bold">-{payrollData.penalty.toLocaleString('vi-VN')}đ</p>
                        </div>
                         <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-500">Tổng lương</p>
                            <p className="text-2xl font-bold text-green-600">{payrollData.totalPay.toLocaleString('vi-VN')}đ</p>
                        </div>
                    </div>
                )}
            </Card>

            <Card title="Lịch sử chấm công">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Ngày</th>
                                <th scope="col" className="px-6 py-3">Ca</th>
                                <th scope="col" className="px-6 py-3">Check-in</th>
                                <th scope="col" className="px-6 py-3">Check-out</th>
                                <th scope="col" className="px-6 py-3">Giờ làm</th>
                                <th scope="col" className="px-6 py-3">Trễ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myAttendance.map(record => (
                                <tr key={record.id} className="bg-white border-b">
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
        </div>
    );
};

export default MyAttendance;

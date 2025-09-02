
import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { calculatePayroll } from '../../services/payrollService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Payroll: React.FC = () => {
    const { employees, attendance } = useData();
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(lastDayOfMonth.toISOString().split('T')[0]);

    const payrollData = useMemo(() => {
        return calculatePayroll(employees, attendance, new Date(startDate), new Date(endDate));
    }, [employees, attendance, startDate, endDate]);
    
    return (
        <Card title="Bảng lương nhân viên">
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

             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nhân viên</th>
                            <th scope="col" className="px-6 py-3">Tổng giờ</th>
                            <th scope="col" className="px-6 py-3">Giờ OT</th>
                            <th scope="col" className="px-6 py-3">Lương cơ bản</th>
                            <th scope="col" className="px-6 py-3">Lương OT</th>
                            <th scope="col" className="px-6 py-3">Phạt đi trễ</th>
                            <th scope="col" className="px-6 py-3">Tổng lương</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrollData.map(data => (
                            <tr key={data.employeeId} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-gray-900">{data.employeeName}</td>
                                <td className="px-6 py-4">{data.totalHours}</td>
                                <td className="px-6 py-4">{data.totalOT}</td>
                                <td className="px-6 py-4">{data.basePay.toLocaleString('vi-VN')}đ</td>
                                <td className="px-6 py-4">{data.otPay.toLocaleString('vi-VN')}đ</td>
                                <td className="px-6 py-4 text-red-500">-{data.penalty.toLocaleString('vi-VN')}đ</td>
                                <td className="px-6 py-4 font-bold text-green-600">{data.totalPay.toLocaleString('vi-VN')}đ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default Payroll;

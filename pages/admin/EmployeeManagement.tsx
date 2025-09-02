
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Employee, EmployeeType } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { SALARY_RATES } from '../../constants';

const EmployeeForm: React.FC<{ employee?: Employee, onSave: (employee: Employee, password?: string) => void, onCancel: () => void }> = ({ employee, onSave, onCancel }) => {
    const [name, setName] = useState(employee?.name || '');
    const [username, setUsername] = useState(employee?.username || '');
    const [password, setPassword] = useState('');
    const [type, setType] = useState<EmployeeType>(employee?.type || EmployeeType.FULL_TIME);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employee && !password) {
            alert("Mật khẩu là bắt buộc cho nhân viên mới.");
            return;
        }
        onSave({
            id: employee?.id || '',
            name,
            username,
            type,
            baseSalary: SALARY_RATES[type],
            createdAt: employee?.createdAt || '',
        }, password);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Tên nhân viên" value={name} onChange={e => setName(e.target.value)} required />
            <Input label="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} required />
            {!employee && <Input label="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} required />}
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Loại nhân viên</label>
                <select value={type} onChange={e => setType(e.target.value as EmployeeType)} className="shadow border rounded w-full py-2 px-3">
                    <option value={EmployeeType.FULL_TIME}>Full-time</option>
                    <option value={EmployeeType.PART_TIME}>Part-time</option>
                </select>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Hủy</Button>
                <Button type="submit">Lưu</Button>
            </div>
        </form>
    );
};

const EmployeeManagement: React.FC = () => {
    const { employees, addEmployee, updateEmployee, deleteEmployee, resetEmployeePassword } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
    
    const handleAdd = () => {
        setEditingEmployee(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
            deleteEmployee(id);
        }
    }
    
    const handleResetPassword = (id: string) => {
        const newPass = prompt("Nhập mật khẩu mới cho nhân viên:");
        if (newPass) {
            resetEmployeePassword(id, newPass);
            alert("Đã đặt lại mật khẩu.");
        }
    }

    const handleSave = (employee: Employee, password?: string) => {
        if (editingEmployee) {
            updateEmployee(employee);
        } else if (password) {
            addEmployee(employee, password);
        }
        setIsModalOpen(false);
    };

    return (
        <Card title="Danh sách nhân viên" actions={<Button onClick={handleAdd}>Thêm nhân viên</Button>}>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmployee ? 'Sửa thông tin' : 'Thêm nhân viên mới'}>
                <EmployeeForm employee={editingEmployee} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tên</th>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">Loại</th>
                            <th scope="col" className="px-6 py-3">Lương/giờ</th>
                            <th scope="col" className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                                <td className="px-6 py-4">{emp.username}</td>
                                <td className="px-6 py-4">{emp.type}</td>
                                <td className="px-6 py-4">{emp.baseSalary.toLocaleString('vi-VN')}đ</td>
                                <td className="px-6 py-4 space-x-2">
                                    <Button size="sm" onClick={() => handleEdit(emp)}>Sửa</Button>
                                    <Button size="sm" variant="secondary" onClick={() => handleResetPassword(emp.id)}>Reset MK</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(emp.id)}>Xóa</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default EmployeeManagement;

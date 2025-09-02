import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useData } from '../../hooks/useData';

const ChangePassword: React.FC = () => {
    const { auth, changePassword } = useData();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (newPassword !== confirmPassword) {
            setMessage('Mật khẩu không khớp.');
            return;
        }

        if (auth.user) {
            const success = await changePassword(auth.user.id, newPassword, auth.user.role);
            if (success) {
                setMessage('Đổi mật khẩu thành công!');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage('Có lỗi xảy ra, không thể đổi mật khẩu.');
            }
        }
    };

    return (
        <Card title="Đổi mật khẩu">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                {message && <p className={message.includes('thành công') ? 'text-green-600' : 'text-red-500'}>{message}</p>}
                <Input
                    label="Mật khẩu mới"
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <Input
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Button type="submit" className="w-full">
                    Lưu thay đổi
                </Button>
            </form>
        </Card>
    );
};

export default ChangePassword;
import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { GeoSettings } from '../../types';

const Settings: React.FC = () => {
    const { geoSettings, updateGeoSettings, auth, changePassword } = useData();
    const [settings, setSettings] = useState<GeoSettings>(geoSettings);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setSettings(geoSettings);
    }, [geoSettings]);

    const handleGeoSave = () => {
        updateGeoSettings(settings);
        alert('Cài đặt vị trí đã được cập nhật.');
    };
    
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (password !== confirmPassword) {
            setMessage('Mật khẩu không khớp.');
            return;
        }
        if (auth.user) {
           const success = await changePassword(auth.user.id, password, auth.user.role);
           if (success) {
                setMessage('Đổi mật khẩu thành công!');
                setPassword('');
                setConfirmPassword('');
           } else {
                setMessage('Có lỗi xảy ra.');
           }
        }
    }

    return (
        <div className="space-y-6">
            <Card title="Cài đặt vị trí chấm công">
                <div className="space-y-4">
                    <Input 
                        label="Vĩ độ (Latitude)" 
                        type="number" 
                        step="any"
                        value={settings.latitude} 
                        onChange={e => setSettings(s => ({...s, latitude: parseFloat(e.target.value) || 0}))}
                    />
                    <Input 
                        label="Kinh độ (Longitude)" 
                        type="number" 
                        step="any"
                        value={settings.longitude} 
                        onChange={e => setSettings(s => ({...s, longitude: parseFloat(e.target.value) || 0}))}
                    />
                    <Input 
                        label="Bán kính cho phép (mét)" 
                        type="number" 
                        value={settings.radius} 
                        onChange={e => setSettings(s => ({...s, radius: parseInt(e.target.value, 10) || 0}))}
                    />
                    <Button onClick={handleGeoSave}>Lưu cài đặt vị trí</Button>
                </div>
            </Card>

            <Card title="Đổi mật khẩu quản trị viên">
                 <form onSubmit={handlePasswordChange} className="space-y-4">
                     {message && <p className={message.includes('thành công') ? 'text-green-600' : 'text-red-500'}>{message}</p>}
                    <Input 
                        label="Mật khẩu mới" 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <Input 
                        label="Xác nhận mật khẩu mới" 
                        type="password" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit">Đổi mật khẩu</Button>
                </form>
            </Card>
        </div>
    );
};

export default Settings;
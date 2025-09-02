import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Card title="Đăng nhập hệ thống">
            <form onSubmit={handleLogin} className="space-y-6">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Input
                label="Tên đăng nhập"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin hoặc username nhân viên"
            />
            <Input
                label="Mật khẩu"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="******************"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
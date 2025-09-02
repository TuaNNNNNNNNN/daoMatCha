import React, { ReactNode } from 'react';
import { useData } from '../hooks/useData';
import Button from './ui/Button';
import RealTimeClock from './ui/RealTimeClock';

interface LayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebar, title }) => {
  const { auth, logout } = useData();

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-center">EMS</h1>
        </div>
        <nav className="flex-1 p-4">{sidebar}</nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <div className="flex items-center gap-4">
            <RealTimeClock />
            <span>Chào, <strong>{auth.user?.name || auth.user?.username}</strong>!</span>
            <Button onClick={logout} variant="secondary" size="sm">Đăng xuất</Button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
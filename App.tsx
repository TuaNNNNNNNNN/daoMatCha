
import React from 'react';
import { useData } from './hooks/useData';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import { Role } from './types';

const App: React.FC = () => {
  const { auth } = useData();

  if (!auth.user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {auth.user.role === Role.ADMIN ? <AdminDashboard /> : <EmployeeDashboard />}
    </div>
  );
};

export default App;

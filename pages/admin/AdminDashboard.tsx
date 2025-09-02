
import React, { useState, ReactNode } from 'react';
import Layout from '../../components/Layout';
import EmployeeManagement from './EmployeeManagement';
import Scheduling from './Scheduling';
import AttendanceReport from './AttendanceReport';
import Payroll from './Payroll';
import Settings from './Settings';
import FeedbackList from './FeedbackList';

type AdminPage = 'employees' | 'schedule' | 'attendance' | 'payroll' | 'feedback' | 'settings';

const AdminDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('employees');

  const pageTitles: Record<AdminPage, string> = {
    employees: 'Quản lý nhân viên',
    schedule: 'Phân ca làm việc',
    attendance: 'Báo cáo chấm công',
    payroll: 'Bảng lương',
    feedback: 'Phản hồi từ nhân viên',
    settings: 'Cài đặt',
  };

  const renderPage = (): ReactNode => {
    switch (currentPage) {
      case 'employees': return <EmployeeManagement />;
      case 'schedule': return <Scheduling />;
      case 'attendance': return <AttendanceReport />;
      case 'payroll': return <Payroll />;
      case 'feedback': return <FeedbackList />;
      case 'settings': return <Settings />;
      default: return <EmployeeManagement />;
    }
  };
  
  const SidebarLink: React.FC<{ page: AdminPage, children: ReactNode }> = ({ page, children }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`w-full text-left px-4 py-2 rounded ${currentPage === page ? 'bg-blue-500' : 'hover:bg-gray-700'}`}
    >
      {children}
    </button>
  );

  const sidebar = (
    <ul className="space-y-2">
      <li><SidebarLink page="employees">Quản lý nhân viên</SidebarLink></li>
      <li><SidebarLink page="schedule">Phân ca làm việc</SidebarLink></li>
      <li><SidebarLink page="attendance">Báo cáo chấm công</SidebarLink></li>
      <li><SidebarLink page="payroll">Bảng lương</SidebarLink></li>
      <li><SidebarLink page="feedback">Phản hồi</SidebarLink></li>
      <li><SidebarLink page="settings">Cài đặt</SidebarLink></li>
    </ul>
  );

  return (
    <Layout title={pageTitles[currentPage]} sidebar={sidebar}>
      {renderPage()}
    </Layout>
  );
};

export default AdminDashboard;

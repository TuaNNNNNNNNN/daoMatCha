
import React, { useState, ReactNode } from 'react';
import Layout from '../../components/Layout';
import CheckIn from './CheckIn';
import MyAttendance from './MyAttendance';
import SendFeedback from './SendFeedback';
import ChangePassword from './ChangePassword';


type EmployeePage = 'checkin' | 'attendance' | 'feedback' | 'password';

const EmployeeDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<EmployeePage>('checkin');

  const pageTitles: Record<EmployeePage, string> = {
    checkin: 'Chấm công',
    attendance: 'Lịch sử chấm công & Lương',
    feedback: 'Gửi phản hồi',
    password: 'Đổi mật khẩu',
  };

  const renderPage = (): ReactNode => {
    switch (currentPage) {
      case 'checkin': return <CheckIn />;
      case 'attendance': return <MyAttendance />;
      case 'feedback': return <SendFeedback />;
      case 'password': return <ChangePassword />;
      default: return <CheckIn />;
    }
  };
  
  const SidebarLink: React.FC<{ page: EmployeePage, children: ReactNode }> = ({ page, children }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`w-full text-left px-4 py-2 rounded ${currentPage === page ? 'bg-blue-500' : 'hover:bg-gray-700'}`}
    >
      {children}
    </button>
  );

  const sidebar = (
    <ul className="space-y-2">
      <li><SidebarLink page="checkin">Chấm công</SidebarLink></li>
      <li><SidebarLink page="attendance">Chấm công & Lương</SidebarLink></li>
      <li><SidebarLink page="feedback">Gửi phản hồi</SidebarLink></li>
      <li><SidebarLink page="password">Đổi mật khẩu</SidebarLink></li>
    </ul>
  );

  return (
    <Layout title={pageTitles[currentPage]} sidebar={sidebar}>
      {renderPage()}
    </Layout>
  );
};

export default EmployeeDashboard;

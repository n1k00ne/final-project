import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

interface LayoutProps {
  userRole: 'admin' | 'member';
}

const Layout: React.FC<LayoutProps> = ({ userRole }) => {
  return (
    <div className="layout">
      <Sidebar userRole={userRole} />
      <div className="main-content">
        <Header userName="Алексей" userRole={userRole} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

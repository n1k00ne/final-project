import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaMoneyBillWave, FaUser } from 'react-icons/fa'; // убрали FaChartPie и FaUsersCog

interface SidebarProps {
  userRole: 'admin' | 'member';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>FamilyHub</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaHome /> <span>Дашборд</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaTasks /> <span>Задачи</span>
        </NavLink>
        <NavLink to="/costs" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaMoneyBillWave /> <span>Расходы</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaUser /> <span>Профиль</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
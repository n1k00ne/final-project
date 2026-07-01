import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaMoneyBillWave, FaChartPie, FaUser, FaUsersCog } from 'react-icons/fa';

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
        <NavLink to="/statistics" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaChartPie /> <span>Статистика</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaUser /> <span>Профиль</span>
        </NavLink>
        {userRole === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaUsersCog /> <span>Управление семьёй</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

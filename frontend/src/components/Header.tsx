import React from 'react';

interface HeaderProps {
  userName: string;
  userRole: 'admin' | 'member';
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  return (
    <header className="header">
      <div className="header-left">
        <span className="user-role">{userRole === 'admin' ? 'Администратор' : 'Участник'}</span>
      </div>
      <div className="header-right">
        <span className="user-name">{userName}</span>
        <button className="logout-btn" onClick={() => alert('Выход')}>
          Выйти
        </button>
      </div>
    </header>
  );
};

export default Header;

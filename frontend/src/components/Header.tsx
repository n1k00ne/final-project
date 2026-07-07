import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userName: string;
  userRole: 'admin' | 'member';
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="user-role">{userRole === 'admin' ? 'Администратор' : 'Участник'}</span>
      </div>
      <div className="header-right">
        <span className="user-name">{userName}</span>
        <button className="login-redirect-btn" onClick={handleLoginRedirect}>
          Войти
        </button>
        <button className="logout-btn" onClick={() => alert('Выход')}>
          Выйти
        </button>
      </div>
    </header>
  );
};

export default Header;
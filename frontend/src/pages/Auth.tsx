// src/pages/Auth.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Здесь будет вызов API для входа
      alert(`Вход с email: ${email}`);
      // После успешного входа перенаправляем на дашборд
      navigate('/dashboard');
    } else {
      // Регистрация
      if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      alert(`Регистрация пользователя ${name} с email: ${email}`);
      // После регистрации можно перенаправить на логин или сразу войти
      setIsLogin(true);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">FamilyHub</h1>
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                placeholder="Введите имя"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@mail.ru"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Минимум 6 символов"
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                placeholder="Повторите пароль"
                minLength={6}
              />
            </div>
          )}

          {isLogin && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Запомнить меня
              </label>
              <a href="#" className="forgot-password">Забыли пароль?</a>
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <p>
              Нет аккаунта?{' '}
              <button className="switch-link" onClick={() => setIsLogin(false)}>
                Зарегистрироваться
              </button>
            </p>
          ) : (
            <p>
              Уже есть аккаунт?{' '}
              <button className="switch-link" onClick={() => setIsLogin(true)}>
                Войти
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
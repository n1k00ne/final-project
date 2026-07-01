import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Costs from './pages/Costs';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const Login = () => <div style={{ padding: '2rem' }}>Страница входа</div>;
const Register = () => <div style={{ padding: '2rem' }}>Страница регистрации</div>;

function App() {
  const userRole: 'admin' | 'member' = 'admin'; // для демонстрации

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout userRole={userRole} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="costs" element={<Costs />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="admin"
            element={
              userRole === 'admin' ? <Admin /> : <Navigate to="/dashboard" replace />
            }
          />
        </Route>
        <Route path="*" element={<div>Страница не найдена</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

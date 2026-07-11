import React from 'react';
import DashboardCard from '../components/dashboard/DashboardCard';
import TaskSummary from '../components/dashboard/TaskSummary';
import CostSummary from '../components/dashboard/CostSummary';
import QuickActions from '../components/dashboard/QuickActions';
import { useApi } from '../hooks/useApi';
import { tasksApi, costsApi, categoriesApi, usersApi } from '../api/client';
import { FaTasks, FaWallet, FaBolt } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  // Загружаем данные с сервера
  const { data: tasks, loading: tasksLoading, error: tasksError } = useApi(
    tasksApi.getAll
  );
  const { data: costs, loading: costsLoading, error: costsError } = useApi(
    costsApi.getAll
  );
  const { data: categories, loading: categoriesLoading } = useApi(
    categoriesApi.getAll
  );
  const { data: users, loading: usersLoading } = useApi(
    usersApi.getAll
  );

  // Показываем загрузку
  if (tasksLoading || costsLoading || categoriesLoading || usersLoading) {
    return (
      <div className="dashboard-loading">
        <p>Загрузка данных...</p>
      </div>
    );
  }

  // Показываем ошибку
  if (tasksError || costsError) {
    return (
      <div className="dashboard-error">
        <p>Ошибка загрузки данных: {tasksError || costsError}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <DashboardCard title="Активные задачи" icon={<FaTasks />} className="card-tasks">
        <TaskSummary tasks={tasks || []} />
      </DashboardCard>

      <DashboardCard title="Бюджет" icon={<FaWallet />} className="card-costs">
        <CostSummary 
          costs={costs || []} 
          categories={categories || []} 
          budget={50000} // Бюджет можно тоже получать с сервера
        />
      </DashboardCard>

      <DashboardCard title="Быстрые действия" icon={<FaBolt />} className="card-actions">
        <QuickActions />
      </DashboardCard>
    </div>
  );
};

export default Dashboard;
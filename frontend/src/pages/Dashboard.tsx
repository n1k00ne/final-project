import React from 'react';
import DashboardCard from '../components/dashboard/DashboardCard';
import TaskSummary from '../components/dashboard/TaskSummary';
import CostSummary from '../components/dashboard/CostSummary';
import QuickActions from '../components/dashboard/QuickActions';
import { TASKS, COSTS, CATEGORIES, MONTH_BUDGET } from '../mockData';
import { FaTasks, FaWallet, FaBolt } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-grid">
      {/* Задачи */}
      <DashboardCard title="Активные задачи" icon={<FaTasks />} className="card-tasks">
        <TaskSummary tasks={TASKS} />
      </DashboardCard>

      {/* Расходы */}
      <DashboardCard title="Бюджет" icon={<FaWallet />} className="card-costs">
        <CostSummary costs={COSTS} categories={CATEGORIES} budget={MONTH_BUDGET} />
      </DashboardCard>

      {/* Быстрые действия */}
      <DashboardCard title="Быстрые действия" icon={<FaBolt />} className="card-actions">
        <QuickActions />
      </DashboardCard>
    </div>
  );
};

export default Dashboard;
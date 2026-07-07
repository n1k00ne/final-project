import React from 'react';

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="card-header">
        {icon && <span className="card-icon">{icon}</span>}
        <h3>{title}</h3>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
};

export default DashboardCard;
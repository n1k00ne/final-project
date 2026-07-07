import React from 'react';
import { Cost, Category } from '../../types';
import { USERS, MONTH_BUDGET, TOTAL_SPENT } from '../../mockData';

interface CostSummaryProps {
  costs: Cost[];
  categories: Category[];
  budget: number;
}

const CostSummary: React.FC<CostSummaryProps> = ({ costs, categories, budget }) => {
  const totalSpent = costs.reduce((sum, c) => sum + c.amount, 0);
  const remaining = budget - totalSpent;
  const percentUsed = Math.min(100, Math.round((totalSpent / budget) * 100));

  const recent = [...costs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Без категории';

  return (
    <div className="cost-summary">
      <div className="budget-block">
        <div className="budget-remaining">
          <span className="remaining-amount" style={{ color: remaining < 0 ? '#e74c3c' : '#2c3e50' }}>
            {remaining.toLocaleString()} ₽
          </span>
          <span className="remaining-label">осталось на месяц</span>
        </div>
        <div className="budget-bar">
          <div className="budget-fill" style={{ width: `${percentUsed}%`, background: percentUsed > 90 ? '#e74c3c' : percentUsed > 70 ? '#f39c12' : '#2ecc71' }} />
        </div>
        <div className="budget-stats">
          <span>Бюджет: {budget.toLocaleString()} ₽</span>
          <span>Потрачено: {totalSpent.toLocaleString()} ₽ ({percentUsed}%)</span>
        </div>
      </div>

      <div className="recent-costs">
        <h4>Последние траты</h4>
        <ul>
          {recent.map(cost => {
            const user = USERS[cost.userId as keyof typeof USERS];
            return (
              <li key={cost.id} className="cost-item">
                <span className="cost-category">{getCategoryName(cost.categoryId)}</span>
                <span className="cost-note">{cost.note || '—'}</span>
                <span className="cost-user">{user ? user.avatar : '👤'}</span>
                <span className="cost-amount">{cost.amount.toLocaleString()} ₽</span>
                <span className="cost-date">{new Date(cost.date).toLocaleDateString('ru-RU')}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CostSummary;
import React from 'react';
import { FaPlus, FaShoppingCart, FaCalendarPlus, FaMoneyBillWave } from 'react-icons/fa';

const QuickActions: React.FC = () => {
  const actions = [
    { label: 'Добавить расход', icon: <FaMoneyBillWave />, onClick: () => alert('Открыть форму добавления расхода') },
    { label: 'Добавить задачу', icon: <FaPlus />, onClick: () => alert('Открыть форму создания задачи') },
    { label: 'В список покупок', icon: <FaShoppingCart />, onClick: () => alert('Открыть список покупок') },
    { label: 'Создать событие', icon: <FaCalendarPlus />, onClick: () => alert('Открыть календарь для создания события') },
  ];

  return (
    <div className="quick-actions">
      {actions.map((action, idx) => (
        <button key={idx} className="action-btn" onClick={action.onClick}>
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
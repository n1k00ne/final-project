import React, { useState, useMemo } from 'react';
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaCamera,
  FaUsers,
  FaBalanceScale,
  FaChartPie,
  FaChartBar,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import { Cost, Category, User, RecurringPayment, Task } from '../types';

// ================ МОКИ ================
const mockUsers: User[] = [
  { id: 'u1', email: 'papa@family.ru', name: 'Папа', role: 'admin' },
  { id: 'u2', email: 'mama@family.ru', name: 'Мама', role: 'member' },
  { id: 'u3', email: 'son@family.ru', name: 'Сын', role: 'member' },
];

const mockCategories: Category[] = [
  { id: 'c1', name: 'Еда', icon: '🍔' },
  { id: 'c2', name: 'ЖКХ', icon: '🏠' },
  { id: 'c3', name: 'Одежда', icon: '👗' },
  { id: 'c4', name: 'Развлечения', icon: '🎮' },
  { id: 'c5', name: 'Авто', icon: '🚗' },
  { id: 'c6', name: 'Рестораны', icon: '🍽️' },
];

const initialCosts: Cost[] = [
  {
    id: '1',
    amount: 3500,
    categoryId: 'c1',
    note: 'Продукты на неделю',
    date: '2026-07-01',
    userId: 'u1',
    familyId: 'f1',
    place: 'Пятёрочка',
    paymentMethod: 'card_mir',
    isShared: true,
    forWhom: 'Все',
  },
  {
    id: '2',
    amount: 1200,
    categoryId: 'c4',
    note: 'Билеты в кино',
    date: '2026-07-03',
    userId: 'u2',
    familyId: 'f1',
    place: 'Кинотеатр',
    paymentMethod: 'cash',
    isShared: false,
    forWhom: 'Дети',
  },
  {
    id: '3',
    amount: 5000,
    categoryId: 'c6',
    note: 'Ужин в ресторане',
    date: '2026-07-05',
    userId: 'u1',
    familyId: 'f1',
    place: 'Итальянский дворик',
    paymentMethod: 'credit_card',
    isShared: true,
    forWhom: 'Все',
  },
  {
    id: '4',
    amount: 800,
    categoryId: 'c5',
    note: 'Бензин',
    date: '2026-07-07',
    userId: 'u1',
    familyId: 'f1',
    place: 'Газпромнефть',
    paymentMethod: 'cash',
    isShared: true,
    forWhom: 'Папа',
  },
  {
    id: '5',
    amount: 2500,
    categoryId: 'c1',
    note: 'Заказ продуктов онлайн',
    date: '2026-07-10',
    userId: 'u2',
    familyId: 'f1',
    place: 'СберМаркет',
    paymentMethod: 'electronic',
    isShared: true,
    forWhom: 'Все',
  },
];

const initialRecurring: RecurringPayment[] = [
  {
    id: 'r1',
    name: 'Интернет',
    amount: 600,
    categoryId: 'c2',
    dayOfMonth: 10,
    userId: 'u1',
    familyId: 'f1',
    isActive: true,
    note: 'Ростелеком',
  },
  {
    id: 'r2',
    name: 'Квартплата',
    amount: 4000,
    categoryId: 'c2',
    dayOfMonth: 25,
    userId: 'u1',
    familyId: 'f1',
    isActive: true,
  },
];

// Цвета для диаграммы
const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

// ================ КОМПОНЕНТ ================
const Costs: React.FC = () => {
  // Состояния
  const [costs, setCosts] = useState<Cost[]>(initialCosts);
  const [recurring, setRecurring] = useState<RecurringPayment[]>(initialRecurring);

  // Фильтры
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterShared, setFilterShared] = useState<string>('all');

  // Для модалок
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [showSplitModal, setShowSplitModal] = useState<Cost | null>(null);

  // Графики: текущий тип
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'trend'>('pie');

  // Текущий месяц для виджетов (июль 2026)
  const currentMonth = '2026-07';

  // ================ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ================
  // Получить имя пользователя по id
  const getUserName = (id: string) => mockUsers.find(u => u.id === id)?.name || id;

  // Получить категорию по id
  const getCategory = (id: string) => mockCategories.find(c => c.id === id);

  // Фильтрация расходов
  const filteredCosts = useMemo(() => {
    return costs.filter(cost => {
      const matchUser = filterUser === 'all' || cost.userId === filterUser;
      const matchPayment = filterPayment === 'all' || cost.paymentMethod === filterPayment;
      const matchShared = filterShared === 'all' || (filterShared === 'shared' ? cost.isShared : !cost.isShared);
      return matchUser && matchPayment && matchShared;
    });
  }, [costs, filterUser, filterPayment, filterShared]);

  // Расходы за текущий месяц
  const monthlyCosts = useMemo(() => {
    return costs.filter(c => c.date.startsWith(currentMonth));
  }, [costs, currentMonth]);

  const totalMonth = monthlyCosts.reduce((sum, c) => sum + c.amount, 0);
  // Доход (для примера фиксированный)
  const income = 50000;
  const balance = income - totalMonth;
  const dailyAverage = totalMonth / 31; // грубо

  // Самая затратная категория в этом месяце
  const topCategory = useMemo(() => {
    const catSums: Record<string, number> = {};
    monthlyCosts.forEach(c => {
      catSums[c.categoryId] = (catSums[c.categoryId] || 0) + c.amount;
    });
    let maxId = '';
    let maxSum = 0;
    for (const [id, sum] of Object.entries(catSums)) {
      if (sum > maxSum) { maxSum = sum; maxId = id; }
    }
    const cat = getCategory(maxId);
    return cat ? { name: cat.name, sum: maxSum, percent: totalMonth ? Math.round(maxSum / totalMonth * 100) : 0 } : null;
  }, [monthlyCosts, totalMonth]);

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    const catSums: Record<string, number> = {};
    filteredCosts.forEach(c => {
      catSums[c.categoryId] = (catSums[c.categoryId] || 0) + c.amount;
    });
    const total = Object.values(catSums).reduce((s, v) => s + v, 0);
    return Object.entries(catSums)
      .map(([catId, sum]) => ({
        name: getCategory(catId)?.name || catId,
        value: sum,
        percentage: total ? Math.round((sum / total) * 100) : 0,
        color: COLORS[Object.keys(catSums).indexOf(catId) % COLORS.length],
      }))
      .filter(item => item.value > 0);
  }, [filteredCosts]);

  // Гистограмма по неделям
  const barData = useMemo(() => {
    const weeks: Record<number, number> = {};
    filteredCosts.forEach(c => {
      const day = new Date(c.date).getDate();
      const week = Math.ceil(day / 7);
      weeks[week] = (weeks[week] || 0) + c.amount;
    });
    return [1, 2, 3, 4, 5].map(w => ({ week: w, value: weeks[w] || 0 }));
  }, [filteredCosts]);

  // Динамика к прошлому месяцу (сравнение сумм)
  const trend = useMemo(() => {
    const prevMonth = '2026-06';
    const prevTotal = costs.filter(c => c.date.startsWith(prevMonth)).reduce((s, c) => s + c.amount, 0);
    const diff = totalMonth - prevTotal;
    const percent = prevTotal ? Math.round(diff / prevTotal * 100) : 0;
    return { diff, percent, prevTotal };
  }, [costs, totalMonth]);

  // ================ ОБРАБОТЧИКИ ================
  const addCost = (cost: Omit<Cost, 'id'>) => {
    const newCost = { ...cost, id: Date.now().toString() };
    setCosts(prev => [newCost, ...prev]);
  };

  const editCost = (id: string, updated: Partial<Cost>) => {
    setCosts(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCost = (id: string) => {
    setCosts(prev => prev.filter(c => c.id !== id));
  };

  // Регулярные платежи
  const addRecurring = (rec: Omit<RecurringPayment, 'id'>) => {
    const newRec = { ...rec, id: Date.now().toString() };
    setRecurring(prev => [...prev, newRec]);
    alert(`Регулярный платёж "${rec.name}" добавлен. В день ${rec.dayOfMonth} он будет автоматически добавляться в расходы.`);
  };

  const deleteRecurring = (id: string) => {
    setRecurring(prev => prev.filter(r => r.id !== id));
  };

  // Обработчик разделения чека
  const handleSplit = (cost: Cost, participants: { userId: string; share: number }[]) => {
    const tasks: Task[] = participants.map(p => ({
      id: Date.now().toString() + p.userId,
      title: `Перевести ${p.share}₽ за "${cost.note || 'покупку'}"`,
      description: `Разделение чека от ${new Date(cost.date).toLocaleDateString()}`,
      status: 'work',
      assigneeId: p.userId,
      creatorId: cost.userId,
      familyId: cost.familyId,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,10),
    }));
    alert(`Создано ${tasks.length} задач о долгах.`);
    editCost(cost.id, { splitInfo: { totalAmount: cost.amount, participants } });
    setShowSplitModal(null);
  };

  // Компонент круговой диаграммы
  const PieChart = ({ data }: { data: typeof pieData }) => {
    const size = 280;
    const radius = 120;
    const center = size / 2;
    
    if (data.length === 0) {
      return <p className="no-data">Нет данных для отображения</p>;
    }

    let startAngle = -90;
    const total = data.reduce((s, d) => s + d.value, 0);

    const segments = data.map((item) => {
      const angle = (item.value / total) * 360;
      const endAngle = startAngle + angle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      const result = {
        path,
        color: item.color,
        percentage: item.percentage,
        name: item.name,
      };
      
      startAngle = endAngle;
      return result;
    });

    return (
      <div className="pie-chart-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.path}
              fill={segment.color}
              stroke="#fff"
              strokeWidth="2"
            />
          ))}
          <circle cx={center} cy={center} r={radius * 0.5} fill="#fff" />
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#2c3e50"
          >
            {total.toLocaleString()} ₽
          </text>
          <text
            x={center}
            y={center + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#7f8c8d"
          >
            всего
          </text>
        </svg>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span className="legend-label">{item.name}</span>
              <span className="legend-percentage">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ================ ОТРИСОВКА ================
  return (
    <div className="costs-page">
      <h1>Расходы</h1>

      {/* 1. Виджеты быстрого взгляда */}
      <div className="widget-grid">
        <div className="widget">
          <div className="widget-label">Баланс (доход - расход)</div>
          <div className={`widget-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            {balance.toLocaleString()} ₽
          </div>
        </div>
        <div className="widget">
          <div className="widget-label">Свободный остаток</div>
          <div className="widget-value">{income.toLocaleString()} ₽</div>
        </div>
        <div className="widget">
          <div className="widget-label">Самая затратная категория</div>
          {topCategory ? (
            <div className="widget-value">
              {topCategory.name} <span className="widget-sub">{topCategory.percent}%</span>
            </div>
          ) : <div className="widget-value">Нет данных</div>}
        </div>
        <div className="widget">
          <div className="widget-label">Средняя трата в день</div>
          <div className={`widget-value ${dailyAverage > 2000 ? 'warning' : ''}`}>
            {Math.round(dailyAverage).toLocaleString()} ₽
          </div>
        </div>
      </div>

      {/* 2. Фильтры и группировка */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Кто потратил</label>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)}>
            <option value="all">Все</option>
            {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Способ оплаты</label>
          <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)}>
            <option value="all">Все</option>
            <option value="cash">Наличные</option>
            <option value="card_mir">Карта Мир</option>
            <option value="credit_card">Кредитная карта</option>
            <option value="electronic">Электронные</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Тип</label>
          <select value={filterShared} onChange={e => setFilterShared(e.target.value)}>
            <option value="all">Все</option>
            <option value="shared">Общий</option>
            <option value="personal">Личный</option>
          </select>
        </div>
        <button className="btn-add" onClick={() => { setEditingCost(null); setShowAddModal(true); }}>
          <FaPlus /> Добавить расход
        </button>
      </div>

      {/* 3. Графики */}
      <div className="charts-section">
        <div className="chart-tabs">
          <button className={chartType === 'pie' ? 'active' : ''} onClick={() => setChartType('pie')}>
            <FaChartPie /> Диаграмма
          </button>
          <button className={chartType === 'bar' ? 'active' : ''} onClick={() => setChartType('bar')}>
            <FaChartBar /> Гистограмма
          </button>
          <button className={chartType === 'trend' ? 'active' : ''} onClick={() => setChartType('trend')}>
            <FaBalanceScale /> Динамика
          </button>
        </div>
        <div className="chart-container">
          {chartType === 'pie' && <PieChart data={pieData} />}
          {chartType === 'bar' && (
            <div className="bar-chart">
              {barData.map((item) => {
                const maxValue = Math.max(...barData.map(d => d.value), 1);
                const widthPercent = Math.round((item.value / maxValue) * 100);
                return (
                  <div key={item.week} className="bar-item">
                    <div className="bar-label">Неделя {item.week}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.min(widthPercent, 100)}%` }} />
                    </div>
                    <div className="bar-value">{item.value} ₽</div>
                  </div>
                );
              })}
            </div>
          )}
          {chartType === 'trend' && (
            <div className="trend-block">
              <div className="trend-item">
                <span>Текущий месяц</span>
                <strong>{totalMonth.toLocaleString()} ₽</strong>
              </div>
              <div className="trend-item">
                <span>Прошлый месяц</span>
                <strong>{trend.prevTotal.toLocaleString()} ₽</strong>
              </div>
              <div className="trend-item">
                <span>Изменение</span>
                <strong className={trend.diff >= 0 ? 'positive' : 'negative'}>
                  {trend.diff >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(trend.percent)}%
                </strong>
              </div>
              <div className="trend-note">
                {trend.diff >= 0 ? 'Увеличились' : 'Уменьшились'} на {Math.abs(trend.diff).toLocaleString()} ₽
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Таблица расходов с доп. колонками */}
      <div className="cost-table-wrapper">
        <table className="cost-table">
          <thead>
            <tr>
              <th>Название / Категория</th>
              <th>Сумма</th>
              <th>Дата</th>
              <th>Место</th>
              <th>Кто</th>
              <th>Способ</th>
              <th>Тип</th>
              <th>Для кого</th>
              <th>Фото</th>
              <th>Комментарий</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCosts.map(cost => {
              const cat = getCategory(cost.categoryId);
              return (
                <tr key={cost.id}>
                  <td>
                    <span className="cat-icon">{cat?.icon}</span>
                    {cat?.name}
                  </td>
                  <td className="amount">{cost.amount.toLocaleString()} ₽</td>
                  <td>{new Date(cost.date).toLocaleDateString()}</td>
                  <td>{cost.place || '-'}</td>
                  <td>{getUserName(cost.userId)}</td>
                  <td>{cost.paymentMethod || '-'}</td>
                  <td>{cost.isShared ? 'Общий' : 'Личный'}</td>
                  <td>{cost.forWhom || '-'}</td>
                  <td>{cost.photo ? <FaCamera /> : '-'}</td>
                  <td className="note-cell">{cost.note || '-'}</td>
                  <td className="actions">
                    <button className="btn-split" onClick={() => setShowSplitModal(cost)} title="Разделить чек">
                      <FaUsers />
                    </button>
                    <button className="btn-edit" onClick={() => { setEditingCost(cost); setShowAddModal(true); }}>
                      <FaEdit />
                    </button>
                    <button className="btn-delete" onClick={() => deleteCost(cost.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredCosts.length === 0 && <p className="no-data">Нет расходов по выбранным фильтрам.</p>}
      </div>

      {/* 5. Регулярные платежи */}
      <div className="recurring-section">
        <h3>📅 Регулярные траты (автоплатежи)</h3>
        <div className="recurring-list">
          {recurring.map(r => {
            const cat = getCategory(r.categoryId);
            return (
              <div key={r.id} className="recurring-item">
                <span className="rec-name">{r.name}</span>
                <span className="rec-amount">{r.amount} ₽</span>
                <span className="rec-day">ежемесячно {r.dayOfMonth} числа</span>
                <span className="rec-cat">{cat?.icon} {cat?.name}</span>
                <button className="btn-delete" onClick={() => deleteRecurring(r.id)}><FaTrash /></button>
              </div>
            );
          })}
        </div>
        <button className="btn-add-recurring" onClick={() => {
          const name = prompt('Название платежа:');
          if (!name) return;
          const amount = parseFloat(prompt('Сумма:') || '0');
          if (!amount) return;
          const day = parseInt(prompt('День списания (число месяца):') || '1');
          const catId = prompt('ID категории (c1-с5):') || 'c2';
          addRecurring({
            name,
            amount,
            categoryId: catId,
            dayOfMonth: day,
            userId: 'u1',
            familyId: 'f1',
            isActive: true,
            note: '',
          });
        }}>
          <FaPlus /> Добавить автоплатёж
        </button>
      </div>

      {/* Модалка добавления/редактирования */}
      {showAddModal && (
        <AddCostModal
          cost={editingCost}
          onSave={(costData) => {
            if (editingCost) {
              editCost(editingCost.id, costData);
            } else {
              addCost({ ...costData, familyId: 'f1', id: '' } as Cost);
            }
            setShowAddModal(false);
            setEditingCost(null);
          }}
          onCancel={() => { setShowAddModal(false); setEditingCost(null); }}
          users={mockUsers}
          categories={mockCategories}
        />
      )}

      {/* Модалка разделения чека */}
      {showSplitModal && (
        <SplitModal
          cost={showSplitModal}
          users={mockUsers}
          onSplit={(participants) => handleSplit(showSplitModal, participants)}
          onCancel={() => setShowSplitModal(null)}
        />
      )}
    </div>
  );
};

// ================ ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ================

// Модалка добавления/редактирования расхода
const AddCostModal: React.FC<{
  cost: Cost | null;
  onSave: (cost: Partial<Cost>) => void;
  onCancel: () => void;
  users: User[];
  categories: Category[];
}> = ({ cost, onSave, onCancel, users, categories }) => {
  const [form, setForm] = useState<Partial<Cost>>(cost || {
    amount: 0,
    categoryId: categories[0]?.id || '',
    date: new Date().toISOString().slice(0,10),
    userId: users[0]?.id || '',
    place: '',
    paymentMethod: 'cash',
    isShared: true,
    forWhom: '',
    note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{cost ? 'Редактировать расход' : 'Добавить расход'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Сумма (₽)</label>
            <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Категория</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Дата</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Кто потратил</label>
            <select name="userId" value={form.userId} onChange={handleChange}>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Место покупки</label>
            <input type="text" name="place" value={form.place || ''} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Способ оплаты</label>
            <select name="paymentMethod" value={form.paymentMethod || 'cash'} onChange={handleChange}>
              <option value="cash">Наличные</option>
              <option value="card_mir">Карта Мир</option>
              <option value="credit_card">Кредитная карта</option>
              <option value="electronic">Электронные</option>
            </select>
          </div>
          <div className="form-row checkbox">
            <label>
              <input type="checkbox" name="isShared" checked={form.isShared} onChange={handleChange} />
              Общий расход (из семейного бюджета)
            </label>
          </div>
          <div className="form-row">
            <label>Для кого (тег)</label>
            <input type="text" name="forWhom" value={form.forWhom || ''} onChange={handleChange} placeholder="например, Дети" />
          </div>
          <div className="form-row">
            <label>Комментарий</label>
            <input type="text" name="note" value={form.note || ''} onChange={handleChange} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onCancel}>Отмена</button>
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Модалка разделения чека
const SplitModal: React.FC<{
  cost: Cost;
  users: User[];
  onSplit: (participants: { userId: string; share: number }[]) => void;
  onCancel: () => void;
}> = ({ cost, users, onSplit, onCancel }) => {
  const [participants, setParticipants] = useState<{ userId: string; share: number }[]>(
    users.map(u => ({ userId: u.id, share: 0 }))
  );

  const total = cost.amount;

  const handleShareChange = (userId: string, value: number) => {
    setParticipants(prev => prev.map(p => p.userId === userId ? { ...p, share: Math.min(value, total) } : p));
  };

  const handleAutoSplit = () => {
    const count = participants.filter(p => p.share > 0).length || participants.length;
    const share = Math.round(total / count);
    setParticipants(prev => prev.map(p => ({ ...p, share })));
  };

  const handleSubmit = () => {
    const valid = participants.filter(p => p.share > 0);
    if (valid.length === 0) { alert('Укажите доли хотя бы для одного участника'); return; }
    const sum = valid.reduce((s, p) => s + p.share, 0);
    if (sum !== total) { alert(`Сумма долей (${sum}) не равна общей сумме (${total})`); return; }
    onSplit(valid);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content split-modal" onClick={e => e.stopPropagation()}>
        <h2>Разделить чек</h2>
        <p>Общая сумма: <strong>{total} ₽</strong></p>
        <div className="split-participants">
          {participants.map(p => {
            const user = users.find(u => u.id === p.userId);
            return (
              <div key={p.userId} className="split-row">
                <span>{user?.name}</span>
                <input
                  type="number"
                  value={p.share}
                  onChange={e => handleShareChange(p.userId, parseFloat(e.target.value) || 0)}
                  min={0} max={total}
                />
                <span>₽</span>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={handleAutoSplit}>Поровну</button>
        <div className="modal-actions">
          <button type="button" onClick={onCancel}>Отмена</button>
          <button type="button" onClick={handleSubmit}>Разделить</button>
        </div>
      </div>
    </div>
  );
};

export default Costs;
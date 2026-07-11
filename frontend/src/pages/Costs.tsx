import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  FaPlus,
  FaTrash,
  FaEdit,
    FaUsers,
  FaBalanceScale,
  FaChartPie,
  FaChartBar,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';

// Импортируем API-клиент и типы
import { costsApi, categoriesApi, usersApi, Cost, Category, User } from '../api/client';

// Цвета для диаграммы
const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

// Хук для сохранения состояния в localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

const Costs: React.FC = () => {
  // ============================================
  // 1. СОСТОЯНИЯ ДЛЯ ДАННЫХ С СЕРВЕРА
  // ============================================
  
  const [costs, setCosts] = useState<Cost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // 2. СОСТОЯНИЯ ФИЛЬТРОВ (из localStorage)
  // ============================================
  
  const [filterUser, setFilterUser] = useLocalStorage<string>('costs_filterUser', 'all');
  const [filterPayment, setFilterPayment] = useLocalStorage<string>('costs_filterPayment', 'all');
  const [filterShared, setFilterShared] = useLocalStorage<string>('costs_filterShared', 'all');
  const [searchQuery, setSearchQuery] = useLocalStorage<string>('costs_searchQuery', '');
  const [chartType, setChartType] = useLocalStorage<'pie' | 'bar' | 'trend'>('costs_chartType', 'pie');

  // Для модалок
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [showSplitModal, setShowSplitModal] = useState<Cost | null>(null);

  // Текущий месяц (автоматически)
  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  // ============================================
  // 3. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
  // ============================================
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Загружаем все данные параллельно
        const [costsData, categoriesData, usersData] = await Promise.all([
          costsApi.getAll(),
          categoriesApi.getAll(),
          usersApi.getAll(),
        ]);
        
        setCosts(costsData);
        setCategories(categoriesData);
        setUsers(usersData);
        
        console.log('✅ Расходы загружены:', costsData.length);
        console.log('✅ Категории загружены:', categoriesData.length);
        console.log('✅ Пользователи загружены:', usersData.length);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки данных';
        setError(errorMessage);
        console.error('❌ Ошибка загрузки:', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Пустой массив = загрузка при монтировании

  // ============================================
  // 4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ============================================
  
  // Получить имя пользователя по id
  const getUserName = useCallback((id: string) => {
    const user = users.find(u => u.id === id);
    return user?.name || id;
  }, [users]);  // ← ПРАВИЛЬНО: useCallback обёрнут

  // Получить категорию по id
  const getCategory = useCallback((id: string) => {
    return categories.find(c => c.id === id);
  }, [categories]);  // ← ПРАВИЛЬНО: useCallback обёрнут

  // Получить название категории
  const getCategoryName = useCallback((id: string) => {
    const cat = getCategory(id);
    return cat?.name || 'Без категории';
  }, [getCategory]);  // ← ПРАВИЛЬНО: useCallback обёрнут

  // ============================================
  // 5. ФИЛЬТРАЦИЯ И ГРУППИРОВКА
  // ============================================
  
  const filteredCosts = useMemo(() => {
  return costs.filter(cost => {
    // Поиск по тексту
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const noteMatch = cost.note?.toLowerCase().includes(searchLower) || false;
      const placeMatch = cost.place?.toLowerCase().includes(searchLower) || false;
      const categoryMatch = getCategoryName(cost.categoryId).toLowerCase().includes(searchLower);
      const userMatch = getUserName(cost.userId).toLowerCase().includes(searchLower);
      const forWhomMatch = cost.forWhom?.toLowerCase().includes(searchLower) || false;
      
      if (!noteMatch && !placeMatch && !categoryMatch && !userMatch && !forWhomMatch) {
        return false;
      }
    }
    
    // Фильтр по пользователю
    if (filterUser !== 'all' && cost.userId !== filterUser) return false;
    
    // Фильтр по способу оплаты
    if (filterPayment !== 'all' && cost.paymentMethod !== filterPayment) return false;
    
    // Фильтр по типу (общий/личный)
    if (filterShared === 'shared' && !cost.isShared) return false;
    if (filterShared === 'personal' && cost.isShared) return false;
    
    return true;
  });
}, [costs, searchQuery, filterUser, filterPayment, filterShared, getCategoryName, getUserName]);

  // Расходы за текущий месяц
  const monthlyCosts = useMemo(() => {
    return costs.filter(c => c.date.startsWith(currentMonth));
  }, [costs, currentMonth]);

  const totalMonth = monthlyCosts.reduce((sum, c) => sum + c.amount, 0);
  const income = 50000; // Доход (можно получать с сервера)
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
  }, [monthlyCosts, totalMonth, getCategory]);

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
  const catSums: Record<string, number> = {};
  let uncategorizedSum = 0;
  
  filteredCosts.forEach(c => {
    const category = getCategory(c.categoryId);
    if (category) {
      // Если категория существует - суммируем по её ID
      catSums[c.categoryId] = (catSums[c.categoryId] || 0) + c.amount;
    } else {
      // Если категории нет - добавляем в "Без категории"
      uncategorizedSum += c.amount;
    }
  });
  
  // Формируем массив для диаграммы
  const result = Object.entries(catSums)
    .map(([catId, sum]) => ({
      name: getCategoryName(catId),
      value: sum,
      color: COLORS[Object.keys(catSums).indexOf(catId) % COLORS.length],
    }))
    .filter(item => item.value > 0);
  
  // Добавляем "Без категории" если есть такие расходы
  if (uncategorizedSum > 0) {
    result.push({
      name: 'Без категории',
      value: uncategorizedSum,
      color: '#95a5a6', // Серый цвет для некатегоризированных
    });
  }
  
  // Сортируем по убыванию суммы
  result.sort((a, b) => b.value - a.value);
  
  // Добавляем проценты
  const total = result.reduce((s, d) => s + d.value, 0);
  return result.map(item => ({
    ...item,
    percentage: total ? Math.round((item.value / total) * 100) : 0,
  }));
}, [filteredCosts, getCategory, getCategoryName]);

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

  // Динамика к прошлому месяцу
  const trend = useMemo(() => {
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
    const prevTotal = costs.filter(c => c.date.startsWith(prevMonthStr)).reduce((s, c) => s + c.amount, 0);
    const diff = totalMonth - prevTotal;
    const percent = prevTotal ? Math.round(diff / prevTotal * 100) : 0;
    return { diff, percent, prevTotal };
  }, [costs, totalMonth]);

  // ============================================
  // 6. ОБРАБОТЧИКИ
  // ============================================
  
  const addCost = (cost: Omit<Cost, 'id'>) => {
    // Отправляем на сервер
    costsApi.create(cost)
      .then(newCost => {
        setCosts(prev => [newCost, ...prev]);
        setShowAddModal(false);
        console.log('✅ Расход создан:', newCost);
      })
      .catch(err => {
        console.error('❌ Ошибка создания расхода:', err);
        alert('Ошибка при создании расхода');
      });
  };

  const editCost = (id: string, updated: Partial<Cost>) => {
    costsApi.update(id, updated)
      .then(updatedCost => {
        setCosts(prev => prev.map(c => c.id === id ? updatedCost : c));
        setShowAddModal(false);
        setEditingCost(null);
        console.log('✅ Расход обновлён:', updatedCost);
      })
      .catch(err => {
        console.error('❌ Ошибка обновления расхода:', err);
        alert('Ошибка при обновлении расхода');
      });
  };

  const deleteCost = (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот расход?')) return;
    
    costsApi.delete(id)
      .then(() => {
        setCosts(prev => prev.filter(c => c.id !== id));
        console.log('✅ Расход удалён:', id);
      })
      .catch(err => {
        console.error('❌ Ошибка удаления расхода:', err);
        alert('Ошибка при удалении расхода');
      });
  };

  // ============================================
  // 7. ОТОБРАЖЕНИЕ ЗАГРУЗКИ
  // ============================================
  
  if (loading) {
    return (
      <div className="costs-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // 8. ОТОБРАЖЕНИЕ ОШИБКИ
  // ============================================
  
  if (error) {
    return (
      <div className="costs-page">
        <div className="error-container">
          <h2>⚠️ Ошибка загрузки</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  // ============================================
  // 9. ОСНОВНОЙ РЕНДЕР
  // ============================================
  
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

      {/* 2. Поиск и фильтры */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по расходам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <FaTimes className="clear-search" onClick={() => setSearchQuery('')} />
          )}
        </div>

        <div className="filter-group">
          <label>Кто потратил</label>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)}>
            <option value="all">Все</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
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
          {chartType === 'pie' && (
  <div className="pie-chart-container">
    {pieData.length === 0 ? (
      <p className="no-data">Нет данных для отображения</p>
    ) : (
      <>
        <svg width="320" height="320" viewBox="0 0 320 320">
          {(() => {
            const centerX = 160;
            const centerY = 160;
            const radius = 130;
            let startAngle = -90;
            const total = pieData.reduce((s, d) => s + d.value, 0);

            // Сортируем данные по убыванию для лучшего отображения меток
            const sortedData = [...pieData].sort((a, b) => b.value - a.value);

            return sortedData.map((item, index) => {
              const angle = (item.value / total) * 360;
              const endAngle = startAngle + angle;
              
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = centerX + radius * Math.cos(startRad);
              const y1 = centerY + radius * Math.sin(startRad);
              const x2 = centerX + radius * Math.cos(endRad);
              const y2 = centerY + radius * Math.sin(endRad);
              
              const largeArc = angle > 180 ? 1 : 0;
              
              const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
              
              // Вычисляем позицию для метки (на середине сектора, на расстоянии 70% от центра)
              const midAngleDeg = (startAngle + endAngle) / 2;
              const midAngleRad = (midAngleDeg * Math.PI) / 180;
              const labelRadius = radius * 0.7;
              const labelX = centerX + labelRadius * Math.cos(midAngleRad);
              const labelY = centerY + labelRadius * Math.sin(midAngleRad);
              
              // Для маленьких секторов выносим метку наружу
              const isSmall = item.percentage < 10;
              const outerRadius = radius * 1.1;
              const outerX = centerX + outerRadius * Math.cos(midAngleRad);
              const outerY = centerY + outerRadius * Math.sin(midAngleRad);
              
              const result = {
                path,
                color: item.color,
                percentage: item.percentage,
                name: item.name,
                value: item.value,
                labelX: isSmall ? outerX : labelX,
                labelY: isSmall ? outerY : labelY,
                midAngleRad,
                isSmall,
                showLabel: item.percentage > 4, // показываем метки для секторов больше 4%
              };
              
              startAngle = endAngle;
              return result;
            }).map((segment, idx) => (
              <g key={idx}>
                {/* Сектор */}
                <path
                  d={segment.path}
                  fill={segment.color}
                  stroke="#fff"
                  strokeWidth="2"
                  className="pie-segment"
                />
                
                {/* Метка с процентом */}
                {segment.showLabel && (
                  <>
                    {/* Линия-указатель для маленьких секторов */}
                    {segment.isSmall && (
                      <line
                        x1={130 * Math.cos(segment.midAngleRad) + 160}
                        y1={130 * Math.sin(segment.midAngleRad) + 160}
                        x2={segment.labelX}
                        y2={segment.labelY}
                        stroke={segment.color}
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                      />
                    )}
                    <text
                      x={segment.labelX}
                      y={segment.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={segment.isSmall ? "11" : "14"}
                      fill={segment.isSmall ? segment.color : "#fff"}
                      fontWeight={segment.isSmall ? "600" : "bold"}
                      style={segment.isSmall ? {} : { textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                    >
                      {segment.percentage}%
                    </text>
                    
                  </>
                )}
              </g>
            ));
          })()}
          
          {/* Центральный круг с суммой */}
          <circle cx="160" cy="160" r="55" fill="#fff" />
          <text
            x="160"
            y="154"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#2c3e50"
          >
            {pieData.reduce((s, d) => s + d.value, 0).toLocaleString()} ₽
          </text>
          <text
            x="160"
            y="176"
            textAnchor="middle"
            fontSize="12"
            fill="#7f8c8d"
          >
            всего
          </text>
        </svg>
        
        {/* Легенда */}
        <div className="pie-legend">
          {pieData.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span className="legend-label">{item.name}</span>
              <span className="legend-percentage">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
)}
          
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

      {/* 4. Таблица расходов */}
      <div className="cost-table-wrapper">
        <table className="cost-table">
          <thead>
            <tr>
              <th>Категория</th>
              <th>Сумма</th>
              <th>Дата</th>
              <th>Место</th>
              <th>Кто</th>
              <th>Способ</th>
              <th>Тип</th>
              <th>Для кого</th>
              <th>Примечание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCosts.map(cost => {
              const cat = getCategory(cost.categoryId);
              return (
                <tr key={cost.id}>
                  <td>
                    <span className="cat-icon">{cat?.icon || '📌'}</span>
                    {cat?.name || 'Без категории'}
                  </td>
                  <td className="amount">{cost.amount.toLocaleString()} ₽</td>
                  <td>{new Date(cost.date).toLocaleDateString('ru-RU')}</td>
                  <td>{cost.place || '-'}</td>
                  <td>{getUserName(cost.userId)}</td>
                  <td>{cost.paymentMethod || '-'}</td>
                  <td>{cost.isShared ? 'Общий' : 'Личный'}</td>
                  <td>{cost.forWhom || '-'}</td>
                  <td className="note-cell">{cost.note || '-'}</td>
                  <td className="actions">
                    <button 
                      className="btn-split" 
                      onClick={() => setShowSplitModal(cost)} 
                      title="Разделить чек"
                    >
                      <FaUsers />
                    </button>
                    <button 
                      className="btn-edit" 
                      onClick={() => { setEditingCost(cost); setShowAddModal(true); }}
                    >
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
        {filteredCosts.length === 0 && (
          <p className="no-data">Нет расходов по выбранным фильтрам.</p>
        )}
      </div>

      {/* Модалка добавления/редактирования */}
      {showAddModal && (
        <AddCostModal
          cost={editingCost}
          onSave={(costData) => {
            if (editingCost) {
              editCost(editingCost.id, costData);
            } else {
              addCost({ ...costData, familyId: 'f1' } as Omit<Cost, 'id'>);
            }
          }}
          onCancel={() => { setShowAddModal(false); setEditingCost(null); }}
          users={users}
          categories={categories}
        />
      )}

      {/* Модалка разделения чека */}
      {showSplitModal && (
        <SplitModal
          cost={showSplitModal}
          users={users}
          onSplit={(participants) => {
            alert(`Разделение чека на ${participants.length} участников`);
            setShowSplitModal(null);
          }}
          onCancel={() => setShowSplitModal(null)}
        />
      )}

      {/* Стили */}
      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          text-align: center;
          padding: 3rem;
          background: #fef5f5;
          border-radius: 8px;
          border: 1px solid #fde8e8;
        }
        
        .error-container h2 {
          color: #e74c3c;
          margin-bottom: 1rem;
        }
        
        .error-container button {
          margin-top: 1rem;
          padding: 0.5rem 1.5rem;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        
        .error-container button:hover {
          background: #2980b9;
        }
        
        .search-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        
        .search-input-wrapper .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #95a5a6;
        }
        
        .search-input-wrapper input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }
        
        .search-input-wrapper input:focus {
          outline: none;
          border-color: #3498db;
        }
        
        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #95a5a6;
          cursor: pointer;
        }
        
        .clear-search:hover {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
};

// ============================================
// 10. ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================

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
    date: new Date().toISOString().slice(0, 10),
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
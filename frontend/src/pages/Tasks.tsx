import React, { useState, useMemo, useEffect } from 'react';
import { FaSearch, FaPlus, FaFilter, FaTimes } from 'react-icons/fa';
import { BsCheckCircle, BsCircle, BsClock, BsExclamationTriangle } from 'react-icons/bs';
import { MdPriorityHigh } from 'react-icons/md';
import { useLocation } from 'react-router-dom';

// Импортируем API-клиент и типы
import { tasksApi, usersApi, Task, User } from '../api/client';

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

const Tasks: React.FC = () => {
  const location = useLocation();
  
  // ============================================
  // 1. СОСТОЯНИЯ ДЛЯ ДАННЫХ С СЕРВЕРА
  // ============================================
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // 2. СОСТОЯНИЯ ФИЛЬТРОВ (из localStorage)
  // ============================================
  
  const [searchQuery, setSearchQuery] = useLocalStorage('tasks_searchQuery', '');
  const [selectedTab, setSelectedTab] = useLocalStorage<'all' | 'today' | 'important' | 'week' | 'my'>('tasks_selectedTab', 'all');
  const [selectedAssignee, setSelectedAssignee] = useLocalStorage('tasks_selectedAssignee', 'all');
  const [selectedStatus, setSelectedStatus] = useLocalStorage<'all' | 'work' | 'done' | 'overdue'>('tasks_selectedStatus', 'all');
  const [selectedCategory, setSelectedCategory] = useLocalStorage('tasks_selectedCategory', 'all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useLocalStorage('tasks_showAdvancedFilters', false);
  const [sortBy, setSortBy] = useLocalStorage<'deadline' | 'priority' | 'assignee' | 'category'>('tasks_sortBy', 'deadline');
  const [sortOrder, setSortOrder] = useLocalStorage<'asc' | 'desc'>('tasks_sortOrder', 'asc');

  // Расширенные фильтры
  const [dateRange, setDateRange] = useLocalStorage('tasks_dateRange', { from: '', to: '' });
  const [selectedCreator, setSelectedCreator] = useLocalStorage('tasks_selectedCreator', 'all');
  const [showRecurringOnly, setShowRecurringOnly] = useLocalStorage('tasks_showRecurringOnly', false);

  // Флаг для отслеживания инициализации
  const [isInitialized, setIsInitialized] = useState(() => {
    return sessionStorage.getItem('tasks_initialized') === 'true';
  });

  // ============================================
  // 3. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
  // ============================================
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Загружаем задачи и пользователей параллельно
        const [tasksData, usersData] = await Promise.all([
          tasksApi.getAll(),
          usersApi.getAll(),
        ]);
        
        setTasks(tasksData);
        setUsers(usersData);
        console.log('✅ Задачи загружены:', tasksData.length);
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
  // 4. ОЧИСТКА ФИЛЬТРОВ ПРИ ПЕРВОМ ЗАХОДЕ
  // ============================================
  
  useEffect(() => {
    if (!isInitialized) {
      const filterKeys = [
        'tasks_searchQuery',
        'tasks_selectedTab',
        'tasks_selectedAssignee',
        'tasks_selectedStatus',
        'tasks_selectedCategory',
        'tasks_showAdvancedFilters',
        'tasks_sortBy',
        'tasks_sortOrder',
        'tasks_dateRange',
        'tasks_selectedCreator',
        'tasks_showRecurringOnly'
      ];
      
      filterKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      sessionStorage.setItem('tasks_initialized', 'true');
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Очистка при уходе со страницы
  useEffect(() => {
    const currentPath = location.pathname;

    const handleBeforeUnload = () => {
      const filterKeys = [
        'tasks_searchQuery',
        'tasks_selectedTab',
        'tasks_selectedAssignee',
        'tasks_selectedStatus',
        'tasks_selectedCategory',
        'tasks_showAdvancedFilters',
        'tasks_sortBy',
        'tasks_sortOrder',
        'tasks_dateRange',
        'tasks_selectedCreator',
        'tasks_showRecurringOnly'
      ];
      
      filterKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      sessionStorage.removeItem('tasks_initialized');
      setIsInitialized(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (currentPath === '/tasks' || currentPath.startsWith('/tasks/')) {
        const filterKeys = [
          'tasks_searchQuery',
          'tasks_selectedTab',
          'tasks_selectedAssignee',
          'tasks_selectedStatus',
          'tasks_selectedCategory',
          'tasks_showAdvancedFilters',
          'tasks_sortBy',
          'tasks_sortOrder',
          'tasks_dateRange',
          'tasks_selectedCreator',
          'tasks_showRecurringOnly'
        ];
        
        filterKeys.forEach(key => {
          localStorage.removeItem(key);
        });
        sessionStorage.removeItem('tasks_initialized');
        setIsInitialized(false);
      }
    };
  }, [location.pathname]);

  // ============================================
  // 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ============================================
  
  // Получение имени пользователя
  const getMemberName = (id?: string) => {
    if (!id) return 'Не назначен';
    const user = users.find(u => u.id === id);
    return user?.name || 'Неизвестный';
  };

  // Получение эмодзи для категории
  const getCategoryEmoji = (category: string) => {
    const map: Record<string, string> = {
      home: '🏠',
      kids: '👶',
      work: '💼',
      finance: '💰',
      repair: '🔧',
      health: '🏥'
    };
    return map[category] || '📌';
  };

  // Получение цвета статуса
  const getStatusColor = (status: string, deadline?: string) => {
    if (status === 'done') return '#27ae60';
    if (status === 'archived') return '#95a5a6';
    const today = new Date().toISOString().split('T')[0];
    if (deadline && deadline < today) return '#e74c3c';
    if (deadline === today) return '#f39c12';
    return '#3498db';
  };

  // Получение иконки статуса
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <BsCheckCircle style={{ color: '#27ae60' }} />;
      case 'archived':
        return <BsCircle style={{ color: '#95a5a6' }} />;
      default:
        return <BsClock style={{ color: '#3498db' }} />;
    }
  };

  // ============================================
  // 6. ПОДСЧЁТ ПРОСРОЧЕННЫХ ЗАДАЧ
  // ============================================
  
  const overdueCounts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const counts: Record<string, number> = {};
    
    users.forEach(user => {
      counts[user.id] = tasks.filter(task => 
        task.assigneeId === user.id &&
        task.status === 'work' &&
        task.deadline &&
        task.deadline < today
      ).length;
    });
    
    return counts;
  }, [tasks, users]);

  // ============================================
  // 7. ФИЛЬТРАЦИЯ ЗАДАЧ
  // ============================================
  
  const filteredTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekAhead = new Date();
    weekAhead.setDate(weekAhead.getDate() + 7);
    const weekAheadStr = weekAhead.toISOString().split('T')[0];

    return tasks.filter(task => {
      // Поиск
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Быстрые вкладки
      if (selectedTab === 'today') {
        const isOverdue = task.deadline && task.deadline < today;
        if (task.deadline !== today && !isOverdue) return false;
        if (task.status === 'done') return false;
      }
      if (selectedTab === 'important' && (task.priority || 'low') !== 'high') return false;
      if (selectedTab === 'week') {
        if (!task.deadline || task.deadline > weekAheadStr || task.deadline < today) return false;
        if (task.status === 'done') return false;
      }
      if (selectedTab === 'my' && task.assigneeId !== 'u1') return false;

      // Статус
      if (selectedStatus === 'overdue') {
        if (!task.deadline || task.deadline >= today || task.status === 'done') return false;
      } else if (selectedStatus !== 'all' && task.status !== selectedStatus) {
        return false;
      }

      // Исполнитель
      if (selectedAssignee !== 'all' && task.assigneeId !== selectedAssignee) return false;

      // Категория
      if (selectedCategory !== 'all' && (task.category || '') !== selectedCategory) return false;

      // Расширенные фильтры
      if (dateRange.from && task.deadline && task.deadline < dateRange.from) return false;
      if (dateRange.to && task.deadline && task.deadline > dateRange.to) return false;
      if (selectedCreator !== 'all' && task.creatorId !== selectedCreator) return false;
      if (showRecurringOnly && !task.isRecurring) return false;

      return true;
    });
  }, [tasks, searchQuery, selectedTab, selectedAssignee, selectedStatus, selectedCategory, 
      dateRange, selectedCreator, showRecurringOnly]);

  // ============================================
  // 8. СОРТИРОВКА ЗАДАЧ
  // ============================================
  
  const sortedTasks = useMemo(() => {
  const sorted = [...filteredTasks];
  const order = sortOrder === 'asc' ? 1 : -1;
  
  switch (sortBy) {
    case 'deadline':
      sorted.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return (a.deadline < b.deadline ? -1 : 1) * order;
      });
      break;
      
    case 'priority':
      const priorityMap = { high: 3, medium: 2, low: 1 };
      sorted.sort((a, b) => {
        const aPriority = a.priority || 'low';
        const bPriority = b.priority || 'low';
        return (priorityMap[aPriority] - priorityMap[bPriority]) * order;
      });
      break;
      
    case 'assignee':
      sorted.sort((a, b) => {
        const nameA = getMemberName(a.assigneeId);
        const nameB = getMemberName(b.assigneeId);
        return nameA.localeCompare(nameB) * order;
      });
      break;
      
    case 'category':
      sorted.sort((a, b) => {
        const aCat = a.category || '';
        const bCat = b.category || '';
        return aCat.localeCompare(bCat) * order;
      });
      break;
  }
  
  return sorted;
}, [filteredTasks, sortBy, sortOrder]);

  // ============================================
  // 9. ОБРАБОТЧИКИ
  // ============================================
  
  const handleSortChange = (newSortBy: 'deadline' | 'priority' | 'assignee' | 'category') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTab('all');
    setSelectedAssignee('all');
    setSelectedStatus('all');
    setSelectedCategory('all');
    setDateRange({ from: '', to: '' });
    setSelectedCreator('all');
    setShowRecurringOnly(false);
    setShowAdvancedFilters(false);
  };

  // ============================================
  // 10. ОТОБРАЖЕНИЕ ЗАГРУЗКИ
  // ============================================
  
  if (loading) {
    return (
      <div className="tasks-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка задач...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // 11. ОТОБРАЖЕНИЕ ОШИБКИ
  // ============================================
  
  if (error) {
    return (
      <div className="tasks-page">
        <div className="error-container">
          <h2>⚠️ Ошибка загрузки</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  // ============================================
  // 12. ОСНОВНОЙ РЕНДЕР
  // ============================================
  
  return (
    <div className="tasks-page">
      {/* Заголовок */}
      <div className="tasks-header">
        <div className="tasks-title-section">
          <h1>Задачи</h1>
          <div className="tasks-stats">
            <span className="stat-item">
              <BsCircle className="stat-icon" />
              Активных: {tasks.filter(t => t.status === 'work').length}
            </span>
            <span className="stat-item">
              <BsCheckCircle className="stat-icon" style={{ color: '#27ae60' }} />
              Выполнено: {tasks.filter(t => t.status === 'done').length}
            </span>
            <span className="stat-item">
              Всего: {tasks.length}
            </span>
          </div>
        </div>
        <button className="add-task-btn" onClick={() => alert('Открыть форму создания задачи')}>
          <FaPlus /> Новая задача
        </button>
      </div>

      {/* Виджет просроченных задач */}
      {Object.entries(overdueCounts).some(([_, count]) => count > 0) && (
        <div className="overdue-widget">
          <BsExclamationTriangle style={{ color: '#e74c3c', marginRight: '0.5rem' }} />
          <span>
            {Object.entries(overdueCounts)
              .filter(([_, count]) => count > 0)
              .map(([id, count]) => {
                const name = getMemberName(id);
                return `У ${name} просрочено ${count} задач`;
              })
              .join(', ')}
          </span>
        </div>
      )}

      {/* Поисковая строка */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Найти задачу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <FaTimes className="clear-search" onClick={() => setSearchQuery('')} />
          )}
        </div>
        <button 
          className={`filter-toggle ${showAdvancedFilters ? 'active' : ''}`}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <FaFilter /> Фильтры
        </button>
      </div>

      {/* Быстрые вкладки */}
      <div className="quick-tabs">
        {[
          { id: 'all', label: '📋 Все задачи' },
          { id: 'today', label: '⏰ На сегодня' },
          { id: 'important', label: '⭐ Важное' },
          { id: 'week', label: '📅 На неделю' },
          { id: 'my', label: '👤 Мои задачи' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${selectedTab === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Основные фильтры */}
      <div className="main-filters">
        <select 
          value={selectedAssignee} 
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="filter-select"
        >
          <option value="all">👥 Все исполнители</option>
          <option value="u1">👤 Я (Алексей)</option>
          {users.filter(u => u.id !== 'u1').map(u => (
            <option key={u.id} value={u.id}>👤 {u.name}</option>
          ))}
        </select>

        <div className="status-filters">
          <button
            className={`status-btn ${selectedStatus === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('all')}
          >
            Все
          </button>
          <button
            className={`status-btn ${selectedStatus === 'work' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('work')}
          >
            Активные
          </button>
          <button
            className={`status-btn ${selectedStatus === 'done' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('done')}
          >
            Выполненные
          </button>
          <button
            className={`status-btn overdue ${selectedStatus === 'overdue' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('overdue')}
          >
            Просроченные
          </button>
        </div>

        <div className="category-filters">
          <button
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Все
          </button>
          {[
            { id: 'home', emoji: '🏠', label: 'Дом' },
            { id: 'kids', emoji: '👶', label: 'Дети' },
            { id: 'work', emoji: '💼', label: 'Работа' },
            { id: 'finance', emoji: '💰', label: 'Финансы' },
            { id: 'repair', emoji: '🔧', label: 'Ремонт' },
            { id: 'health', emoji: '🏥', label: 'Здоровье' }
          ].map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="advanced-row">
            <div className="filter-group">
              <label>Период (Дата)</label>
              <div className="date-range">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
                <span>—</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
            </div>
            <div className="filter-group">
              <label>Автор задачи</label>
              <select 
                value={selectedCreator} 
                onChange={(e) => setSelectedCreator(e.target.value)}
                className="filter-select"
              >
                <option value="all">Все авторы</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Повторяемость</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showRecurringOnly}
                  onChange={(e) => setShowRecurringOnly(e.target.checked)}
                />
                Только регулярные задачи
              </label>
            </div>
          </div>
          <button className="reset-filters-btn" onClick={resetFilters}>
            <FaTimes /> Сбросить все фильтры
          </button>
        </div>
      )}

      {/* Сортировка */}
      <div className="tasks-list-header">
        <div className="sort-controls">
          <span className="sort-label">Сортировка:</span>
          <button
            className={`sort-btn ${sortBy === 'deadline' ? 'active' : ''}`}
            onClick={() => handleSortChange('deadline')}
          >
            По дате {sortBy === 'deadline' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`sort-btn ${sortBy === 'priority' ? 'active' : ''}`}
            onClick={() => handleSortChange('priority')}
          >
            По приоритету {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`sort-btn ${sortBy === 'assignee' ? 'active' : ''}`}
            onClick={() => handleSortChange('assignee')}
          >
            По исполнителю {sortBy === 'assignee' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`sort-btn ${sortBy === 'category' ? 'active' : ''}`}
            onClick={() => handleSortChange('category')}
          >
            По категории {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
        <span className="tasks-count">Найдено: {sortedTasks.length}</span>
      </div>

      {/* Список задач */}
      <div className="tasks-list">
        {sortedTasks.length === 0 ? (
          <div className="empty-tasks">
            <p>😊 Задачи не найдены</p>
            <p className="empty-subtext">Попробуйте изменить фильтры или создайте новую задачу</p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <div key={task.id} className="task-item" style={{ borderLeftColor: getStatusColor(task.status, task.deadline) }}>
              <div className="task-check">
                {task.status === 'done' ? (
                  <BsCheckCircle style={{ color: '#27ae60', fontSize: '1.2rem' }} />
                ) : (
                  <BsCircle style={{ color: '#bdc3c7', fontSize: '1.2rem', cursor: 'pointer' }} />
                )}
              </div>
              
              <div className="task-content">
                <div className="task-title-row">
                  <h3 className="task-title">
                    {task.title}
                    {task.isRecurring && <span className="recurring-badge">🔄</span>}
                  </h3>
                  <span className="task-category">
                    {getCategoryEmoji(task.category || '')} {task.category || 'Без категории'}
                  </span>
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                
                <div className="task-meta">
                  <span className="task-assignee">
                    👤 {getMemberName(task.assigneeId)}
                  </span>
                  <span className="task-creator">
                    📝 Создал: {getMemberName(task.creatorId)}
                  </span>
                  {task.deadline && (
                    <span 
                      className="task-deadline"
                      style={{ color: getStatusColor(task.status, task.deadline) }}
                    >
                      📅 {task.deadline}
                    </span>
                  )}
                  <span className="task-priority">
                    {task.priority === 'high' && <MdPriorityHigh color="#e74c3c" />}
                    {task.priority === 'low' && '🔽'}
                    {task.priority === 'medium' && '⚖️'}
                    {task.priority === 'high' ? ' Высокий' : 
                     task.priority === 'medium' ? ' Средний' : ' Низкий'}
                  </span>
                  <span 
                    className="task-status"
                    style={{ color: getStatusColor(task.status, task.deadline) }}
                  >
                    {getStatusIcon(task.status)} {task.status === 'work' ? 'В работе' : 
                     task.status === 'done' ? 'Выполнено' : 'Архив'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Добавляем стили для загрузки и ошибок */}
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
      `}</style>
    </div>
  );
};

export default Tasks;
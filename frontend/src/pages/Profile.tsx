// src/pages/Profile.tsx
import React, { useState } from 'react';
import { 
  FaShieldAlt, FaWallet, FaCog,
  FaUsers, FaBell, FaClock,
  FaQrcode,
  FaTrophy, FaStar, FaCoins, FaTasks, FaMoneyBillWave
} from 'react-icons/fa';
import { 
  FiUser, FiMail, FiLock, FiGlobe, FiMonitor,
  FiDatabase, FiDownload,
  FiAlertTriangle, FiKey
} from 'react-icons/fi';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  
  // Состояния для личных данных
  const [profileData, setProfileData] = useState({
    firstName: 'Алексей',
    lastName: 'Иванов',
    email: 'aleksey@familyhub.ru',
    phone: '+7 (999) 123-45-67',
    birthday: '15.08.1985',
    familyAnniversary: '01.06.2020',
    status: '🏠 Дома',
    themeColor: '#3498db',
    currency: 'RUB',
    dateFormat: 'DD.MM.YYYY',
    weekStart: 'monday'
  });

  // Состояние для финансов
  const [wallets] = useState([
    { id: 1, name: 'Основная карта', balance: 15000, limit: 50000, icon: '💳' },
    { id: 2, name: 'Наличные', balance: 500, limit: 10000, icon: '💵' },
    { id: 3, name: 'Копилка', balance: 100000, limit: 200000, icon: '🏦' }
  ]);

  // Семейные метрики
  const familyMetrics = {
    tasksCompleted: 12,
    tasksRank: 1,
    totalSpent: 45000,
    purchases: 23,
    topCategory: 'Еда',
    budgetContribution: 35,
    familyMembers: [
      { name: 'Алексей', status: 'online', avatar: '👨', role: 'Глава семьи' },
      { name: 'Мария', status: 'online', avatar: '👩', role: 'Участник' },
      { name: 'София', status: 'offline', avatar: '👧', role: 'Ребенок' },
      { name: 'Михаил', status: 'today', avatar: '👦', role: 'Ребенок' }
    ]
  };

  // История входов
  const loginHistory = [
    { date: 'Сегодня, 14:30', ip: '192.168.1.1', device: 'iPhone 15 Pro', browser: 'Safari' },
    { date: 'Вчера, 22:15', ip: '192.168.1.1', device: 'MacBook Pro', browser: 'Chrome' },
    { date: '20.06.2026, 09:00', ip: '10.0.0.5', device: 'iPhone 15 Pro', browser: 'Safari' }
  ];

  const renderPersonalData = () => (
    <div className="profile-section">
      <div className="section-header">
        <h2>Личные данные</h2>
        <button className="edit-btn" onClick={() => setEditing(!editing)}>
          {editing ? 'Сохранить' : 'Редактировать'}
        </button>
      </div>

      <div className="profile-avatar-section">
        <div className="avatar-container">
          <div className="avatar-circle" style={{ background: profileData.themeColor }}>
            <span className="avatar-emoji">👨</span>
          </div>
          <div className="status-badge">
            <span>{profileData.status}</span>
          </div>
          <button className="change-avatar-btn">Изменить</button>
        </div>
        <div className="status-selector">
          <span>Статус:</span>
          <div className="status-options">
            <button className="status-option active" data-status="🏠 Дома">🏠</button>
            <button className="status-option" data-status="🏢 На работе">🏢</button>
            <button className="status-option" data-status="🚗 В дороге">🚗</button>
            <button className="status-option" data-status="🏖️ В отпуске">🏖️</button>
          </div>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label><FiUser /> Имя</label>
          <input 
            type="text" 
            value={profileData.firstName}
            disabled={!editing}
            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label><FiUser /> Фамилия</label>
          <input 
            type="text" 
            value={profileData.lastName}
            disabled={!editing}
            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label><FiMail /> Email</label>
          <input 
            type="email" 
            value={profileData.email}
            disabled={!editing}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>📱 Телефон</label>
          <input 
            type="tel" 
            value={profileData.phone}
            disabled={!editing}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>🎂 День рождения</label>
          <input 
            type="text" 
            value={profileData.birthday}
            disabled={!editing}
            onChange={(e) => setProfileData({...profileData, birthday: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>💍 Годовщина семьи</label>
          <input 
            type="text" 
            value={profileData.familyAnniversary}
            disabled={!editing}
            onChange={(e) => setProfileData({...profileData, familyAnniversary: e.target.value})}
          />
        </div>
      </div>

      <div className="personal-notes">
        <h3>📝 Мои заметки</h3>
        <textarea 
          placeholder="Пин-коды, размеры, важные даты..."
          rows={4}
          disabled={!editing}
        />
      </div>
    </div>
  );

  const renderFamilyModule = () => (
    <div className="profile-section">
      <h2><FaUsers /> Семейный модуль</h2>
      
      <div className="family-role-section">
        <div className="role-badge">
          <FaShieldAlt />
          <span>Ваша роль: <strong>Глава семьи (Администратор)</strong></span>
        </div>
        <p className="role-description">Вы можете добавлять/удалять участников и управлять общими настройками (TBD)</p>
      </div>

      <div className="family-members">
        <h3>Участники семьи</h3>
        <div className="members-grid">
          {familyMetrics.familyMembers.map((member, index) => (
            <div key={index} className="member-card">
              <div className="member-avatar">{member.avatar}</div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-role">{member.role}</div>
              </div>
              <div className={`member-status ${member.status}`}>
                {member.status === 'online' && '🟢 В сети'}
                {member.status === 'today' && '🟡 Был сегодня'}
                {member.status === 'offline' && '⚫ Не в сети'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialModule = () => (
    <div className="profile-section">
      <h2><FaWallet /> Финансовый модуль</h2>
      
      <div className="currency-settings">
        <div className="form-group">
          <label><FiGlobe /> Основная валюта</label>
          <select value={profileData.currency}>
            <option value="RUB">RUB ₽</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
          </select>
        </div>
      </div>

      <div className="wallets-section">
        <div className="section-header">
          <h3>Мои кошельки и счета</h3>
          <button className="add-btn">+ Добавить счет</button>
        </div>
        {wallets.map(wallet => (
          <div key={wallet.id} className="wallet-card">
            <div className="wallet-icon">{wallet.icon}</div>
            <div className="wallet-info">
              <div className="wallet-name">{wallet.name}</div>
              <div className="wallet-balance">{wallet.balance.toLocaleString()} ₽</div>
            </div>
            <div className="wallet-limit">
              Лимит: {wallet.limit.toLocaleString()} ₽
            </div>
            <div className="wallet-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${(wallet.balance / wallet.limit) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="notifications-settings">
        <h3><FaBell /> Уведомления о балансе</h3>
        <div className="notification-setting">
          <input type="checkbox" id="balanceAlert" defaultChecked />
          <label htmlFor="balanceAlert">Уведомлять при остатке менее 1000 ₽</label>
        </div>
        <div className="notification-setting">
          <input type="checkbox" id="largeSpending" />
          <label htmlFor="largeSpending">Уведомлять о тратах свыше 5000 ₽</label>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="profile-section">
      <h2><FaShieldAlt /> Безопасность и доступ</h2>
      
      <div className="security-grid">
        <div className="security-card">
          <div className="security-icon"><FiKey /></div>
          <div className="security-content">
            <h3>Двухфакторная аутентификация</h3>
            <p>Защитите аккаунт с помощью Google Authenticator</p>
            <button className="security-btn primary">Подключить 2FA</button>
          </div>
        </div>

        <div className="security-card">
          <div className="security-icon"><FiLock /></div>
          <div className="security-content">
            <h3>Пин-код для входа</h3>
            <p>Установите 4-значный пин-код для быстрого доступа</p>
            <button className="security-btn">Установить пин-код</button>
          </div>
        </div>

        <div className="security-card">
          <div className="security-icon"><FiMonitor /></div>
          <div className="security-content">
            <h3>Face ID / Touch ID</h3>
            <p>Вход по отпечатку пальца или распознаванию лица</p>
            <button className="security-btn">Настроить</button>
          </div>
        </div>
      </div>

      <div className="login-history">
        <h3><FaClock /> История входов</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Дата и время</th>
              <th>IP-адрес</th>
              <th>Устройство</th>
              <th>Браузер</th>
            </tr>
          </thead>
          <tbody>
            {loginHistory.map((login, index) => (
              <tr key={index}>
                <td>{login.date}</td>
                <td>{login.ip}</td>
                <td>{login.device}</td>
                <td>{login.browser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPersonalSettings = () => (
    <div className="profile-section">
      <h2><FaCog /> Персональные настройки</h2>
      
      <div className="settings-grid">
        <div className="setting-group">
          <h3>Цветовая тема</h3>
          <div className="color-options">
            {['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'].map(color => (
              <button 
                key={color}
                className={`color-option ${profileData.themeColor === color ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => setProfileData({...profileData, themeColor: color})}
              />
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>Формат даты</h3>
          <select value={profileData.dateFormat}>
            <option value="DD.MM.YYYY">DD.MM.YYYY</option>
            <option value="MM.DD.YYYY">MM.DD.YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div className="setting-group">
          <h3>Первый день недели</h3>
          <select value={profileData.weekStart}>
            <option value="monday">Понедельник</option>
            <option value="sunday">Воскресенье</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDataManagement = () => (
    <div className="profile-section">
      <h2><FiDatabase /> Управление данными</h2>
      
      <div className="data-actions">
        <div className="data-action-card">
          <FiDownload className="action-icon" />
          <div className="action-content">
            <h3>Экспорт данных</h3>
            <p>Скачайте все ваши данные в удобном формате</p>
            <div className="export-buttons">
              <button className="export-btn json">JSON</button>
              <button className="export-btn csv">CSV</button>
              <button className="export-btn pdf">PDF</button>
            </div>
          </div>
        </div>

        <div className="data-action-card danger">
          <FiAlertTriangle className="action-icon" />
          <div className="action-content">
            <h3>Удалить аккаунт</h3>
            <p>Это действие нельзя отменить. Все данные будут потеряны.</p>
            <button className="delete-account-btn">Удалить аккаунт</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFamilyContribution = () => (
    <div className="profile-section contribution-section">
      <div className="section-header">
        <h2><FaTrophy /> Ваш вклад в семью</h2>
        <div className="contribution-score">🏆 #1</div>
      </div>
      
      <div className="contribution-grid">
        <div className="contribution-card">
          <div className="contribution-icon"><FaTasks /></div>
          <div className="contribution-info">
            <div className="contribution-value">{familyMetrics.tasksCompleted}</div>
            <div className="contribution-label">Задач выполнено</div>
            <div className="contribution-rank">🥇 1-е место в семье!</div>
          </div>
        </div>

        <div className="contribution-card">
          <div className="contribution-icon"><FaMoneyBillWave /></div>
          <div className="contribution-info">
            <div className="contribution-value">{familyMetrics.totalSpent.toLocaleString()} ₽</div>
            <div className="contribution-label">Потрачено</div>
            <div className="contribution-detail">{familyMetrics.purchases} покупок</div>
          </div>
        </div>

        <div className="contribution-card">
          <div className="contribution-icon"><FaCoins /></div>
          <div className="contribution-info">
            <div className="contribution-value">{familyMetrics.budgetContribution}%</div>
            <div className="contribution-label">Вклад в бюджет</div>
            <div className="contribution-detail">Самая частая категория: {familyMetrics.topCategory}</div>
          </div>
        </div>

        <div className="contribution-card">
          <div className="contribution-icon"><FaStar /></div>
          <div className="contribution-info">
            <div className="contribution-value">⭐ 4.8</div>
            <div className="contribution-label">Рейтинг активности</div>
            <div className="contribution-detail">Вы в топе семьи!</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Профиль</h1>
        <p>Управление личными данными и семейными настройками</p>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <FiUser /> Личные данные
        </button>
        <button 
          className={`tab ${activeTab === 'family' ? 'active' : ''}`}
          onClick={() => setActiveTab('family')}
        >
          <FaUsers /> Семья
        </button>
        <button 
          className={`tab ${activeTab === 'finance' ? 'active' : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          <FaWallet /> Финансы
        </button>
        <button 
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <FaShieldAlt /> Безопасность
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog /> Настройки
        </button>
        <button 
          className={`tab ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          <FiDatabase /> Данные
        </button>
      </div>

      <div className="profile-content">
        {/* Виджет вклада всегда виден сверху */}
        {renderFamilyContribution()}

        {activeTab === 'personal' && renderPersonalData()}
        {activeTab === 'family' && renderFamilyModule()}
        {activeTab === 'finance' && renderFinancialModule()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'settings' && renderPersonalSettings()}
        {activeTab === 'data' && renderDataManagement()}
      </div>
    </div>
  );
};

export default Profile;
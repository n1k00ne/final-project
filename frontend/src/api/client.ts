const API_BASE_URL = 'http://localhost:5000/api';

// Базовый fetch с обработкой ошибок
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Ошибка ${response.status}: ${response.statusText}`);
  }

  // DELETE возвращает пустой ответ
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============ ЗАДАЧИ ============
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'work' | 'done' | 'archived';
  assigneeId?: string;
  creatorId: string;
  familyId: string;
  deadline?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: 'home' | 'kids' | 'work' | 'finance' | 'repair' | 'health';
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  createdAt?: string;
}

export const tasksApi = {
  // GET /api/tasks - получить все задачи
  getAll: (): Promise<Task[]> => {
    return fetchApi('/tasks');
  },

  // GET /api/tasks/:id - получить задачу по ID
  getById: (id: string): Promise<Task> => {
    return fetchApi(`/tasks/${id}`);
  },

  // POST /api/tasks - создать задачу
  create: (task: Omit<Task, 'id'>): Promise<Task> => {
    return fetchApi('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  // PUT /api/tasks/:id - обновить задачу
  update: (id: string, updates: Partial<Task>): Promise<Task> => {
    return fetchApi(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // DELETE /api/tasks/:id - удалить задачу
  delete: (id: string): Promise<void> => {
    return fetchApi(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ РАСХОДЫ ============
export interface Cost {
  id: string;
  amount: number;
  categoryId: string;
  note?: string;
  date: string;
  userId: string;
  familyId: string;
  place?: string;
  photo?: string;
  forWhom?: string;
  paymentMethod?: 'cash' | 'card_mir' | 'credit_card' | 'electronic';
  isShared?: boolean;
  splitInfo?: {
    totalAmount: number;
    participants: { userId: string; share: number }[];
  };
}

export const costsApi = {
  // GET /api/costs - получить все расходы
  getAll: (): Promise<Cost[]> => {
    return fetchApi('/costs');
  },

  // GET /api/costs/:id - получить расход по ID
  getById: (id: string): Promise<Cost> => {
    return fetchApi(`/costs/${id}`);
  },

  // POST /api/costs - создать расход
  create: (cost: Omit<Cost, 'id'>): Promise<Cost> => {
    return fetchApi('/costs', {
      method: 'POST',
      body: JSON.stringify(cost),
    });
  },

  // PUT /api/costs/:id - обновить расход
  update: (id: string, updates: Partial<Cost>): Promise<Cost> => {
    return fetchApi(`/costs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // DELETE /api/costs/:id - удалить расход
  delete: (id: string): Promise<void> => {
    return fetchApi(`/costs/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ КАТЕГОРИИ ============
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categoriesApi = {
  // GET /api/categories - получить все категории
  getAll: (): Promise<Category[]> => {
    return fetchApi('/categories');
  },
};

// ============ ПОЛЬЗОВАТЕЛИ ============
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
}

export const usersApi = {
  // GET /api/users - получить всех пользователей
  getAll: (): Promise<User[]> => {
    return fetchApi('/users');
  },

  // GET /api/users/:id - получить пользователя по ID
  getById: (id: string): Promise<User> => {
    return fetchApi(`/users/${id}`);
  },
};
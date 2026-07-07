import { Task, Cost, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Продукты', icon: '🛒' },
  { id: '2', name: 'Транспорт', icon: '🚗' },
  { id: '3', name: 'Развлечения', icon: '🎮' },
  { id: '4', name: 'Коммунальные', icon: '💡' },
];

export const TASKS: Task[] = [
  {
    id: '1',
    title: 'Купить продукты',
    description: 'Молоко, хлеб, яйца',
    status: 'work',
    assigneeId: 'u1',
    creatorId: 'u1',
    familyId: 'f1',
    deadline: '2026-07-03',
  },
  {
    id: '2',
    title: 'Помыть посуду',
    status: 'work',
    assigneeId: 'u2',
    creatorId: 'u1',
    familyId: 'f1',
    deadline: '2026-07-02',
  },
  {
    id: '3',
    title: 'Сделать уроки (Математика)',
    status: 'done',
    assigneeId: 'u3',
    creatorId: 'u1',
    familyId: 'f1',
    deadline: '2026-07-01',
  },
  {
    id: '4',
    title: 'Заплатить за интернет',
    status: 'work',
    assigneeId: 'u1',
    creatorId: 'u1',
    familyId: 'f1',
    deadline: '2026-07-05',
  },
];

export const COSTS: Cost[] = [
  {
    id: 'c1',
    amount: 3500,
    categoryId: '1',
    note: 'Супермаркет',
    date: '2026-07-01',
    userId: 'u1',
    familyId: 'f1',
  },
  {
    id: 'c2',
    amount: 1200,
    categoryId: '2',
    note: 'Бензин',
    date: '2026-07-01',
    userId: 'u2',
    familyId: 'f1',
  },
  {
    id: 'c3',
    amount: 800,
    categoryId: '3',
    note: 'Кино',
    date: '2026-06-30',
    userId: 'u3',
    familyId: 'f1',
  },
  {
    id: 'c4',
    amount: 2500,
    categoryId: '1',
    note: 'Овощи и фрукты',
    date: '2026-06-29',
    userId: 'u1',
    familyId: 'f1',
  },
];

export const MONTH_BUDGET = 50000;
export const TOTAL_SPENT = COSTS.reduce((sum, c) => sum + c.amount, 0);

// Пользователи для отображения имён
export const USERS = {
  u1: { name: 'Алексей', avatar: '👨' },
  u2: { name: 'Мария', avatar: '👩' },
  u3: { name: 'Сергей', avatar: '👦' },
};
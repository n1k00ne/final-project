import { Task, Cost, Category, User, RecurringPayment } from '../types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Продукты', icon: '🛒' },
  { id: '2', name: 'Транспорт', icon: '🚗' },
  { id: '3', name: 'Развлечения', icon: '🎮' },
  { id: '4', name: 'Коммунальные', icon: '💡' }
];

export const USERS: User[] = [
  { id: 'u1', email: 'papa@family.ru', name: 'Алексей', role: 'admin' },
  { id: 'u2', email: 'mama@family.ru', name: 'Мария', role: 'member' },
  { id: 'u3', email: 'son@family.ru', name: 'Сергей', role: 'member' },
];

export const USERS_MAP: Record<string, { name: string; avatar: string }> = {
  u1: { name: 'Алексей', avatar: '👨' },
  u2: { name: 'Мария', avatar: '👩' },
  u3: { name: 'Сергей', avatar: '👦' },
};

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
    place: 'Пятёрочка',
    paymentMethod: 'card_mir',
    isShared: true,
    forWhom: 'Все',
  },
  {
    id: 'c2',
    amount: 1200,
    categoryId: '2',
    note: 'Бензин',
    date: '2026-07-01',
    userId: 'u2',
    familyId: 'f1',
    place: 'Газпромнефть',
    paymentMethod: 'cash',
    isShared: true,
    forWhom: 'Папа',
  },
  {
    id: 'c3',
    amount: 800,
    categoryId: '3',
    note: 'Кино',
    date: '2026-06-30',
    userId: 'u3',
    familyId: 'f1',
    place: 'Кинотеатр',
    paymentMethod: 'cash',
    isShared: false,
    forWhom: 'Дети',
  },
  {
    id: 'c4',
    amount: 2500,
    categoryId: '1',
    note: 'Овощи и фрукты',
    date: '2026-06-29',
    userId: 'u1',
    familyId: 'f1',
    place: 'Рынок',
    paymentMethod: 'cash',
    isShared: true,
    forWhom: 'Все',
  },
  {
    id: 'c5',
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
    id: 'c6',
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
    id: 'c7',
    amount: 2500,
    categoryId: '1',
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

export const RECURRING_PAYMENTS: RecurringPayment[] = [
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

export const MONTH_BUDGET = 50000;
export const TOTAL_SPENT = COSTS.reduce((sum, c) => sum + c.amount, 0);

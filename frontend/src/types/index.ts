export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'work' | 'done' | 'archived';
  assigneeId?: string;
  creatorId: string;
  familyId: string;
  deadline?: string;
}

export interface Cost {
  id: string;
  amount: number;
  categoryId: string;
  note?: string;
  date: string;
  userId: string;
  familyId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'work' | 'done' | 'archived';
  assigneeId?: string;
  creatorId: string;
  familyId: string;
  deadline?: string;
}

export interface Cost {
  id: string;
  amount: number;
  categoryId: string;
  note?: string;
  date: string;              // ISO
  userId: string;            // кто потратил
  familyId: string;

  // Новые поля для детализации
  place?: string;            // место покупки
  photo?: string;            // URL (или base64)
  forWhom?: string;          // кому купили
  paymentMethod?: 'cash' | 'card_mir' | 'credit_card' | 'electronic';
  isShared?: boolean;        // общий/личный

  // Для разделения чека (опционально)
  splitInfo?: {
    totalAmount: number;
    participants: { userId: string; share: number }[];
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;              // можно использовать иконку из react-icons
}

// Новый интерфейс для регулярных платежей
export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  dayOfMonth: number;        // число месяца
  userId: string;
  familyId: string;
  isActive: boolean;
  note?: string;
}
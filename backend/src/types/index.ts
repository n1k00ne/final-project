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

export interface Category {
  id: string;
  name: string;
  icon: string;
}

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

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  dayOfMonth: number;
  userId: string;
  familyId: string;
  isActive: boolean;
  note?: string;
}

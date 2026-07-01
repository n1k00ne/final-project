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

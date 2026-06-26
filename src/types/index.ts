export interface User {
  id: string;
  username: string;
  password: string;
  salary: number;
  currency: string;
  createdAt: string;
}

export interface DayEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  worked: boolean;
  tips: number;
  notes: string;
  createdAt: string;
}

export interface MonthlyBonus {
  id: string;
  userId: string;
  yearMonth: string; // YYYY-MM
  amount: number;
  notes: string;
  createdAt: string;
}

export type Page = 'dashboard' | 'log' | 'history' | 'profile' | 'guide';
export type Language = 'en' | 'fr' | 'ar';

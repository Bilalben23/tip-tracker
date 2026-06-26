import type { User, DayEntry, MonthlyBonus } from '../types';

const K = {
  users: 'tt_users',
  currentUser: 'tt_current_user',
  entries: (uid: string) => `tt_entries_${uid}`,
  bonuses: (uid: string) => `tt_bonuses_${uid}`,
} as const;

const get = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
};

export const storage = {
  getUsers: (): User[] => get<User[]>(K.users, []),
  saveUsers: (v: User[]) => localStorage.setItem(K.users, JSON.stringify(v)),

  getEntries: (uid: string): DayEntry[] => get<DayEntry[]>(K.entries(uid), []),
  saveEntries: (uid: string, v: DayEntry[]) => localStorage.setItem(K.entries(uid), JSON.stringify(v)),

  getBonuses: (uid: string): MonthlyBonus[] => get<MonthlyBonus[]>(K.bonuses(uid), []),
  saveBonuses: (uid: string, v: MonthlyBonus[]) => localStorage.setItem(K.bonuses(uid), JSON.stringify(v)),

  getCurrentUserId: (): string | null => localStorage.getItem(K.currentUser),
  setCurrentUserId: (id: string | null) => {
    if (id) localStorage.setItem(K.currentUser, id);
    else localStorage.removeItem(K.currentUser);
  },
};

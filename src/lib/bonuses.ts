import { storage } from './storage';
import type { MonthlyBonus } from '../types';

export const bonusesLib = {
  getForMonth: (uid: string, yearMonth: string): MonthlyBonus | undefined =>
    storage.getBonuses(uid).find(b => b.yearMonth === yearMonth),

  getAll: (uid: string): MonthlyBonus[] => storage.getBonuses(uid),

  upsert: (uid: string, bonus: MonthlyBonus): void => {
    const all = storage.getBonuses(uid);
    const idx = all.findIndex(b => b.yearMonth === bonus.yearMonth);
    if (idx >= 0) all[idx] = bonus;
    else all.push(bonus);
    storage.saveBonuses(uid, all);
  },

  remove: (uid: string, yearMonth: string): void => {
    storage.saveBonuses(uid, storage.getBonuses(uid).filter(b => b.yearMonth !== yearMonth));
  },
};

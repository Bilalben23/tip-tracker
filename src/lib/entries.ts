import { format } from 'date-fns';
import { storage } from './storage';
import type { DayEntry } from '../types';

export const entriesLib = {
  getAll: (uid: string): DayEntry[] => storage.getEntries(uid),

  getForMonth: (uid: string, yearMonth: string): DayEntry[] =>
    storage.getEntries(uid).filter(e => e.date.startsWith(yearMonth)),

  getForDate: (uid: string, date: string): DayEntry | undefined =>
    storage.getEntries(uid).find(e => e.date === date),

  upsert: (uid: string, entry: DayEntry): void => {
    const entries = storage.getEntries(uid);
    const idx = entries.findIndex(e => e.date === entry.date);
    if (idx >= 0) entries[idx] = entry;
    else entries.push(entry);
    storage.saveEntries(uid, entries);
  },

  remove: (uid: string, date: string): void => {
    storage.saveEntries(uid, storage.getEntries(uid).filter(e => e.date !== date));
  },

  calcStreak: (uid: string): number => {
    const dateSet = new Set(storage.getEntries(uid).map(e => e.date));
    const today = format(new Date(), 'yyyy-MM-dd');
    const cursor = new Date();
    // If today isn't logged yet, start streak check from yesterday
    if (!dateSet.has(today)) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (dateSet.has(format(cursor, 'yyyy-MM-dd'))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  },
};

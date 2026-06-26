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
};

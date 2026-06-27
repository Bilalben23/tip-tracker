import { useState, useEffect } from 'react';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import { CheckCircle2, XCircle, Coins, StickyNote, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { entriesLib } from '../lib/entries';
import type { DayEntry } from '../types';

interface Props { initialDate?: string }

const todayStr = () => format(new Date(), 'yyyy-MM-dd');

export function LogDayPage({ initialDate }: Props) {
  const { user } = useAuth();
  const { t, isRTL, dateLocale } = useLang();
  const [date, setDate] = useState(initialDate ?? todayStr());
  const [worked, setWorked] = useState(true);
  const [tips, setTips] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  useEffect(() => {
    if (!user) return;
    const entry = entriesLib.getForDate(user.id, date);
    if (entry) {
      setWorked(entry.worked);
      setTips(entry.tips > 0 ? entry.tips.toString() : '');
      setNotes(entry.notes);
      setHasEntry(true);
    } else {
      setWorked(true); setTips(''); setNotes(''); setHasEntry(false);
    }
    setSaved(false); setDeleted(false);
  }, [date, user]);

  const shiftDate = (dir: -1 | 1) => {
    const d = parseISO(date);
    const next = format(new Date(d.getFullYear(), d.getMonth(), d.getDate() + dir), 'yyyy-MM-dd');
    if (isFuture(parseISO(next)) && !isToday(parseISO(next))) return;
    setDate(next);
  };

  const handleSave = () => {
    if (!user) return;
    const existing = entriesLib.getForDate(user.id, date);
    const entry: DayEntry = {
      id: existing?.id ?? crypto.randomUUID(),
      userId: user.id, date, worked,
      tips: parseFloat(tips) || 0,
      notes: notes.trim(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    entriesLib.upsert(user.id, entry);
    setHasEntry(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = () => {
    if (!user || !hasEntry) return;
    entriesLib.remove(user.id, date);
    setWorked(true); setTips(''); setNotes(''); setHasEntry(false);
    setDeleted(true);
    setTimeout(() => setDeleted(false), 2500);
  };

  const cur = user?.currency ?? 'DH';
  const dateLabel = isToday(parseISO(date))
    ? t.dash.today
    : format(parseISO(date), 'EEEE, MMMM d', { locale: dateLocale });

  const PrevIcon = isRTL ? <ChevronRight size={22} /> : <ChevronLeft size={22} />;
  const NextIcon = isRTL ? <ChevronLeft size={22} /> : <ChevronRight size={22} />;

  return (
    <div className="min-h-screen bg-slate-950 pb-28">
      <div className="bg-slate-900 border-b border-slate-800 px-5 pt-14 pb-5">
        <h1 className="text-white text-xl font-black">{t.log.title}</h1>
        <p className="text-slate-400 text-sm mt-0.5">{t.log.subtitle}</p>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Date */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">{t.log.dateLabel}</p>
          <div className="flex items-center justify-between">
            <button onClick={() => shiftDate(-1)}
              className="text-slate-400 p-2.5 rounded-xl hover:bg-slate-800 active:bg-slate-700 transition-colors">
              {PrevIcon}
            </button>
            <div className="text-center">
              <p className="text-white font-black text-lg">{dateLabel}</p>
              <p className="text-slate-600 text-xs mt-0.5">{format(parseISO(date), 'yyyy')}</p>
            </div>
            <button onClick={() => shiftDate(1)} disabled={isToday(parseISO(date))}
              className={`p-2.5 rounded-xl transition-colors ${isToday(parseISO(date)) ? 'text-slate-700' : 'text-slate-400 hover:bg-slate-800 active:bg-slate-700'
                }`}>
              {NextIcon}
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <input type="date" value={date} max={todayStr()}
              onChange={e => e.target.value && setDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-slate-300 text-sm focus:outline-none focus:border-amber-500" />
          </div>
        </div>

        {/* Status */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">{t.log.statusLabel}</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setWorked(true)}
              className={`flex flex-col items-center gap-3 py-5 rounded-2xl border-2 transition-all ${worked ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400' : 'border-slate-700 text-slate-500'
                }`}>
              <CheckCircle2 size={30} />
              <span className="text-sm font-bold">{t.log.worked}</span>
            </button>
            <button onClick={() => setWorked(false)}
              className={`flex flex-col items-center gap-3 py-5 rounded-2xl border-2 transition-all ${!worked ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-slate-700 text-slate-500'
                }`}>
              <XCircle size={30} />
              <span className="text-sm font-bold">{t.log.dayOff}</span>
            </button>
          </div>
        </div>

        {/* Tips */}
        {worked && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Coins size={16} className="text-amber-400" />
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">{t.log.tipsLabel}</p>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">{cur}</span>
              <input type="number" value={tips} onChange={e => setTips(e.target.value)}
                placeholder="0.00" min="0" step="0.5"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-16 pr-5 py-4 text-white text-2xl font-black placeholder-slate-700 focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <StickyNote size={16} className="text-sky-400" />
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">{t.log.notesLabel}</p>
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder={t.log.notesPlaceholder} rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none text-base" />
        </div>

        {/* Preview */}
        {worked && parseFloat(tips) > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">{t.log.summaryTitle}</p>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">{t.dash.tips}</span>
              <span className="text-amber-400 font-black text-lg">{cur} {(parseFloat(tips) || 0).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {hasEntry && (
            <button onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-4 bg-slate-800 text-red-400 rounded-2xl border border-slate-700 active:bg-red-900/30 transition-colors font-semibold text-sm">
              <Trash2 size={17} /> {t.log.delete}
            </button>
          )}
          <button onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-500 active:bg-amber-600 text-slate-900 font-black rounded-2xl transition-colors text-base">
            <Save size={19} /> {t.log.save}
          </button>
        </div>

        {saved && <p className="text-center text-emerald-400 font-semibold text-sm py-1">{t.log.savedMsg}</p>}
        {deleted && <p className="text-center text-red-400 font-semibold text-sm py-1">{t.log.deletedMsg}</p>}
      </div>
    </div>
  );
}

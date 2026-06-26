import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Coins, StickyNote, TrendingUp, Gift,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { entriesLib } from '../lib/entries';
import { bonusesLib } from '../lib/bonuses';
import type { Page } from '../types';

interface Props { onNavigate: (page: Page, date?: string) => void }

export function HistoryPage({ onNavigate }: Props) {
  const { user } = useAuth();
  const { t, isRTL, dateLocale } = useLang();
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const currentMonth = format(new Date(), 'yyyy-MM');

  const entries = useMemo(
    () => (user ? entriesLib.getForMonth(user.id, selectedMonth) : [])
      .sort((a, b) => b.date.localeCompare(a.date)),
    [user, selectedMonth]
  );

  const monthBonus = useMemo(
    () => (user ? bonusesLib.getForMonth(user.id, selectedMonth) : undefined),
    [user, selectedMonth]
  );

  const workedEntries = entries.filter(e => e.worked);
  const totalTips = workedEntries.reduce((s, e) => s + e.tips, 0);
  const bonusAmt = monthBonus?.amount ?? 0;
  const bestDay = workedEntries.reduce<typeof workedEntries[0] | null>(
    (best, e) => (!best || e.tips > best.tips ? e : best), null
  );

  const goMonth = (dir: -1 | 1) => {
    const d = parseISO(selectedMonth + '-01');
    setSelectedMonth(format(new Date(d.getFullYear(), d.getMonth() + dir, 1), 'yyyy-MM'));
  };

  const cur = user?.currency ?? 'DH';

  const PrevIcon = isRTL ? <ChevronRight size={22} /> : <ChevronLeft size={22} />;
  const NextIcon = isRTL ? <ChevronLeft size={22} /> : <ChevronRight size={22} />;

  return (
    <div className="min-h-screen bg-slate-950 pb-28">
      <div className="bg-slate-900 border-b border-slate-800 px-5 pt-14 pb-5">
        <h1 className="text-white text-xl font-black">{t.history.title}</h1>
        <p className="text-slate-400 text-sm mt-0.5">{t.history.subtitle}</p>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Month picker */}
        <div className="flex items-center justify-between bg-slate-900 rounded-2xl border border-slate-800 px-4 py-4">
          <button onClick={() => goMonth(-1)}
            className="text-slate-400 p-2 rounded-xl hover:bg-slate-800 active:bg-slate-700 transition-colors">
            {PrevIcon}
          </button>
          <span className="text-white font-bold">
            {format(parseISO(selectedMonth + '-01'), 'MMMM yyyy', { locale: dateLocale })}
          </span>
          <button onClick={() => goMonth(1)} disabled={selectedMonth >= currentMonth}
            className={`p-2 rounded-xl transition-colors ${
              selectedMonth >= currentMonth ? 'text-slate-700' : 'text-slate-400 hover:bg-slate-800 active:bg-slate-700'
            }`}>
            {NextIcon}
          </button>
        </div>

        {/* Summary */}
        {entries.length > 0 && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-amber-400" />
              <p className="text-slate-300 text-sm font-semibold">{t.history.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <SumCard label={t.history.totalTips} value={`${cur} ${totalTips.toFixed(2)}`} color="text-amber-400" />
              <SumCard label={t.history.totalBonus} value={bonusAmt > 0 ? `${cur} ${bonusAmt.toFixed(2)}` : '—'} color="text-purple-400" />
              <SumCard label={t.history.daysWorked} value={workedEntries.length.toString()} color="text-emerald-400" />
              <SumCard label={t.history.bestDayTips}
                value={bestDay ? `${cur} ${bestDay.tips.toFixed(2)}` : '—'} color="text-white" />
            </div>
            {bestDay && (
              <p className="text-slate-600 text-xs mt-2 text-center">
                {t.history.bestDayLabel} {format(parseISO(bestDay.date), 'EEEE, MMMM d', { locale: dateLocale })}
              </p>
            )}
          </div>
        )}

        {/* Entries */}
        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500">{t.history.noEntries}</p>
            <button onClick={() => onNavigate('log')} className="mt-3 text-amber-400 text-sm font-semibold">
              {t.history.startLogging}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map(entry => (
              <button key={entry.id} onClick={() => onNavigate('log', entry.date)}
                className="w-full bg-slate-900 rounded-2xl border border-slate-800 active:border-slate-600 transition-colors text-start overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                      entry.worked ? 'bg-emerald-900/60 text-emerald-400' : 'bg-red-900/40 text-red-400'
                    }`}>
                      {entry.worked ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">
                        {format(parseISO(entry.date), 'EEEE', { locale: dateLocale })}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {format(parseISO(entry.date), 'd MMMM yyyy', { locale: dateLocale })}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    {entry.worked
                      ? <p className="text-amber-400 font-black text-base">{cur} {entry.tips.toFixed(2)}</p>
                      : <span className="inline-block bg-red-900/30 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">{t.dash.dayOff}</span>
                    }
                  </div>
                </div>
                {entry.notes && (
                  <div className="flex items-center gap-2 px-4 pb-3 border-t border-slate-800 pt-2.5">
                    <StickyNote size={12} className="text-sky-400/60 shrink-0" />
                    <span className="text-slate-500 text-xs truncate">{entry.notes}</span>
                  </div>
                )}
                {!entry.notes && entry.worked && (
                  <div className="flex items-center gap-2 px-4 pb-3 border-t border-slate-800 pt-2.5">
                    <Coins size={12} className="text-amber-400/60" />
                    <span className="text-slate-600 text-xs">{cur} {entry.tips.toFixed(2)}</span>
                  </div>
                )}
              </button>
            ))}

            {/* Monthly bonus row */}
            {monthBonus && monthBonus.amount > 0 && (
              <div className="flex items-center justify-between bg-purple-900/20 border border-purple-800/40 rounded-2xl px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-purple-900/60 flex items-center justify-center text-purple-400">
                    <Gift size={19} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.dash.monthlyBonus}</p>
                    {monthBonus.notes && <p className="text-slate-500 text-xs">{monthBonus.notes}</p>}
                  </div>
                </div>
                <p className="text-purple-400 font-black text-base">{cur} {monthBonus.amount.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SumCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-slate-800 rounded-xl p-3">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className={`${color} font-black text-lg`}>{value}</p>
    </div>
  );
}

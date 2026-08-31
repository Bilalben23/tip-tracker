import { useState, useMemo } from 'react';
import {
  format, parseISO, startOfMonth, endOfMonth,
  eachDayOfInterval, isToday, isFuture,
} from 'date-fns';
import {
  TrendingUp, CheckCircle2, XCircle, Trophy, Flame,
  ChevronLeft, ChevronRight, Plus, Coins, Gift, Briefcase, Pencil, X, Save, Share2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { entriesLib } from '../lib/entries';
import { bonusesLib } from '../lib/bonuses';
import { TipsChart } from '../components/TipsChart';
import type { MonthlyBonus, Page } from '../types';

interface Props {
  onNavigate: (page: Page, date?: string) => void;
}

export function DashboardPage({ onNavigate }: Props) {
  const { user } = useAuth();
  const { t, isRTL, dateLocale } = useLang();
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const [editingBonus, setEditingBonus] = useState(false);
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusNotes, setBonusNotes] = useState('');
  const currentMonth = format(new Date(), 'yyyy-MM');

  const entries = useMemo(
    () => (user ? entriesLib.getForMonth(user.id, selectedMonth) : []),
    [user, selectedMonth]
  );

  const monthBonus = useMemo(
    () => (user ? bonusesLib.getForMonth(user.id, selectedMonth) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, selectedMonth, editingBonus]
  );

  const streak = useMemo(() => (user ? entriesLib.calcStreak(user.id) : 0), [user]);

  const workedEntries = entries.filter(e => e.worked);
  const offEntries = entries.filter(e => !e.worked);
  const totalTips = workedEntries.reduce((s, e) => s + e.tips, 0);

  const prevTips = useMemo(() => {
    if (!user) return null;
    const d = parseISO(selectedMonth + '-01');
    const prevMonth = format(new Date(d.getFullYear(), d.getMonth() - 1, 1), 'yyyy-MM');
    return entriesLib.getForMonth(user.id, prevMonth)
      .filter(e => e.worked)
      .reduce((s, e) => s + e.tips, 0);
  }, [user, selectedMonth]);

  const tipsDiff = prevTips !== null && prevTips > 0
    ? ((totalTips - prevTips) / prevTips) * 100
    : null;
  const bonusAmount_ = monthBonus?.amount ?? 0;
  const dailyRate = user?.salary ?? 0;
  const salary = dailyRate * workedEntries.length;
  const totalEarnings = totalTips + bonusAmount_ + salary;

  const bestDay = workedEntries.reduce<typeof workedEntries[0] | null>(
    (best, e) => (!best || e.tips > best.tips ? e : best), null
  );

  const monthDate = parseISO(selectedMonth + '-01');
  const daysInMonth = eachDayOfInterval({ start: startOfMonth(monthDate), end: endOfMonth(monthDate) });
  const firstDow = startOfMonth(monthDate).getDay();

  const entryMap = useMemo(() => {
    const m: Record<string, typeof entries[0]> = {};
    entries.forEach(e => { m[e.date] = e; });
    return m;
  }, [entries]);

  const recentEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const goMonth = (dir: -1 | 1) => {
    const d = parseISO(selectedMonth + '-01');
    setSelectedMonth(format(new Date(d.getFullYear(), d.getMonth() + dir, 1), 'yyyy-MM'));
  };

  const openBonusEdit = () => {
    setBonusAmount(monthBonus ? monthBonus.amount.toString() : '');
    setBonusNotes(monthBonus?.notes ?? '');
    setEditingBonus(true);
  };

  const saveBonus = () => {
    if (!user) return;
    const amt = parseFloat(bonusAmount) || 0;
    if (amt === 0 && !bonusNotes) {
      bonusesLib.remove(user.id, selectedMonth);
    } else {
      const existing = bonusesLib.getForMonth(user.id, selectedMonth);
      const bonus: MonthlyBonus = {
        id: existing?.id ?? crypto.randomUUID(),
        userId: user.id,
        yearMonth: selectedMonth,
        amount: amt,
        notes: bonusNotes.trim(),
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };
      bonusesLib.upsert(user.id, bonus);
    }
    setEditingBonus(false);
  };

  const cur = user?.currency ?? 'DH';
  const [shareCopied, setShareCopied] = useState(false);
  const shareSummary = async () => {
    const monthLabel = format(monthDate, 'MMMM yyyy', { locale: dateLocale });
    const avgTips = workedEntries.length > 0
      ? (totalTips / workedEntries.length).toFixed(2)
      : '0.00';

    const lines = [
      `📊 TipTracker — ${monthLabel}`,
      '',
      `💰 ${t.dash.tips}: ${cur} ${totalTips.toFixed(2)}`,
      bonusAmount_ > 0 ? `🎁 ${t.dash.bonus}: ${cur} ${bonusAmount_.toFixed(2)}` : null,
      `💵 ${t.dash.salary}: ${cur} ${salary.toFixed(2)}`,
      `📈 ${t.dash.totalEarnings}: ${cur} ${totalEarnings.toFixed(2)}`,
      '',
      `📅 ${t.dash.worked}: ${workedEntries.length}`,
      offEntries.length > 0 ? `🏖️ ${t.dash.daysOff}: ${offEntries.length}` : null,
      bestDay && bestDay.tips > 0 ? `⭐ ${t.dash.bestDay}: ${cur} ${bestDay.tips.toFixed(2)}` : null,
      `📊 ${t.dash.avg}: ${cur} ${avgTips}${t.dash.perDay}`,
    ].filter(Boolean).join('\n');

    try {
      if (navigator.share) {
        await navigator.share({ text: lines });
      } else {
        await navigator.clipboard.writeText(lines);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch {
      // user cancelled share sheet — ignore
    }
  };

  const Chevron = ({ dir: d }: { dir: 'left' | 'right' }) => {
    const L = <ChevronLeft size={22} />;
    const R = <ChevronRight size={22} />;
    if (d === 'left') return isRTL ? R : L;
    return isRTL ? L : R;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28">
      {/* Header */}
      <div className="bg-linear-to-br from-amber-600 via-amber-700 to-orange-900 px-5 pt-14 pb-10">
        <p className="text-amber-200 text-sm font-medium">{t.dash.welcomeBack}</p>
        <h1 className="text-white text-2xl font-black mt-0.5">{user?.username} 👋</h1>
        <div className="flex items-center justify-between mt-5">
          <button onClick={() => goMonth(-1)}
            className="text-amber-200 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors">
            <Chevron dir="left" />
          </button>
          <span className="text-white font-bold text-base">
            {format(monthDate, 'MMMM yyyy', { locale: dateLocale })}
          </span>
          <button onClick={() => goMonth(1)} disabled={selectedMonth >= currentMonth}
            className={`p-2 rounded-xl transition-colors ${selectedMonth >= currentMonth ? 'text-amber-800' : 'text-amber-200 hover:bg-white/10 active:bg-white/20'
              }`}>
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-5 space-y-3">
        {/* Total earnings */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-slate-400" />
            <p className="text-slate-400 text-sm">{t.dash.totalEarnings}</p>
          </div>
          <p className="text-amber-400 text-4xl font-black tracking-tight">
            {cur} {totalEarnings.toFixed(2)}
          </p>

          {tipsDiff !== null && (
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                tipsDiff > 0
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : tipsDiff < 0
                  ? 'bg-red-500/15 text-red-400'
                  : 'bg-slate-700/60 text-slate-400'
              }`}>
                {tipsDiff > 0 ? '↑' : tipsDiff < 0 ? '↓' : '→'}
                {' '}
                {tipsDiff === 0
                  ? t.dash.vsLastMonthSame
                  : `${tipsDiff > 0 ? '+' : ''}${tipsDiff.toFixed(1)}% ${t.dash.vsLastMonth}`}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-slate-800">
            <Pill icon={<Coins size={13} className="text-amber-400" />} color="text-amber-400"
              label={t.dash.tips} value={`${cur} ${totalTips.toFixed(2)}`} />
            <Pill icon={<Gift size={13} className="text-purple-400" />} color="text-purple-400"
              label={t.dash.bonus} value={`${cur} ${bonusAmount_.toFixed(2)}`} />
            <Pill icon={<Briefcase size={13} className="text-blue-400" />} color="text-blue-400"
              label={t.dash.salary} value={`${cur} ${salary.toFixed(2)}`} />
          </div>

          <button
            onClick={shareSummary}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-slate-400 active:bg-slate-800 transition-colors text-sm font-semibold"
          >
            {shareCopied
              ? <><span className="text-green-400">✓</span> {t.dash.shareCopied}</>
              : <><Share2 size={15} /> {t.dash.shareMonth}</>}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2.5">
          <StatChip icon={<CheckCircle2 size={18} className="text-emerald-400" />}
            value={workedEntries.length} label={t.dash.worked} />
          <StatChip icon={<XCircle size={18} className="text-red-400" />}
            value={offEntries.length} label={t.dash.daysOff} />
          <StatChip icon={<Trophy size={18} className="text-amber-400" />}
            value={bestDay ? `${cur}${bestDay.tips.toFixed(0)}` : '—'} label={t.dash.bestDay} />
          <StatChip
            icon={<Flame size={18} className={streak > 0 ? 'text-orange-400' : 'text-slate-600'} />}
            value={streak > 0 ? `🔥 ${streak}` : '—'}
            label={t.dash.streak}
          />
        </div>

        {/* Tips chart */}
        <TipsChart
          yearMonth={selectedMonth}
          entries={entries}
          currency={cur}
          onDayClick={date => onNavigate('log', date)}
        />

        {/* Monthly Bonus */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift size={16} className="text-purple-400" />
              <p className="text-slate-300 text-sm font-semibold">{t.dash.monthlyBonus}</p>
            </div>
            {!editingBonus && (
              <button onClick={openBonusEdit}
                className="flex items-center gap-1 text-slate-400 hover:text-amber-400 text-xs font-medium transition-colors py-1 px-2">
                {monthBonus ? <><Pencil size={13} /> {t.dash.editBonus}</> : <><Plus size={13} /> {t.dash.add}</>}
              </button>
            )}
          </div>

          {editingBonus ? (
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg">{cur}</span>
                <input type="number" value={bonusAmount} onChange={e => setBonusAmount(e.target.value)}
                  placeholder="0" min="0" step="1" autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-14 pr-4 py-3.5 text-white text-xl font-bold placeholder-slate-600 focus:outline-none focus:border-purple-500" />
              </div>
              <input type="text" value={bonusNotes} onChange={e => setBonusNotes(e.target.value)}
                placeholder={t.dash.bonusNotes}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
              <div className="flex gap-2">
                <button onClick={() => setEditingBonus(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold">
                  <X size={15} /> {t.profile.cancel}
                </button>
                <button onClick={saveBonus}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold">
                  <Save size={15} /> {t.dash.saveBonus}
                </button>
              </div>
            </div>
          ) : monthBonus ? (
            <div>
              <p className="text-purple-400 text-2xl font-black">{cur} {monthBonus.amount.toFixed(2)}</p>
              {monthBonus.notes && <p className="text-slate-500 text-sm mt-1">{monthBonus.notes}</p>}
            </div>
          ) : (
            <button onClick={openBonusEdit}
              className="w-full text-slate-500 text-sm py-2 text-start">
              {t.dash.addBonus}
            </button>
          )}
          <p className="text-slate-700 text-xs mt-2">{t.dash.bonusHint}</p>
        </div>

        {/* Mini calendar */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <p className="text-slate-300 text-sm font-semibold mb-3">{t.dash.monthOverview}</p>
          <div dir="ltr" className="grid grid-cols-7 gap-1 text-center mb-1">
            {t.dayNames.map((d, i) => (
              <div key={i} className="text-slate-600 text-[10px] font-semibold py-1">{d}</div>
            ))}
          </div>
          <div dir="ltr" className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const entry = entryMap[dateStr];
              const todayDay = isToday(day);
              const future = isFuture(day) && !isToday(day);
              let cls = 'text-slate-700';
              if (!future) {
                if (entry?.worked) cls = entry.tips > 0 ? 'bg-amber-500 text-slate-900' : 'bg-emerald-700 text-white';
                else if (entry) cls = 'bg-red-900/70 text-red-300';
                else cls = 'text-slate-500';
              }
              return (
                <button key={dateStr} disabled={future} onClick={() => onNavigate('log', dateStr)}
                  className={`aspect-square flex items-center justify-center text-[11px] font-bold rounded-full transition-all
                    ${cls} ${todayDay ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''}
                    ${future ? 'cursor-default opacity-30' : 'cursor-pointer active:opacity-70'}`}>
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800">
            <Legend color="bg-amber-500" label={t.dash.tips} />
            <Legend color="bg-emerald-700" label={t.dash.worked} />
            <Legend color="bg-red-900" label={t.dash.daysOff} />
          </div>
        </div>

        {/* Recent days */}
        {recentEntries.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-300 text-sm font-semibold">{t.dash.recentDays}</p>
              <button onClick={() => onNavigate('history')} className="text-amber-400 text-sm font-medium">
                {t.dash.seeAll}
              </button>
            </div>
            <div className="space-y-2">
              {recentEntries.map(entry => (
                <button key={entry.id} onClick={() => onNavigate('log', entry.date)}
                  className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 flex items-center justify-between active:border-slate-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${entry.worked ? 'bg-emerald-900/60 text-emerald-400' : 'bg-red-900/40 text-red-400'
                      }`}>
                      {entry.worked ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="text-start">
                      <p className="text-white text-sm font-semibold">
                        {isToday(parseISO(entry.date)) ? t.dash.today : format(parseISO(entry.date), 'EEE, MMM d', { locale: dateLocale })}
                      </p>
                      {entry.notes && <p className="text-slate-500 text-xs truncate max-w-40 mt-0.5">{entry.notes}</p>}
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    {entry.worked
                      ? <p className="text-amber-400 font-bold text-sm">{cur} {entry.tips.toFixed(2)}</p>
                      : <span className="text-slate-500 text-xs">{t.dash.dayOff}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-14">
            <p className="text-slate-500">{t.dash.noEntries}</p>
            <button onClick={() => onNavigate('log')}
              className="mt-4 inline-flex items-center gap-2 bg-amber-500 text-slate-900 font-black px-6 py-3.5 rounded-2xl">
              <Plus size={18} /> {t.dash.logFirstDay}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-slate-400 text-xs">{label}</span>
      <span className={`${color} text-xs font-bold`}>{value}</span>
    </div>
  );
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col gap-2">
      {icon}
      <p className="text-white text-xl font-black leading-none">{value}</p>
      <p className="text-slate-500 text-xs">{label}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-slate-500 text-xs">{label}</span>
    </div>
  );
}

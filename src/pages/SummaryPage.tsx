import { useState, useMemo } from 'react';
import { format, parseISO, subMonths } from 'date-fns';
import {
  Coins, Briefcase, Gift, TrendingUp, CheckCircle2, XCircle,
  Trophy, Flame, Share2, Settings2, PieChart as PieChartIcon,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { entriesLib } from '../lib/entries';
import { bonusesLib } from '../lib/bonuses';
import type { Page } from '../types';

interface Props {
  onNavigate: (page: Page, date?: string) => void;
}

type Period = 'thisMonth' | 'lastMonth' | 'allTime';

export function SummaryPage({ onNavigate }: Props) {
  const { user } = useAuth();
  const { t, dateLocale } = useLang();
  const [period, setPeriod] = useState<Period>('thisMonth');
  const [shareCopied, setShareCopied] = useState(false);

  const cur = user?.currency ?? 'DH';
  const dailyRate = user?.salary ?? 0;

  const currentMonth = format(new Date(), 'yyyy-MM');
  const lastMonthYm = format(subMonths(new Date(), 1), 'yyyy-MM');

  const entries = useMemo(() => {
    if (!user) return [];
    if (period === 'allTime') return entriesLib.getAll(user.id);
    return entriesLib.getForMonth(user.id, period === 'lastMonth' ? lastMonthYm : currentMonth);
  }, [user, period, currentMonth, lastMonthYm]);

  const bonusAmt = useMemo(() => {
    if (!user) return 0;
    if (period === 'allTime') return bonusesLib.getAll(user.id).reduce((s, b) => s + b.amount, 0);
    const ym = period === 'lastMonth' ? lastMonthYm : currentMonth;
    return bonusesLib.getForMonth(user.id, ym)?.amount ?? 0;
  }, [user, period, currentMonth, lastMonthYm]);

  const worked = entries.filter(e => e.worked);
  const off = entries.filter(e => !e.worked);
  const totalTips = worked.reduce((s, e) => s + e.tips, 0);
  const salaryCollected = dailyRate * worked.length;
  const totalEarnings = totalTips + salaryCollected + bonusAmt;
  const avgTips = worked.length > 0 ? totalTips / worked.length : 0;
  const workRate = entries.length > 0 ? (worked.length / entries.length) * 100 : 0;
  const bestDay = worked.reduce<typeof worked[0] | null>(
    (best, e) => (!best || e.tips > best.tips ? e : best), null
  );
  const streak = user ? entriesLib.calcStreak(user.id) : 0;

  const trend = useMemo(() => {
    if (!user) return [];
    return Array.from({ length: 6 }).map((_, i) => {
      const d = subMonths(new Date(), 5 - i);
      const ym = format(d, 'yyyy-MM');
      const monthWorked = entriesLib.getForMonth(user.id, ym).filter(e => e.worked);
      const tips = monthWorked.reduce((s, e) => s + e.tips, 0);
      const sal = dailyRate * monthWorked.length;
      const bon = bonusesLib.getForMonth(user.id, ym)?.amount ?? 0;
      return { ym, month: format(d, 'MMM', { locale: dateLocale }), total: tips + sal + bon };
    });
  }, [user, dailyRate, dateLocale]);

  const tipsPct = totalEarnings > 0 ? (totalTips / totalEarnings) * 100 : 0;
  const salaryPct = totalEarnings > 0 ? (salaryCollected / totalEarnings) * 100 : 0;
  const bonusPct = totalEarnings > 0 ? (bonusAmt / totalEarnings) * 100 : 0;

  const periodLabel = period === 'allTime'
    ? t.summary.allTime
    : format(parseISO((period === 'lastMonth' ? lastMonthYm : currentMonth) + '-01'), 'MMMM yyyy', { locale: dateLocale });

  const shareSummary = async () => {
    const lines = [
      `📊 TipTracker — ${periodLabel}`,
      '',
      `💰 ${t.summary.tipsCollected}: ${cur} ${totalTips.toFixed(2)}`,
      dailyRate > 0 ? `💵 ${t.summary.salaryCollected}: ${cur} ${salaryCollected.toFixed(2)}` : null,
      bonusAmt > 0 ? `🎁 ${t.summary.bonusCollected}: ${cur} ${bonusAmt.toFixed(2)}` : null,
      `📈 ${t.summary.totalEarnings}: ${cur} ${totalEarnings.toFixed(2)}`,
      '',
      `📅 ${t.summary.daysWorked}: ${worked.length}`,
      off.length > 0 ? `🏖️ ${t.summary.daysOff}: ${off.length}` : null,
      bestDay && bestDay.tips > 0 ? `⭐ ${t.summary.bestDay}: ${cur} ${bestDay.tips.toFixed(2)}` : null,
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

  const PERIODS: { key: Period; label: string }[] = [
    { key: 'thisMonth', label: t.summary.thisMonth },
    { key: 'lastMonth', label: t.summary.lastMonth },
    { key: 'allTime', label: t.summary.allTime },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-28">
      {/* Header */}
      <div className="bg-linear-to-br from-emerald-700 via-teal-800 to-slate-900 px-5 pt-14 pb-8">
        <div className="flex items-center gap-2">
          <PieChartIcon size={18} className="text-emerald-300" />
          <p className="text-emerald-200 text-sm font-medium">{t.summary.subtitle}</p>
        </div>
        <h1 className="text-white text-2xl font-black mt-0.5">{t.summary.title}</h1>

        <div className="flex gap-2 mt-5">
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                period === p.key
                  ? 'bg-white text-emerald-900 shadow-lg'
                  : 'bg-white/10 text-emerald-100 active:bg-white/20'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-3">
        {/* Total earnings hero */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-slate-400" />
            <p className="text-slate-400 text-sm">{t.summary.totalEarnings}</p>
          </div>
          <p className="text-emerald-400 text-4xl font-black tracking-tight">
            {cur} {totalEarnings.toFixed(2)}
          </p>

          {/* Breakdown bar */}
          <div className="mt-4 h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
            {totalEarnings > 0 ? (
              <>
                <div className="h-full bg-amber-400" style={{ width: `${tipsPct}%` }} />
                <div className="h-full bg-blue-400" style={{ width: `${salaryPct}%` }} />
                <div className="h-full bg-purple-400" style={{ width: `${bonusPct}%` }} />
              </>
            ) : (
              <div className="h-full w-full bg-slate-800" />
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
            <Pill icon={<Coins size={13} className="text-amber-400" />} color="text-amber-400"
              label={t.summary.tipsCollected} value={`${cur} ${totalTips.toFixed(2)}`} />
            <Pill icon={<Briefcase size={13} className="text-blue-400" />} color="text-blue-400"
              label={t.summary.salaryCollected} value={`${cur} ${salaryCollected.toFixed(2)}`} />
            <Pill icon={<Gift size={13} className="text-purple-400" />} color="text-purple-400"
              label={t.summary.bonusCollected} value={`${cur} ${bonusAmt.toFixed(2)}`} />
          </div>

          <button onClick={shareSummary}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-slate-400 active:bg-slate-800 transition-colors text-sm font-semibold">
            {shareCopied
              ? <><span className="text-green-400">✓</span> {t.summary.shareCopied}</>
              : <><Share2 size={15} /> {t.summary.shareSummary}</>}
          </button>
        </div>

        {/* Daily rate hint */}
        {dailyRate === 0 && (
          <button onClick={() => onNavigate('profile')}
            className="w-full flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl px-4 py-3.5 text-start active:bg-blue-500/15 transition-colors">
            <Settings2 size={18} className="text-blue-400 shrink-0" />
            <span className="text-blue-300 text-xs font-medium flex-1">{t.summary.noRateHint}</span>
          </button>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <StatChip icon={<CheckCircle2 size={18} className="text-emerald-400" />}
            value={worked.length} label={t.summary.daysWorked} />
          <StatChip icon={<XCircle size={18} className="text-red-400" />}
            value={off.length} label={t.summary.daysOff} />
          <StatChip icon={<TrendingUp size={18} className="text-sky-400" />}
            value={entries.length > 0 ? `${workRate.toFixed(0)}%` : '—'} label={t.summary.workRate} />
          <StatChip icon={<Coins size={18} className="text-amber-400" />}
            value={avgTips > 0 ? `${cur}${avgTips.toFixed(0)}` : '—'} label={t.summary.avgTips} />
          <StatChip icon={<Trophy size={18} className="text-amber-400" />}
            value={bestDay ? `${cur}${bestDay.tips.toFixed(0)}` : '—'} label={t.summary.bestDay} />
          <StatChip
            icon={<Flame size={18} className={streak > 0 ? 'text-orange-400' : 'text-slate-600'} />}
            value={streak > 0 ? `🔥 ${streak}` : '—'}
            label={t.summary.streak}
          />
        </div>

        {/* Trend */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-emerald-400" />
            <p className="text-slate-300 text-sm font-semibold">{t.summary.trend}</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={trend} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                tickLine={false} axisLine={false} />
              <Tooltip content={<TrendTooltip currency={cur} />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={600}>
                {trend.map((d, i) => (
                  <Cell key={d.ym} fill={i === trend.length - 1 ? '#34d399' : '#134e37'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {entries.length === 0 && (
          <div className="text-center py-6">
            <p className="text-slate-500 text-sm">{t.summary.noData}</p>
            <button onClick={() => onNavigate('log')} className="mt-2 text-emerald-400 text-sm font-semibold">
              {t.summary.logSomeDays}
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

function TrendTooltip({ active, payload, currency }: {
  active?: boolean;
  payload?: Array<{ payload: { month: string; total: number } }>;
  currency: string;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 font-medium mb-0.5">{p.month}</p>
      <p className="text-emerald-400 font-black text-sm">{currency} {p.total.toFixed(0)}</p>
    </div>
  );
}

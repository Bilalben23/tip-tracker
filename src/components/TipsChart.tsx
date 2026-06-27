import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  format, parseISO, eachDayOfInterval,
  startOfMonth, endOfMonth, isFuture, isToday,
} from 'date-fns';
import type { DayEntry } from '../types';

interface Props {
  yearMonth: string;
  entries: DayEntry[];
  currency: string;
  onDayClick: (date: string) => void;
}

interface ChartPoint {
  day: number;
  date: string;
  tips: number | null;
  worked: boolean;
  future: boolean;
}

export function TipsChart({ yearMonth, entries, currency, onDayClick }: Props) {
  const { t } = useLang();
  const monthDate = parseISO(yearMonth + '-01');
  const days = eachDayOfInterval({ start: startOfMonth(monthDate), end: endOfMonth(monthDate) });

  const entryMap = useMemo(() => {
    const m: Record<string, DayEntry> = {};
    entries.forEach(e => { m[e.date] = e; });
    return m;
  }, [entries]);

  const data: ChartPoint[] = days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const entry = entryMap[dateStr];
    const future = isFuture(day) && !isToday(day);
    return {
      day: parseInt(format(day, 'd'), 10),
      date: dateStr,
      tips: future ? null : (entry?.worked ? entry.tips : null),
      worked: entry?.worked ?? false,
      future,
    };
  });

  const workedWithTips = entries.filter(e => e.worked && e.tips > 0);
  const totalTips = entries.filter(e => e.worked).reduce((s, e) => s + e.tips, 0);
  const avg = workedWithTips.length > 0 ? totalTips / workedWithTips.length : 0;
  const todayDay = isToday(monthDate) ? 0 : days.findIndex(d => isToday(d)) + 1;

  return (
    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-amber-400" />
          <p className="text-slate-300 text-sm font-semibold">{t.dash.tipsTrend}</p>
        </div>
        {avg > 0 && (
          <span className="text-[11px] text-slate-500">
            {t.dash.avg} <span className="text-amber-400 font-bold">{currency}{avg.toFixed(0)}</span>{t.dash.perDay}
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 6, right: 4, left: -28, bottom: 0 }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(s: any) => {
            const pt = s?.activePayload?.[0]?.payload as ChartPoint | undefined;
            if (pt && !pt.future) onDayClick(pt.date);
          }}
        >
          <defs>
            <linearGradient id="tipsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}`}
          />
          {avg > 0 && (
            <ReferenceLine
              y={avg}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
            />
          )}
          {todayDay > 0 && (
            <ReferenceLine
              x={todayDay}
              stroke="#ffffff"
              strokeOpacity={0.15}
              strokeWidth={2}
            />
          )}
          <Tooltip
            content={<CustomTooltip currency={currency} t={t.dash} />}
            cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeOpacity: 0.4 }}
          />
          <Area
            type="monotone"
            dataKey="tips"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#tipsGrad)"
            dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#fbbf24', strokeWidth: 2, stroke: '#1e293b' }}
            connectNulls={false}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TooltipInner {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
  currency: string;
  t: { dayLabel: string; workedNoTips: string; dayOff: string };
}

function CustomTooltip({ active, payload, currency, t }: TooltipInner) {
  if (!active || !payload?.length) return null;
  const pt = payload[0].payload;
  const tips = pt.tips;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 font-medium mb-0.5">{t.dayLabel} {pt.day}</p>
      {tips !== null && tips > 0 ? (
        <p className="text-amber-400 font-black text-sm">{currency} {tips.toFixed(2)}</p>
      ) : pt.worked ? (
        <p className="text-emerald-400 font-semibold">{t.workedNoTips}</p>
      ) : (
        <p className="text-slate-500">{t.dayOff}</p>
      )}
    </div>
  );
}

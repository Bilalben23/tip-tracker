import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { entriesLib } from '../lib/entries';
import { idbSet } from '../lib/idb';

const TEAM = ['Bilal', 'Yassin', 'Wael', 'Azhar', 'Youssef', 'Omar', 'Moad'];

export function SplitPage() {
  const { t, isRTL } = useLang();
  const s = t.split;
  const { user } = useAuth();
  const currency = user?.currency ?? 'MAD';

  const [total, setTotal] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set(TEAM));
  const [saved, setSaved] = useState(false);

  const toggle = (name: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const count   = selected.size;
  const amount  = parseFloat(total) || 0;
  const share   = count > 0 && amount > 0 ? amount / count : 0;
  const activeMembers = TEAM.filter(n => selected.has(n));

  // Rounding suggestions — only when share has ugly cents
  const suggestions = useMemo(() => {
    if (count === 0 || amount <= 0 || share <= 0) return [];
    const cents = Math.round((share % 1) * 100);
    if (cents === 0 || cents === 50) return [];
    const candidates = [
      Math.floor(share * 2) / 2,
      Math.floor(share),
      Math.floor(share / 5) * 5,
    ];
    const seen = new Set<number>();
    const opts: { share: number; remove: number; newTotal: number }[] = [];
    for (const c of candidates) {
      if (c > 0 && !seen.has(c)) {
        seen.add(c);
        const newTotal = parseFloat((c * count).toFixed(2));
        const remove  = parseFloat((amount - newTotal).toFixed(2));
        if (remove > 0) opts.push({ share: c, remove, newTotal });
      }
    }
    return opts;
  }, [amount, count, share]);

  const saveMyTips = () => {
    if (!user || share <= 0) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const existing = entriesLib.getForDate(user.id, today);
    entriesLib.upsert(user.id, {
      id: existing?.id ?? crypto.randomUUID(),
      userId: user.id,
      date: today,
      worked: true,
      tips: parseFloat(share.toFixed(2)),
      notes: existing?.notes ?? '',
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    });
    idbSet('lastEntryDate', today).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className={`min-h-screen bg-slate-950 pb-28 overflow-x-hidden ${isRTL ? 'rtl' : 'ltr'}`}>

      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-5 pt-14 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 text-xl shrink-0">
            ÷
          </div>
          <div className="min-w-0">
            <h1 className="text-white text-xl font-black truncate">{s.title}</h1>
            <p className="text-slate-400 text-sm truncate">{s.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* Total input */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
          <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-3">
            💰 {s.totalLabel}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              value={total}
              onChange={e => setTotal(e.target.value)}
              placeholder="0.00"
              className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-white text-2xl font-black focus:outline-none focus:border-amber-500 text-center tabular-nums"
            />
            <span className="text-slate-400 font-bold text-sm shrink-0">{currency}</span>
          </div>
        </div>

        {/* Who's sharing */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-slate-400 text-xs font-black uppercase tracking-widest">
              👥 {s.whoLabel}
            </label>
            <span className="text-amber-400 text-xs font-bold shrink-0 ml-2">
              {count} / {TEAM.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {TEAM.map(name => {
              const on = selected.has(name);
              return (
                <motion.button
                  key={name}
                  onClick={() => toggle(name)}
                  whileTap={{ scale: 0.92 }}
                  className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors ${
                    on
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {on ? '✓ ' : ''}{name}
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800">
            <button onClick={() => setSelected(new Set(TEAM))}
              className="text-xs text-slate-500 active:text-slate-300 transition-colors">
              {s.selectAll}
            </button>
            <span className="text-slate-700">·</span>
            <button onClick={() => setSelected(new Set())}
              className="text-xs text-slate-500 active:text-slate-300 transition-colors">
              {s.selectNone}
            </button>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {count === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-center"
            >
              <p className="text-slate-500 text-sm">{s.noOne}</p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-gradient-to-br from-amber-600/20 via-amber-700/10 to-slate-900 rounded-2xl border border-amber-500/30 p-4 overflow-hidden"
            >
              {/* Big share number */}
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest text-center mb-1">
                {s.eachGets}
              </p>
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={share.toFixed(2)}
                  initial={{ scale: 0.82, opacity: 0 }}
                  animate={{ scale: 1,    opacity: 1 }}
                  exit={{    scale: 0.82, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                  className="text-amber-400 font-black text-4xl text-center tabular-nums leading-tight break-all"
                >
                  {share > 0 ? share.toFixed(2) : '—'}
                </motion.p>
              </AnimatePresence>
              <p className="text-slate-500 text-xs text-center mt-1 mb-3">
                {currency} · {count} {s.people}
              </p>

              {/* Rounding suggestions */}
              {suggestions.length > 0 && (
                <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/50 mb-3">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                    💡 {s.roundTitle}
                  </p>
                  <div className="space-y-1.5">
                    {suggestions.map((sg, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setTotal(sg.newTotal.toString())}
                        whileTap={{ scale: 0.97 }}
                        className="w-full rounded-lg bg-slate-700/60 active:bg-slate-600 transition-colors px-3 py-2"
                      >
                        {/* Two-line layout — no horizontal overflow risk */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-red-400 text-xs font-bold shrink-0">
                            − {sg.remove.toFixed(2)} {currency}
                          </span>
                          <span className="text-slate-600 text-xs">→</span>
                          <span className="text-green-400 text-xs font-black tabular-nums shrink-0">
                            {sg.share.toFixed(2)} {currency}
                          </span>
                          <span className="text-slate-500 text-[10px] truncate">
                            {s.each}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Per-person breakdown */}
              {share > 0 && (
                <div className="border-t border-slate-700/50 pt-3 space-y-2">
                  {activeMembers.map((name, i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between gap-2 min-w-0"
                    >
                      <span className="text-slate-300 text-sm font-bold truncate">{name}</span>
                      <span className="text-amber-300 text-sm font-black tabular-nums shrink-0">
                        {share.toFixed(2)} {currency}
                      </span>
                    </motion.div>
                  ))}

                  <motion.button
                    onClick={saveMyTips}
                    whileTap={{ scale: 0.96 }}
                    className={`w-full mt-2 py-3 rounded-xl font-black text-sm transition-colors ${
                      saved
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-amber-500 text-slate-900 active:bg-amber-400'
                    }`}
                  >
                    {saved ? `✓ ${s.savedMsg}` : s.saveBtn}
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

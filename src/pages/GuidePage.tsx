import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useLang } from '../contexts/LanguageContext';

interface Props { onBack: () => void }

// ── tiny reusable pieces ────────────────────────────────────────────────────

function Character({
  emoji,
  name,
  sub,
  nameColor = 'text-slate-200',
  subColor  = 'text-slate-500',
  animateY  = false,
  cookSway  = false,
  delay     = 0,
  fart      = false,
}: {
  emoji: string; name: string; sub?: string;
  nameColor?: string; subColor?: string;
  animateY?: boolean; cookSway?: boolean; delay?: number;
  fart?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const triggerFart = useCallback(() => {
    if (!fart) return;
    const audio = new Audio('/sounds/beanfrog-proud-fart.mp3');
    audio.play().catch(() => {});
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2200);
  }, [fart]);

  const emojiAnim = cookSway
    ? { rotate: [-12, 12, -12], scale: [1, 1.18, 1] }
    : animateY
    ? { y: [0, -6, 0] }
    : {};
  const transition: Transition = cookSway
    ? { duration: 1, repeat: Infinity, ease: 'easeInOut', delay }
    : { duration: 2, repeat: Infinity, ease: 'easeInOut', delay };

  return (
    <motion.div
      className="relative flex items-center gap-2 cursor-pointer select-none"
      whileTap={{ scale: 1.3 }}
      onClick={triggerFart}
      onContextMenu={e => { e.preventDefault(); triggerFart(); }}
    >
      <motion.span
        className="text-xl leading-none inline-block"
        animate={emojiAnim}
        transition={transition}
      >
        {emoji}
      </motion.span>
      <div>
        <p className={`text-[11px] font-black leading-none ${nameColor}`}>{name}</p>
        {sub && <p className={`text-[9px] leading-tight mt-0.5 ${subColor}`}>{sub}</p>}
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: -2, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-700 text-white text-[11px] font-bold px-2 py-1 rounded-lg shadow-lg pointer-events-none z-50"
          >
            أنا الخراي 💨
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Server({ name, direction }: { name: string; direction: 1 | -1 }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 cursor-pointer select-none relative z-10"
      animate={{ x: [direction * -28, direction * 28] }}
      transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      whileTap={{ scale: 1.4 }}
    >
      <motion.span
        className="text-2xl leading-none inline-block"
        animate={{ scaleX: direction === -1 ? -1 : 1 }}
      >
        🚶
      </motion.span>
      <p className="text-sky-300 text-[10px] font-bold">{name}</p>
    </motion.div>
  );
}

// ── beach scene ─────────────────────────────────────────────────────────────

type BeachPhase = 'idle' | 'wave' | 'swim';

interface BMember {
  name: string; rest: string; swim: string; color: string; delay: number; fart?: boolean;
}

const BEACH: BMember[] = [
  { name: 'Bilal',    rest: '😎', swim: '🏊',   color: 'text-amber-400',  delay: 0 },
  { name: 'Kristina', rest: '👒', swim: '🏊‍♀️',  color: 'text-purple-300', delay: 0.12 },
  { name: 'Yassin',   rest: '🕶️', swim: '🏊',   color: 'text-sky-300',    delay: 0.24 },
  { name: 'Wael',     rest: '🩴', swim: '🏊',   color: 'text-slate-300',  delay: 0.36, fart: true },
  { name: 'Azhar',    rest: '🌸', swim: '🏊',   color: 'text-pink-300',   delay: 0.48 },
  { name: 'Youssef',  rest: '🏄', swim: '🏊',   color: 'text-cyan-300',   delay: 0.60 },
  { name: 'Bernard',  rest: '👔', swim: '🏊‍♂️',  color: 'text-green-300',  delay: 0.72 },
  { name: 'Omar',     rest: '🏃', swim: '🏊',   color: 'text-blue-300',   delay: 0.84 },
  { name: 'Moad',     rest: '😴', swim: '🏊',   color: 'text-orange-300', delay: 0.96 },
];

function BeachMemberChar({ m, phase }: { m: BMember; phase: BeachPhase }) {
  const [tip, setTip] = useState(false);
  const isSwim = phase === 'swim';

  const handleClick = () => {
    if (!m.fart) return;
    new Audio('/sounds/beanfrog-proud-fart.mp3').play().catch(() => {});
    setTip(true);
    setTimeout(() => setTip(false), 2000);
  };

  return (
    <motion.div
      className="relative flex flex-col items-center gap-0.5 cursor-pointer select-none"
      onClick={handleClick}
      animate={isSwim
        ? { y: [-10, 4, -10], rotate: [-10, 10, -10] }
        : { y: [0, -4, 0] }}
      transition={{ duration: isSwim ? 0.75 : 2.5, repeat: Infinity, ease: 'easeInOut', delay: m.delay }}
    >
      <span className="text-xl leading-none">{isSwim ? m.swim : m.rest}</span>
      <span className={`text-[8px] font-black leading-none ${m.color}`}>{m.name}</span>

      <AnimatePresence>
        {tip && (
          <motion.div
            className="absolute -top-7 whitespace-nowrap text-[10px] font-bold bg-slate-700 text-white px-2 py-0.5 rounded-lg pointer-events-none z-50"
            initial={{ opacity: 0, y: 4, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {isSwim ? '💩🫧' : 'أنا الخراي 💨'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BeachScene() {
  const [phase, setPhase] = useState<BeachPhase>('idle');

  const triggerTsunami = () => {
    if (phase !== 'idle') return;
    setPhase('wave');
    setTimeout(() => setPhase('swim'), 800);
    setTimeout(() => setPhase('idle'), 5200);
  };

  const rows = [BEACH.slice(0, 3), BEACH.slice(3, 6), BEACH.slice(6, 9)];

  const btnLabel =
    phase === 'wave' ? '🌊 incoming...' :
    phase === 'swim' ? '🏊 tout le monde nage!' :
    '🌊 TSUNAMI!';

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-800 flex items-center gap-2">
        <motion.span
          className="text-xl inline-block"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >🏖️</motion.span>
        <div>
          <h3 className="text-white font-black text-base leading-tight">La Plage</h3>
          <p className="text-slate-500 text-[10px]">after-shift beach vibes</p>
        </div>
      </div>

      {/* Scene */}
      <div className="relative overflow-hidden" style={{ height: 230 }}>

        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-700 via-sky-600 to-sky-500" />

        {/* Clouds */}
        <motion.div
          className="absolute top-4 left-6 text-2xl opacity-80"
          animate={{ x: [0, 18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >☁️</motion.div>
        <motion.div
          className="absolute top-7 left-28 text-lg opacity-60"
          animate={{ x: [0, -14, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >☁️</motion.div>

        {/* Sun */}
        <motion.div
          className="absolute top-3 right-5 text-3xl"
          animate={phase !== 'idle'
            ? { y: -70, opacity: 0 }
            : { y: 0, opacity: 1, scale: [1, 1.08, 1] }}
          transition={phase !== 'idle'
            ? { duration: 0.35 }
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >☀️</motion.div>

        {/* Palm trees */}
        <motion.div
          className="absolute bottom-14 left-1 text-4xl z-10"
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >🌴</motion.div>
        <motion.div
          className="absolute bottom-14 right-1 text-4xl z-10"
          animate={{ rotate: [4, -4, 4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >🌴</motion.div>

        {/* Sand */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-yellow-900/80 via-yellow-800/40 to-transparent" />

        {/* Calm sea */}
        <motion.div
          className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-blue-900 to-blue-700/70"
          animate={phase === 'idle' ? { scaleY: [1, 1.12, 1] } : { scaleY: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'bottom' }}
        />

        {/* Team on beach */}
        <div className="absolute inset-x-8 bottom-10 flex flex-col gap-2">
          {rows.map((row, ri) => (
            <div key={ri} className="flex justify-around">
              {row.map(m => <BeachMemberChar key={m.name} m={m} phase={phase} />)}
            </div>
          ))}
        </div>

        {/* ── TSUNAMI WAVE ── */}
        <AnimatePresence>
          {phase !== 'idle' && (
            <motion.div
              className="absolute inset-0 flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '110%' }}
              transition={{ type: 'spring', stiffness: 55, damping: 16 }}
            >
              {/* Crest */}
              <div className="flex shrink-0 overflow-hidden -mb-1 relative z-10">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-3xl"
                    animate={{ y: [0, -8, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.06, ease: 'easeInOut' }}
                  >🌊</motion.span>
                ))}
              </div>

              {/* Water body */}
              <div className="flex-1 bg-gradient-to-b from-blue-500/95 via-blue-600 to-blue-900 flex items-center justify-center">
                <AnimatePresence>
                  {phase === 'swim' && (
                    <motion.div
                      className="text-center px-4"
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    >
                      <p className="text-white font-black text-2xl drop-shadow-lg">🌊 TSUNAMI! 🌊</p>
                      <p className="text-blue-200 text-xs mt-1 font-bold">tout le monde à l'eau!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bubbles */}
                {phase === 'swim' && Array.from({ length: 7 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-lg"
                    style={{ left: `${10 + i * 13}%` }}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: -20, opacity: [0, 0.9, 0] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
                  >🫧</motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button */}
      <div className="px-4 py-3 border-t border-slate-800">
        <motion.button
          onClick={triggerTsunami}
          disabled={phase !== 'idle'}
          className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
            phase !== 'idle'
              ? 'bg-blue-900/40 text-blue-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-900/40'
          }`}
          animate={phase === 'idle' ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1.8, repeat: Infinity }}
          whileTap={{ scale: 0.95 }}
        >
          {btnLabel}
        </motion.button>
      </div>
    </div>
  );
}

// ── main floor component ────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

function RestaurantFloor() {
  const { t } = useLang();
  const f = t.guide.floor;
  return (
    <motion.div
      className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-800 flex items-center gap-2">
        <motion.span
          className="text-xl inline-block"
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🏠
        </motion.span>
        <div>
          <h3 className="text-white font-black text-base leading-tight">{f.teamTitle}</h3>
          <p className="text-slate-500 text-[10px]">{f.tapHint}</p>
        </div>
      </div>

      <div className="p-3 space-y-2">

        {/* ── INSIDE ── */}
        <motion.div
          className="rounded-xl border border-slate-700 bg-slate-800/40 overflow-hidden"
          variants={stagger} initial="hidden" animate="show"
        >
          <div className="px-3 py-1 bg-slate-800 border-b border-slate-700">
            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{f.inside}</span>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-700/50">

            {/* Kitchen */}
            <motion.div className="p-3 bg-red-950/20" variants={fadeUp}>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-sm">🍕</span>
                <span className="text-red-400 text-[9px] font-black uppercase tracking-wide">Cuisine</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <Character emoji="👩‍🍳" name="Kristina" sub={f.owner}
                  nameColor="text-purple-300" subColor="text-purple-600"
                  cookSway delay={0} />
                <Character emoji="👤" name="Yassin" animateY delay={0.4} />
                <Character emoji="👤" name="Wael"   animateY delay={0.8} fart />
              </div>
            </motion.div>

            {/* Bar + Caisse */}
            <div className="flex flex-col divide-y divide-slate-700/50">

              {/* Bar */}
              <motion.div className="p-3 bg-amber-950/20 flex-1" variants={fadeUp}>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-sm">☕</span>
                  <span className="text-amber-400 text-[9px] font-black uppercase tracking-wide">Bar</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Character emoji="⭐" name="Bilal"   sub={f.altDays}
                    nameColor="text-amber-400" subColor="text-amber-700"
                    animateY delay={0} />
                  <Character emoji="👤" name="Azhar"   sub={f.altDays}
                    subColor="text-slate-600" animateY delay={0.5} />
                  <Character emoji="👤" name="Youssef" sub={f.always}
                    subColor="text-slate-600" animateY delay={1.0} />
                </div>
              </motion.div>

              {/* La Caisse */}
              <motion.div
                className="p-3 bg-green-950/20"
                variants={fadeUp}
                animate={{ boxShadow: ['0 0 0 0 rgba(74,222,128,0.3)', '0 0 0 8px rgba(74,222,128,0)', '0 0 0 0 rgba(74,222,128,0.3)'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-sm">💰</span>
                  <span className="text-green-400 text-[9px] font-black uppercase tracking-wide">La Caisse</span>
                </div>
                <Character emoji="👨‍💼" name="Bernard" sub={f.owner}
                  nameColor="text-green-300" subColor="text-green-600"
                  animateY delay={0} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── OUTSIDE — servers walking ── */}
        <motion.div
          className="rounded-xl border border-sky-900/40 bg-sky-950/20 overflow-hidden"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 24 }}
        >
          <div className="px-3 py-1 bg-sky-950/30 border-b border-sky-900/30">
            <span className="text-sky-400 text-[9px] font-black uppercase tracking-widest">{f.outside}</span>
          </div>
          <div className="relative h-20 flex items-center justify-around px-8 overflow-hidden">
            {/* dashed path */}
            <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-sky-900/60 -translate-y-1/2 pointer-events-none" />
            <Server name="Omar" direction={1}  />
            <Server name="Moad" direction={-1} />
          </div>
        </motion.div>

      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-slate-800 flex flex-wrap items-center gap-3">
        <span className="text-[10px] text-amber-400">⭐ = you (Bilal)</span>
        <span className="text-slate-700">·</span>
        <span className="text-[10px] text-slate-500">{f.altShifts}</span>
      </div>
    </motion.div>
  );
}

// ── page ────────────────────────────────────────────────────────────────────

export function GuidePage({ onBack }: Props) {
  const { t, isRTL } = useLang();
  const BackIcon = isRTL ? <ArrowRight size={22} /> : <ArrowLeft size={22} />;

  return (
    <div className="min-h-screen bg-slate-950 pb-10">
      <div className="bg-slate-900 border-b border-slate-800 px-5 pt-14 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-300 active:bg-slate-700 transition-colors shrink-0">
            {BackIcon}
          </button>
          <div>
            <h1 className="text-white text-xl font-black">{t.guide.title}</h1>
            <p className="text-slate-400 text-sm">{t.guide.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        <div className="bg-linear-to-br from-amber-600 via-amber-700 to-orange-900 rounded-3xl p-6 text-center">
          <div className="text-5xl mb-3">🍽️</div>
          <h2 className="text-white text-xl font-black">{t.appName}</h2>
          <p className="text-amber-200 text-sm mt-1">{t.tagline}</p>
        </div>

        <RestaurantFloor />

        <BeachScene />

        {t.guide.steps.map((step, i) => (
          <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 text-xs font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="text-white font-bold text-base leading-tight">{step.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{step.text}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-sky-900/20 border border-sky-800/30 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <p className="text-slate-400 text-sm leading-relaxed">{t.dataLocal}</p>
        </div>

        <button onClick={onBack}
          className="w-full py-4 bg-amber-500 active:bg-amber-600 text-slate-900 font-black rounded-2xl text-base transition-colors">
          {t.guide.back}
        </button>
      </div>
    </div>
  );
}

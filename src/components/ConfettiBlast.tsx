import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#f59e0b', '#fbbf24', '#f97316', '#facc15', '#fde68a', '#d97706', '#fb923c'];
const COUNT = 48;

interface Piece {
  id: number;
  color: string;
  w: number;
  h: number;
  isCircle: boolean;
  vx: number;
  vy: number;
  rot: number;
  delay: number;
  dur: number;
}

function makePieces(): Piece[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / COUNT + (Math.random() - 0.5) * 0.4;
    const speed = 90 + Math.random() * 130;
    return {
      id: i,
      color: COLORS[i % COLORS.length],
      w: 5 + Math.random() * 8,
      h: 7 + Math.random() * 10,
      isCircle: i % 5 === 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.18,
      dur: 1.4 + Math.random() * 0.6,
    };
  });
}

interface Props {
  onDone: () => void;
}

export function ConfettiBlast({ onDone }: Props) {
  const pieces = useMemo(makePieces, []);

  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.w,
            height: p.isCircle ? p.w : p.h,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : 2,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: [0, p.vx * 0.6, p.vx],
            y: [0, p.vy * 0.5, p.vy + 220],
            opacity: [1, 1, 0],
            rotate: [0, p.rot * 0.5, p.rot],
            scale: [1, 1, 0.5],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            ease: 'easeOut',
            times: [0, 0.55, 1],
          }}
        />
      ))}
    </div>
  );
}

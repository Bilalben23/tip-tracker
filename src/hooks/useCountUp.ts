import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration = 1800) {
  // Start from 0 so the number always rolls up on mount
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef  = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = target;
    if (from === target) return;

    cancelAnimationFrame(rafRef.current);
    const startTime = performance.now();

    const tick = (now: number) => {
      const t     = Math.min((now - startTime) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      setDisplay(from + (target - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

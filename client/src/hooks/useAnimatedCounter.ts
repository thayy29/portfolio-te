import { useState, useEffect, useRef, useCallback } from 'react';

export function useAnimatedCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const start = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, hasStarted]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          start();
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [start]);

  return { count, ref };
}

import { useEffect, type RefObject } from 'react';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Publishes the element's scroll position as CSS variables, so parallax lives in the
 * stylesheet and React never re-renders while scrolling. All range from 0 to 1:
 *   --p      whole pass, from entering at the bottom to leaving at the top
 *   --enter  from entering at the bottom until its top reaches the viewport top
 *   --exit   from its top reaching the viewport top until it has fully left
 *   --pin    across the distance a taller-than-viewport element stays pinned
 * With reduced motion nothing is published, and the CSS fallbacks show the resting state.
 */
export function useScrollVars(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const { top, height } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      el.style.setProperty('--p', clamp01((vh - top) / (vh + height)).toFixed(4));
      el.style.setProperty('--enter', clamp01((vh - top) / vh).toFixed(4));
      el.style.setProperty('--exit', clamp01(-top / height).toFixed(4));
      el.style.setProperty('--pin', clamp01(-top / Math.max(1, height - vh)).toFixed(4));
    };

    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };

    // Also re-measures when async content, such as the repo cards, changes the height
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(el);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref]);
}

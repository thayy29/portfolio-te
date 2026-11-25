import { useEffect } from 'react';

/* Tells the glass card under the mouse where to place its soft glow (see .hw-panel::after) */
export function useCardSpotlight() {
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !(e.target instanceof Element)) return;
      const card = e.target.closest<HTMLElement>('.hw-panel');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);
}

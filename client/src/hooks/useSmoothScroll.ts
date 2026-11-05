import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/* Where the element rests once its reveal transform (.rv) has finished */
function anchorTop(el: Element) {
  const style = getComputedStyle(el);
  const pendingShift = new DOMMatrixReadOnly(style.transform).m42;
  const margin = parseFloat(style.scrollMarginTop) || 0;
  return el.getBoundingClientRect().top - pendingShift - margin + window.scrollY;
}

/* Page-wide smooth scrolling, including same-page anchor links */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.09, autoRaf: true });

    /*
     * Handled here rather than with Lenis's `anchors` option, whose target can be fractional
     * on high-DPI screens. Seen with Lenis 1.3.27: a fractional target left it stuck in
     * "scrolling" after arriving, ignoring native scrolling. An integer target does not.
     */
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href^="#"]');
      const hash = link?.getAttribute('href');
      const target = hash && hash.length > 1 ? document.querySelector(hash) : null;
      if (target) lenis.scrollTo(Math.round(anchorTop(target)));
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, []);
}

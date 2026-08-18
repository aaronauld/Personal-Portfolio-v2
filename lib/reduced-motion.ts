const QUERY = '(prefers-reduced-motion: reduce)';

/** True when the visitor has asked the OS for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/** Subscribe to changes; returns an unsubscribe function. */
export function onReducedMotionChange(fn: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  const handler = (e: MediaQueryListEvent) => fn(e.matches);
  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}

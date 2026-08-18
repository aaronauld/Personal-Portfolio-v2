'use client';

import { useEffect, useRef } from 'react';
import { onReducedMotionChange, prefersReducedMotion } from '@/lib/reduced-motion';

/**
 * Mount point for the three.js globe. three is imported dynamically so it
 * stays out of the initial bundle.
 */
export function Globe({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const mountGlobe = async () => {
      try {
        const { createGlobe } = await import('@/lib/globe');
        if (cancelled) return;
        cleanup = createGlobe(mount, { reducedMotion: prefersReducedMotion() });
      } catch (error) {
        console.warn('globe unavailable:', error);
      }
    };

    void mountGlobe();

    // rebuild if the visitor flips the OS motion setting
    const unsubscribe = onReducedMotionChange(() => {
      cleanup?.();
      cleanup = null;
      void mountGlobe();
    });

    return () => {
      cancelled = true;
      unsubscribe();
      cleanup?.();
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}

'use client';

import { useEffect } from 'react';
import {
  setupClocks,
  setupMagnet,
  setupReveal,
  setupRevealSafetyNet,
  setupScroll,
  setupTilt,
  setupWords,
} from '@/lib/effects';

/**
 * Attaches every DOM-driven effect once, on mount. Nothing here lives in React
 * state — none of it should re-render at animation rate.
 */
export function SiteEffects() {
  useEffect(() => {
    const root = document.body;
    const cleanups = [
      setupReveal(root),
      setupWords(root),
      setupRevealSafetyNet(root),
      setupClocks(root),
      setupTilt(root),
      setupMagnet(root),
      setupScroll(root),
    ];
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}

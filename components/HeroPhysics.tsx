'use client';

import { useEffect } from 'react';
import { onReducedMotionChange, prefersReducedMotion } from '@/lib/reduced-motion';
import type { setupPhysics } from '@/lib/physics';

type Instance = Awaited<ReturnType<typeof setupPhysics>>;

/**
 * Module-level so that a remount (React Strict Mode, Fast Refresh) cannot run
 * two setups against the same nodes: the second would measure a layout the
 * first had already scattered and save that as "home".
 */
let queue: Promise<void> = Promise.resolve();

function serialize(task: () => Promise<void>): Promise<void> {
  queue = queue.then(task, task);
  return queue;
}

/**
 * Drives the hero. matter-js is imported dynamically so it stays out of the
 * initial bundle, and the engine is rebuilt if the letter nodes are ever
 * swapped out from under it (otherwise it drives detached elements and the
 * visible hero goes dead).
 */
export function HeroPhysics() {
  useEffect(() => {
    const root = document.body;
    const layer = root.querySelector<HTMLElement>('[data-phys]');
    if (!layer) return;

    let instance: Instance = null;
    let cancelled = false;

    const run = () =>
      serialize(async () => {
        if (cancelled) return;
        try {
          instance?.destroy();
          instance = null;
          const { setupPhysics } = await import('@/lib/physics');
          const next = await setupPhysics(root, { reducedMotion: prefersReducedMotion() });
          if (cancelled) next?.destroy();
          else instance = next;
        } catch (error) {
          console.warn('physics unavailable:', error);
        }
      });

    void run();

    const observer = new MutationObserver(() => {
      const bound = instance?.elements[0];
      if (bound && !bound.isConnected) void run();
    });
    observer.observe(layer, { childList: true, subtree: true });

    const unsubscribe = onReducedMotionChange(() => void run());

    /**
     * Home positions are measured once, from a layout that depends on viewport
     * width (the name is clamp(3.2rem, 11vw, 9rem)). If the window is resized
     * afterwards the glyphs resize but their bodies do not, so the composition
     * tears itself apart — most visibly when the page loads into a pane that is
     * still settling to its final width. Re-measure instead, which also
     * re-typesets and re-aims the hint arrow.
     */
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let resizeTimer = 0;
    const onResize = () => {
      const dw = Math.abs(window.innerWidth - lastWidth);
      const dh = Math.abs(window.innerHeight - lastHeight);
      // mobile browser chrome collapsing changes height alone; ignore it
      if (dw < 1 && dh < 120) return;
      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
      // Tear down straight away rather than at the end of the debounce: the
      // teardown clears the inline positioning, so the letters fall back to
      // ordinary flow layout — correct at any width — instead of holding stale
      // absolute positions while we wait.
      void serialize(async () => {
        instance?.destroy();
        instance = null;
      });
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => void run(), 250);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      unsubscribe();
      void serialize(async () => {
        instance?.destroy();
        instance = null;
      });
    };
  }, []);

  return null;
}

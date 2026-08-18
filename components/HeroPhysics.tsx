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

    return () => {
      cancelled = true;
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

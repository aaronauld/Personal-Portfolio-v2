import { prefersReducedMotion } from './reduced-motion';

type Cleanup = () => void;

const noop: Cleanup = () => {};

function revealNow(el: Element) {
  el.setAttribute('data-revealed', '');
}

/** Fade-and-rise on entry. Fires once per element, then unobserves. */
export function setupReveal(root: HTMLElement): Cleanup {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!('IntersectionObserver' in window)) {
    items.forEach(revealNow);
    return noop;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.style.transitionDelay = `${el.dataset.delay ?? 0}ms`;
        revealNow(el);
        observer.unobserve(el);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
  );

  items.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

/** Headline words rise in on a 60ms stagger. */
export function setupWords(root: HTMLElement): Cleanup {
  const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-words]'));
  if (!('IntersectionObserver' in window)) {
    root.querySelectorAll('[data-word]').forEach(revealNow);
    return noop;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const words = Array.from(entry.target.querySelectorAll<HTMLElement>('[data-word]'));
        words.forEach((word, i) => {
          word.style.transitionDelay = `${i * 60}ms`;
          revealNow(word);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.25 },
  );

  blocks.forEach((block) => observer.observe(block));
  return () => observer.disconnect();
}

/** Content can never be stranded invisible if the observers never fire. */
export function setupRevealSafetyNet(root: HTMLElement, delay = 5000): Cleanup {
  const timer = window.setTimeout(() => {
    root.querySelectorAll('[data-reveal], [data-word]').forEach(revealNow);
  }, delay);
  return () => window.clearTimeout(timer);
}

/** Live Sydney and New York clocks, written straight to the DOM. */
export function setupClocks(root: HTMLElement): Cleanup {
  const sydney = Array.from(root.querySelectorAll<HTMLElement>('[data-clock="sydney"]'));
  const newYork = Array.from(root.querySelectorAll<HTMLElement>('[data-clock="ny"]'));
  if (!sydney.length && !newYork.length) return noop;

  const format = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
    } catch {
      return '--:--:--';
    }
  };

  const tick = () => {
    const syd = format('Australia/Sydney');
    const nyc = format('America/New_York');
    sydney.forEach((el) => (el.textContent = syd));
    newYork.forEach((el) => (el.textContent = nyc));
  };

  tick();
  const timer = window.setInterval(tick, 1000);
  return () => window.clearInterval(timer);
}

/** Project cards tilt toward the cursor and light up a tracking glow. */
export function setupTilt(root: HTMLElement): Cleanup {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-tilt]'));
  const cleanups: Cleanup[] = [];

  cards.forEach((card) => {
    const move = (event: PointerEvent) => {
      if (prefersReducedMotion()) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-8px)`;
      const glow = card.querySelector<HTMLElement>('[data-glow]');
      if (glow) {
        glow.style.opacity = '1';
        glow.style.background = `radial-gradient(300px circle at ${(x + 0.5) * 100}% ${
          (y + 0.5) * 100
        }%, color-mix(in oklab, var(--accent) 20%, transparent), transparent 70%)`;
      }
    };
    const leave = () => {
      card.style.transform = 'none';
      const glow = card.querySelector<HTMLElement>('[data-glow]');
      if (glow) glow.style.opacity = '0';
    };

    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', leave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/** Primary buttons lean toward the cursor. */
export function setupMagnet(root: HTMLElement): Cleanup {
  const buttons = Array.from(root.querySelectorAll<HTMLElement>('[data-magnet]'));
  const cleanups: Cleanup[] = [];

  buttons.forEach((button) => {
    const move = (event: PointerEvent) => {
      if (prefersReducedMotion()) return;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.2}px, ${y * 0.28}px)`;
    };
    const leave = () => {
      button.style.transform = 'translate(0, 0)';
    };

    button.addEventListener('pointermove', move);
    button.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      button.removeEventListener('pointermove', move);
      button.removeEventListener('pointerleave', leave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/**
 * One rAF ticker drives every scroll effect: the progress bar and the pinned
 * horizontal work section. Sampling scrollY per frame rather than listening for
 * scroll events is smoother, and scroll events don't fire at all in some
 * embedded contexts.
 */
export function setupScroll(root: HTMLElement): Cleanup {
  const bar = root.querySelector<HTMLElement>('[data-progress]');
  const wrapper = root.querySelector<HTMLElement>('[data-hwrap]');
  const sticky = root.querySelector<HTMLElement>('[data-hsticky]');
  const track = root.querySelector<HTMLElement>('[data-htrack]');

  let hmax = 0;
  const size = () => {
    if (!wrapper || !sticky || !track) return;
    hmax = Math.max(0, track.scrollWidth - sticky.clientWidth + 40);
    // deriving the height from the track keeps the sideways drag proportional
    // at any width and card count
    wrapper.style.height = `${window.innerHeight + hmax * 1.3}px`;
  };

  let lastScrollY = -1;
  let lastTranslate = -1;
  let lastPercent = -1;

  const run = () => {
    const scrollY = window.scrollY;
    if (scrollY === lastScrollY) return;
    lastScrollY = scrollY;

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = Math.round((scrollable > 0 ? (scrollY / scrollable) * 100 : 0) * 10) / 10;
    if (bar && percent !== lastPercent) {
      lastPercent = percent;
      bar.style.width = `${percent}%`;
    }

    if (wrapper && sticky && track) {
      const top = wrapper.getBoundingClientRect().top;
      const span = wrapper.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -top / (span || 1)));
      const translate = Math.round(-progress * hmax);
      if (translate !== lastTranslate) {
        lastTranslate = translate;
        track.style.transform = `translateX(${translate}px)`;
      }
    }
  };

  let raf = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    run();
  };

  const resize = () => {
    size();
    lastScrollY = -1;
    run();
  };
  const onVisibility = () => {
    if (!document.hidden) resize();
  };

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibility);

  size();
  run();
  tick();
  // late font metrics can change the track width
  const settle = window.setTimeout(resize, 500);

  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(settle);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

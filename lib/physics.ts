type MatterAPI = typeof import('matter-js');

/** matter binds these to the element in Mouse.create; the types don't expose them. */
type MouseListeners = {
  mousewheel?: EventListener;
  mousedown: EventListener;
  mousemove: EventListener;
  mouseup: EventListener;
};

type Options = { reducedMotion?: boolean };

const MAX_SPEED = 45; // keep a hard fling inside the stage
const WALL_THICKNESS = 400; // matter has no CCD — thin walls let a fling tunnel out
const FLOOR_GAP = 10; // rest just above the hero's bottom rule

const INLINE_PROPS = [
  'position',
  'left',
  'top',
  'width',
  'height',
  'transform',
  'display',
  'margin',
  'willChange',
  'alignItems',
  'justifyContent',
] as const;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function clearInlineLayout(el: HTMLElement) {
  const style = el.style as unknown as Record<string, string>;
  for (const prop of INLINE_PROPS) style[prop] = '';
}

/**
 * Turns every [data-letter] inside [data-phys] into a rigid body. Gravity starts
 * at 0 so the name holds its typeset position; the first grab switches it on.
 *
 * The setup order matters — see the handoff notes: fonts, then a settled layout
 * pass, then clear any inline positioning from a previous run, then measure.
 */
export async function setupPhysics(
  root: HTMLElement,
  options: Options = {},
): Promise<{ elements: HTMLElement[]; destroy: () => void } | null> {
  const reducedMotion = options.reducedMotion ?? false;
  const layer = root.querySelector<HTMLElement>('[data-phys]');
  if (!layer) return null;

  const imported = await import('matter-js');
  const M: MatterAPI =
    (imported as unknown as { default?: MatterAPI }).default ?? (imported as unknown as MatterAPI);
  const { Engine, Composite, Bodies, Body, Mouse, MouseConstraint, Events, Runner } = M;

  // race, never await bare — a hidden tab never settles document.fonts.ready
  if (document.fonts?.ready) {
    await Promise.race([document.fonts.ready, sleep(1500)]);
  }
  // settle one layout pass, but never block on rAF alone (frozen while hidden)
  await Promise.race([
    new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    sleep(300),
  ]);

  const elements = Array.from(layer.querySelectorAll<HTMLElement>('[data-letter]'));
  if (!elements.length) return null;

  // measure the pristine flow layout, never a scattered one, or "home" is garbage
  elements.forEach(clearInlineLayout);
  void layer.offsetHeight; // force reflow

  // ...and never an unstyled one either: if the stylesheet has not applied,
  // these are bare spans and every home position would be garbage.
  const styled = (el: HTMLElement) =>
    getComputedStyle(el).getPropertyValue('--phys-ready').trim() === '1';

  // Wait for the layout to hold still for two consecutive samples. The name is
  // sized in vw, so measuring while the window is still settling to its final
  // width (a preview pane, a restored window) captures boxes that are wrong the
  // moment it stops.
  let stable = 0;
  let lastWidth = -1;
  let lastHeight = -1;
  for (let tries = 0; tries < 25; tries++) {
    const width = layer.clientWidth;
    const height = layer.clientHeight;
    const ready = styled(elements[0]) && elements[0].getBoundingClientRect().width > 0;
    if (ready && width === lastWidth && height === lastHeight) {
      if (++stable >= 2) break;
    } else {
      stable = 0;
    }
    lastWidth = width;
    lastHeight = height;
    await sleep(80);
  }

  const layerRect = layer.getBoundingClientRect();
  const items = elements.map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      el,
      w: rect.width,
      h: rect.height,
      x: rect.left - layerRect.left + rect.width / 2,
      y: rect.top - layerRect.top + rect.height / 2,
    };
  });

  items.forEach((item) => {
    const style = item.el.style;
    style.position = 'absolute';
    style.left = '0';
    style.top = '0';
    style.width = `${item.w}px`;
    style.height = `${item.h}px`;
    style.display = 'flex';
    style.alignItems = 'center';
    style.justifyContent = 'center';
    style.margin = '0';
    style.transform = `translate(${item.x - item.w / 2}px, ${item.y - item.h / 2}px)`;
    style.willChange = 'transform';
  });

  const engine = Engine.create();
  engine.gravity.y = 0; // the name stays typeset until someone grabs it

  const bodies = items.map((item) =>
    Bodies.rectangle(item.x, item.y, Math.max(6, item.w - 4), Math.max(6, item.h - 6), {
      restitution: 0.34,
      friction: 0.3,
      frictionAir: 0.016,
      chamfer: { radius: 5 },
    }),
  );
  Composite.add(engine.world, bodies);

  // Aim the grab hint at the pill row we just measured. The tip sits at
  // (24,28) in the arrow's 260x190 viewBox; place it a little under the row's
  // last pill so the swoop's tail still falls toward the label in the corner.
  const arrow = root.querySelector<SVGSVGElement>('[data-hint-arrow]');
  const label = root.querySelector<HTMLElement>('[data-hint]:not([data-hint-arrow])');
  const pills = items.filter((item) => item.el.hasAttribute('data-pill'));

  /**
   * Draws the grab hint: a swoop leaving the GRAB A LETTER label, sweeping
   * left and rising into an arrowhead under the centre of the composition.
   * Both ends are measured, so the curve is generated rather than scaled —
   * the label tracks the bottom bar's flex layout while the composition is
   * centred, and the two move independently.
   */
  const aimArrow = () => {
    if (!arrow || !label || !pills.length) return;
    arrow.removeAttribute('data-aimed');
    if (!arrow.getBoundingClientRect().width) return; // hidden on narrow layouts

    const [curve, head] = Array.from(arrow.children) as SVGPathElement[];
    if (!curve || !head) return;

    const layerRect = layer.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();

    // tail: just above the label. tip: under the middle of the pill row.
    const from = {
      x: labelRect.left + labelRect.width / 2 - layerRect.left,
      y: labelRect.top - layerRect.top - 10,
    };
    const to = {
      x: (Math.min(...pills.map((p) => p.x - p.w / 2)) + Math.max(...pills.map((p) => p.x + p.w / 2))) / 2,
      y: Math.max(...pills.map((p) => p.y + p.h / 2)) + 16,
    };

    const dx = from.x - to.x;
    const dy = from.y - to.y;
    if (dy < 60 || Math.abs(dx) < 40) return; // no room for a legible curve

    // leaves the label horizontally, arrives straight up under the pills
    const c1 = { x: from.x - dx * 0.55, y: from.y + 2 };
    const c2 = { x: to.x, y: to.y + dy * 0.62 };

    arrow.setAttribute('viewBox', `0 0 ${layer.clientWidth} ${layer.clientHeight}`);
    curve.setAttribute(
      'd',
      `M${from.x.toFixed(1)} ${from.y.toFixed(1)}C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`,
    );
    head.setAttribute(
      'd',
      `M${(to.x - 7).toFixed(1)} ${(to.y + 13).toFixed(1)}L${to.x.toFixed(1)} ${to.y.toFixed(1)}l7 13`,
    );

    // the draw animation needs the length of the curve we just generated
    curve.style.setProperty('--dash', `${Math.ceil(curve.getTotalLength())}`);
    arrow.setAttribute('data-aimed', '');
  };
  aimArrow();

  const makeWalls = () => {
    const w = layer.clientWidth;
    const h = layer.clientHeight;
    const floorTop = h - FLOOR_GAP;
    const opts = { isStatic: true };
    return [
      Bodies.rectangle(w / 2, floorTop + WALL_THICKNESS / 2, Math.max(w * 2, 2000), WALL_THICKNESS, opts),
      Bodies.rectangle(-WALL_THICKNESS / 2, h / 2, WALL_THICKNESS, Math.max(h * 4, 3000), opts),
      Bodies.rectangle(w + WALL_THICKNESS / 2, h / 2, WALL_THICKNESS, Math.max(h * 4, 3000), opts),
      Bodies.rectangle(w / 2, -900 - WALL_THICKNESS / 2, Math.max(w * 2, 2000), WALL_THICKNESS, opts),
    ];
  };
  let walls = makeWalls();
  Composite.add(engine.world, walls);

  const mouse = Mouse.create(layer);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.16, damping: 0.05, render: { visible: false } },
  });
  Composite.add(engine.world, mouseConstraint);

  // detach matter's own wheel and touch listeners, or the toy eats page
  // scrolling on trackpads and mobile
  const listeners = mouse as unknown as MouseListeners;
  if (listeners.mousewheel) {
    layer.removeEventListener('wheel', listeners.mousewheel);
    layer.removeEventListener('DOMMouseScroll', listeners.mousewheel);
  }
  layer.removeEventListener('touchstart', listeners.mousedown);
  layer.removeEventListener('touchmove', listeners.mousemove);
  layer.removeEventListener('touchend', listeners.mouseup);

  const hints = Array.from(root.querySelectorAll<HTMLElement>('[data-hint]'));
  const wake = () => {
    if (reducedMotion) return; // leave the composition typeset
    engine.gravity.y = 1;
    hints.forEach((hint) => {
      hint.style.transition = 'opacity .4s';
      hint.style.opacity = '0';
    });
  };
  Events.on(mouseConstraint, 'startdrag', wake);
  const onTouchStart = () => wake();
  layer.addEventListener('touchstart', onTouchStart, { passive: true });

  const onAfterUpdate = () => {
    for (let i = 0; i < items.length; i++) {
      const body = bodies[i];
      const item = items[i];
      const v = body.velocity;
      const speedSq = v.x * v.x + v.y * v.y;
      if (speedSq > MAX_SPEED * MAX_SPEED) {
        const scale = MAX_SPEED / Math.sqrt(speedSq);
        Body.setVelocity(body, { x: v.x * scale, y: v.y * scale });
      }
      item.el.style.transform = `translate(${body.position.x - item.w / 2}px, ${
        body.position.y - item.h / 2
      }px) rotate(${body.angle}rad)`;
    }
  };
  Events.on(engine, 'afterUpdate', onAfterUpdate);

  const runner = Runner.create();
  Runner.run(runner, engine);

  const resetButton = root.querySelector<HTMLElement>('[data-reset]');
  const reset = () => {
    engine.gravity.y = 0;
    bodies.forEach((body, i) => {
      Body.setPosition(body, { x: items[i].x, y: items[i].y });
      Body.setAngle(body, 0);
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
    });
    hints.forEach((hint) => (hint.style.opacity = ''));
  };
  resetButton?.addEventListener('click', reset);

  const onResize = () => {
    Composite.remove(engine.world, walls);
    walls = makeWalls();
    Composite.add(engine.world, walls);
    // bodies keep their measured homes across a resize, but the arrow's
    // clamped width (and so its tip offset) changes
    aimArrow();
  };
  window.addEventListener('resize', onResize);

  return {
    elements,
    destroy: () => {
      try {
        Runner.stop(runner);
        Events.off(engine, 'afterUpdate', onAfterUpdate);
        Events.off(mouseConstraint, 'startdrag', wake);
        Engine.clear(engine);
      } catch {
        /* already torn down */
      }
      window.removeEventListener('resize', onResize);
      layer.removeEventListener('touchstart', onTouchStart);
      resetButton?.removeEventListener('click', reset);
      elements.forEach(clearInlineLayout);
      hints.forEach((hint) => (hint.style.opacity = ''));
      arrow?.removeAttribute('data-aimed');
    },
  };
}

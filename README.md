# aaronauld.com

Personal site — a single scrolling page built from the `design_handoff_personal_site`
handoff. Two signature pieces carry it: a hero where the name and tech pills are real
rigid bodies in a matter.js simulation, and a three.js globe with a Sydney → New York
arc that pins beside the About copy.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | CSS Modules + custom properties, OKLCH palette |
| Fonts | `next/font` — Instrument Serif, Hanken Grotesk, Space Mono |
| Physics | `matter-js` (dynamically imported) |
| 3D | `three` (dynamically imported) |

## Commands

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Layout

```
app/
  layout.tsx            fonts, metadata, viewport
  page.tsx              section order and the two behaviour mounts
  globals.css           design tokens, reset, keyframes, reveal primitives
  icon.svg              favicon
  opengraph-image.tsx   OG card, rendered at build from assets/*.ttf
  robots.ts sitemap.ts
components/             one component + CSS module per section
lib/
  data.ts               projects, roles, marquee items, links
  physics.ts            hero rigid bodies
  globe.ts              three.js globe
  effects.ts            reveals, words, clocks, tilt, magnet, scroll ticker
  reduced-motion.ts     prefers-reduced-motion helpers
```

### Behaviour notes

Animation state is deliberately kept out of React — the engines write straight to
`style.transform`, so nothing re-renders at animation rate. Two client components
(`SiteEffects`, `HeroPhysics`) mount the imperative layer; everything else is a server
component.

A few things are load-bearing and easy to break:

- The page root uses `overflow-x: clip`, **not** `hidden` — `hidden` makes it a scroll
  container and silently breaks every `position: sticky` descendant.
- All scroll work runs from one `requestAnimationFrame` ticker, not `scroll` events.
- The hero measures its pristine flow layout before saving "home" positions, and clears
  any inline positioning from a previous run first.
- Physics walls are 400px thick — matter.js has no continuous collision detection, so
  thin walls let a hard fling tunnel out of the scene.
- The reveal observers have a ~5s safety net so content can never be stranded invisible.

### Content

Copy and data live in `lib/data.ts`. Project cards accept an optional `url` — set it and
the title renders as a link.

### Configuration

`NEXT_PUBLIC_SITE_URL` sets the canonical origin used by metadata, `robots.txt` and the
sitemap. It defaults to `https://aaronauld.com`.

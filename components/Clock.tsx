/**
 * Placeholder digits, filled by the 1s interval in SiteEffects. Rendering
 * `--:--:--` on the server keeps hydration deterministic (and is the
 * fallback if Intl throws).
 */
export function Clock({ zone }: { zone: 'sydney' | 'ny' }) {
  return <span data-clock={zone}>--:--:--</span>;
}

import { links } from '@/lib/data';
import s from './Nav.module.css';

export function Wash() {
  return <div className={s.wash} aria-hidden="true" />;
}

export function ScrollProgress() {
  return (
    <div className={s.progressTrack} aria-hidden="true">
      <div className={s.progressFill} data-progress />
    </div>
  );
}

export function Nav() {
  return (
    <nav className={s.nav} aria-label="Primary">
      <a href="#top" className={s.wordmark}>
        Aaron Auld
      </a>
      <div className={s.links}>
        <a href="#about" className={s.link}>
          About
        </a>
        <a href="#work" className={s.link}>
          Work
        </a>
        <a href="#stack" className={s.link}>
          Stack
        </a>
        <a href={links.github} target="_blank" rel="noopener" className={s.github}>
          GitHub &#8599;
        </a>
      </div>
    </nav>
  );
}

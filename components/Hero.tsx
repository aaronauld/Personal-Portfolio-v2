import { Clock } from './Clock';
import { links } from '@/lib/data';
import s from './Hero.module.css';

const FIRST_NAME = ['A', 'A', 'R', 'O', 'N'];
const SURNAME = ['A', 'u', 'l', 'd'];
const PILLS = ['React', 'TypeScript', 'React Native', '.NET 8', 'Azure'];

export function Hero() {
  return (
    <section className={s.hero} data-stage aria-label="Introduction">
      <div className={s.kickerWrap}>
        <div className="kicker">Full-stack engineer &#183; Sydney</div>
      </div>

      {/* Every node with data-letter becomes a rigid body — see lib/physics.ts */}
      <div className={s.physLayer} data-phys>
        <div className={s.stack}>
          <h1 className={s.name}>
            <span className="srOnly">Aaron Auld</span>
            <span className={s.row} aria-hidden="true">
              {FIRST_NAME.map((letter, i) => (
                <span key={`f${i}`} className={s.letter} data-letter>
                  {letter}
                </span>
              ))}
            </span>
            <span className={s.row} aria-hidden="true">
              {SURNAME.map((letter, i) => (
                <span key={`s${i}`} className={`${s.letter} ${s.letterAccent}`} data-letter>
                  {letter}
                </span>
              ))}
            </span>
          </h1>
          <div className={s.pills}>
            {PILLS.map((pill) => (
              <span key={pill} className={s.pill} data-letter>
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={s.bar}>
        <div className={s.buttons}>
          <a href="#work" className={s.cta} data-magnet>
            See the work &#8594;
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noopener"
            className={s.outline}
            data-magnet
          >
            GitHub &#8599;
          </a>
          <button type="button" className={s.reset} data-reset>
            &#8635; PUT IT BACK
          </button>
        </div>
        <div className={s.meta}>
          <div className={s.hint} data-hint>
            <svg className={s.hintArrow} viewBox="0 0 260 190" aria-hidden="true">
              {/* dash length is the measured path length (304u), rounded up */}
              <path
                className={s.hintArrowPath}
                strokeDasharray="320"
                d="M246 172C196 180 96 172 52 116 34 94 26 60 24 28"
              />
              <path className={s.hintArrowHead} d="M15.7 46.2 24 28l10.5 17" />
            </svg>
            <span className={s.hintLabel}>GRAB A LETTER</span>
          </div>
          <div>
            <div className={s.clockLabel}>SYDNEY</div>
            <div className={s.clockDigits}>
              <Clock zone="sydney" />
            </div>
          </div>
          <div>
            <div className={s.clockLabel}>NEW YORK</div>
            <div className={s.clockDigits}>
              <Clock zone="ny" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Globe } from './Globe';
import { Words } from './Words';
import s from './About.module.css';

const FACTS = [
  { label: 'BASED', value: 'Sydney, Australia' },
  { label: 'STUDIED', value: 'B. Adv. Computing, USyd' },
  { label: 'CERTIFIED', value: 'Azure · Terraform' },
];

export function About() {
  return (
    <section id="about" className={s.about} aria-labelledby="about-heading">
      <div className={s.grid}>
        <div className={s.left}>
          <div className={s.sticky}>
            <div className={s.stage}>
              <div className={s.halo} aria-hidden="true" />
              <Globe className={s.mount} />
              <div className={s.caption}>SCROLL OR DRAG &#183; SYD &#8644; NYC</div>
            </div>
          </div>
        </div>

        <div className={s.right}>
          <div className={`kicker ${s.kicker}`} data-reveal>
            01 &mdash; About
          </div>
          <Words
            id="about-heading"
            className={s.headline}
            parts={['I build software that feels ', { em: 'good' }, ' to use.']}
          />
          <p className={s.body} data-reveal>
            Full-stack engineer in Sydney, looking to move to New York. Hence the two clocks, and
            the arc on that globe.
          </p>
          <div className={s.facts}>
            {FACTS.map((fact, i) => (
              <div
                key={fact.label}
                className={s.fact}
                data-reveal
                data-delay={i * 70 || undefined}
              >
                <span className={s.factLabel}>{fact.label}</span>
                <span className={s.factValue}>{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

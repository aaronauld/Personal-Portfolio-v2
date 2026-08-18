import { roles } from '@/lib/data';
import s from './Experience.module.css';

export function Experience() {
  return (
    <section id="experience" className={s.section} aria-labelledby="experience-heading">
      <div className="wrap">
        <h2 className={`kicker ${s.kicker}`} id="experience-heading" data-reveal>
          03 &mdash; Where I&#39;ve worked
        </h2>
        <div className={s.list}>
          {roles.map((role) => (
            <div key={role.company} className={s.row} data-reveal>
              <div className={s.company}>{role.company}</div>
              <div className={s.note}>
                <span className={s.title}>{role.title}</span> &mdash; {role.note}
              </div>
              <div className={s.years}>{role.years}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

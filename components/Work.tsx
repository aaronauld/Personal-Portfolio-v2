import { Words } from './Words';
import { projects } from '@/lib/data';
import s from './Work.module.css';

export function Work() {
  return (
    <section id="work" className={s.wrapper} data-hwrap aria-labelledby="work-heading">
      <div className={s.sticky} data-hsticky>
        <div className={s.header}>
          <div className={`kicker ${s.kicker}`}>02 &mdash; Selected work &#183; scroll sideways</div>
          <Words
            id="work-heading"
            className={s.headline}
            parts={["Things I've ", { em: 'shipped.' }]}
          />
        </div>

        <div className={s.track} data-htrack>
          {projects.map((project) => (
            <article key={project.num} className={s.card} data-tilt>
              <div className={s.glow} data-glow aria-hidden="true" />
              <div className={s.cardTop}>
                <span className={s.num}>{project.num}</span>
                <span className={s.kind}>{project.kind}</span>
              </div>
              <h3 className={s.title}>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener">
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </h3>
              <div className={s.tag}>{project.tag}</div>
              <p className={s.blurb}>{project.blurb}</p>
              <div className={s.chips}>
                {project.stack.map((item) => (
                  <span key={item} className={s.chip}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

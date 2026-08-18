import { Clock } from './Clock';
import { Words } from './Words';
import { links } from '@/lib/data';
import s from './Contact.module.css';

const ROWS = [
  { label: 'Email', value: `${links.email} ↗`, href: `mailto:${links.email}`, external: false },
  { label: 'GitHub', value: 'github.com/aaronauld ↗', href: links.github, external: true },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/aa2000 ↗',
    href: links.linkedin,
    external: true,
  },
];

export function Contact() {
  return (
    <footer id="contact" className={s.footer} aria-labelledby="contact-heading">
      <div className="wrap">
        <div className={`kicker ${s.kicker}`} data-reveal>
          04 &mdash; Contact
        </div>
        <Words
          id="contact-heading"
          className={s.headline}
          parts={["Let's build ", { em: 'something.' }]}
        />
        <div className={s.links}>
          {ROWS.map((row, i) => (
            <a
              key={row.label}
              href={row.href}
              className={s.link}
              data-reveal
              data-delay={i * 60 || undefined}
              {...(row.external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              <span>{row.label}</span>
              <span className={s.value}>{row.value}</span>
            </a>
          ))}
        </div>
        <div className={s.meta}>
          <span>
            Built from scratch &mdash; React, three.js, matter.js &#183; &copy; 2026 Aaron Auld
          </span>
          <span>
            SYD <Clock zone="sydney" /> &#183; NYC <Clock zone="ny" />
          </span>
        </div>
      </div>
    </footer>
  );
}

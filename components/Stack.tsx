import { marqueeA, marqueeB } from '@/lib/data';
import s from './Stack.module.css';

function Band({
  items,
  reverse = false,
  last = false,
}: {
  items: string[];
  reverse?: boolean;
  last?: boolean;
}) {
  // the list is rendered twice so the -50% keyframe loops seamlessly; the
  // second copy is hidden from assistive tech so items are announced once
  const half = (hidden: boolean) => (
    <span className={s.half} aria-hidden={hidden ? 'true' : undefined}>
      {items.map((item) => (
        <span key={item} className={`${s.item} ${reverse ? s.itemAccent : ''}`}>
          {item}
        </span>
      ))}
    </span>
  );

  return (
    <div className={`${s.band} ${last ? s.bandLast : ''}`}>
      <div className={`${s.track} ${reverse ? s.trackReverse : ''}`} data-marquee>
        {half(false)}
        {half(true)}
      </div>
    </div>
  );
}

export function Stack() {
  return (
    <section id="stack" className={s.section} aria-labelledby="stack-heading">
      <h2 className={`kicker ${s.kicker}`} id="stack-heading" data-reveal>
        Tech &amp; frameworks I work with
      </h2>
      <Band items={marqueeA} />
      <Band items={marqueeB} reverse last />
    </section>
  );
}

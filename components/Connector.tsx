import s from './Connector.module.css';

export function Connector() {
  return (
    <div className={s.connector} aria-hidden="true">
      <div className={s.arrow} data-bob>
        &#8595;
      </div>
      <div className={s.line} />
      <div className={s.label}>SYDNEY &#8644; NEW YORK</div>
    </div>
  );
}

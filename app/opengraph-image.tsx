import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Aaron Auld — Full-stack engineer, Sydney';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#F9F3EC';
const INK = '#302B26';
const ACCENT = '#C0341C';
const MUTED = '#7C7166';
const RULE = '#E2D9CF';

export default async function OpengraphImage() {
  const [regular, italic] = await Promise.all([
    readFile(join(process.cwd(), 'assets', 'InstrumentSerif-Regular.ttf')),
    readFile(join(process.cwd(), 'assets', 'InstrumentSerif-Italic.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 4, color: ACCENT }}>
          FULL-STACK ENGINEER · SYDNEY
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9 }}>
          <div style={{ display: 'flex', fontSize: 170, color: INK }}>AARON</div>
          <div style={{ display: 'flex', fontSize: 170, color: ACCENT, fontStyle: 'italic' }}>
            Auld
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `1px solid ${RULE}`,
            paddingTop: 28,
            fontSize: 26,
            color: MUTED,
          }}
        >
          <div style={{ display: 'flex' }}>React · TypeScript · React Native · .NET 8 · Azure</div>
          <div style={{ display: 'flex' }}>SYDNEY / NEW YORK</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Instrument Serif', data: regular, style: 'normal', weight: 400 },
        { name: 'Instrument Serif', data: italic, style: 'italic', weight: 400 },
      ],
    },
  );
}

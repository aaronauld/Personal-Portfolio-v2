import type { JSX } from 'react';

/**
 * A headline split into per-word spans for the staggered word reveal.
 * `{ em }` segments render italic coral. The trailing space lives inside
 * each span (as a non-breaking space) so wrapping is preserved.
 */
export type WordPart = string | { em: string };

export function Words({
  parts,
  as: Tag = 'h2',
  className,
  id,
}: {
  parts: WordPart[];
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  id?: string;
}) {
  const words: { text: string; em: boolean }[] = [];

  for (const part of parts) {
    const text = typeof part === 'string' ? part : part.em;
    const em = typeof part !== 'string';
    for (const word of text.split(' ').filter(Boolean)) {
      words.push({ text: word, em });
    }
  }

  const Element = Tag as 'h2';

  return (
    <Element className={className} id={id} data-words>
      {words.map((word, i) => (
        <span key={`${word.text}-${i}`} data-word {...(word.em ? { 'data-word-em': '' } : {})}>
          {word.text}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Element>
  );
}

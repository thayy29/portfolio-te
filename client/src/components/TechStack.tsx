import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useScrollVars } from '../hooks/useScrollVars';

const TAGS = [
  'React', 'TypeScript', 'Next.js', 'Node.js', 'JavaScript',
  'CSS3', 'Sass', 'Tailwind', 'GraphQL', 'REST',
  'Git', 'Docker', 'AWS', 'Figma', 'Vite',
];

export default function TechStack() {
  const ref = useScrollReveal();
  useScrollVars(ref);

  return (
    <section
      ref={ref}
      className="rv section container"
      style={{
        paddingBlock: 40,
        display: 'flex', flexWrap: 'wrap', gap: 8,
      }}
    >
      {TAGS.map((t, i) => (
        <span key={t} className="tag tag--float" style={{ '--lane': i % 3 } as React.CSSProperties}>
          {t}
        </span>
      ))}
    </section>
  );
}

import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const TAGS = [
  'React', 'TypeScript', 'Next.js', 'Node.js', 'JavaScript',
  'CSS3', 'Sass', 'Tailwind', 'GraphQL', 'REST',
  'Git', 'Docker', 'AWS', 'Figma', 'Vite',
];

export default function TechStack() {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      className="rv"
      style={{
        position: 'relative', zIndex: 1,
        padding: '40px 16px',
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'center', gap: 8,
        maxWidth: 900, margin: '0 auto',
      }}
    >
      {TAGS.map((t) => (
        <span key={t} className="tag">{t}</span>
      ))}
    </section>
  );
}

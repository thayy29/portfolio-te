import React from 'react';

const KEYWORDS = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'JavaScript', 'CSS3',
  'GraphQL', 'REST API', 'Git', 'Docker', 'AWS', 'Figma',
  'HTML5', 'Sass', 'Tailwind', 'PostgreSQL', 'MongoDB', 'Redis',
  'CI/CD', 'Agile', 'TDD', 'Vite',
];

export default function Ticker() {
  const text = KEYWORDS.join(' · ');
  const doubled = `${text} · ${text} · `;

  return (
    <div
      style={{
        overflow: 'hidden', whiteSpace: 'nowrap',
        borderTop: '1px solid var(--divider)',
        borderBottom: '1px solid var(--divider)',
        padding: '12px 0',
        fontFamily: "'Space Mono', monospace",
        fontSize: 11, letterSpacing: '0.1em',
        color: 'var(--ticker-c)',
        textTransform: 'uppercase',
      }}
    >
      <div style={{ display: 'inline-block', animation: 'ticker 30s linear infinite' }}>
        {doubled}
      </div>
    </div>
  );
}

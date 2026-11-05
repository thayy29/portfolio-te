import React from 'react';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        position: 'relative', zIndex: 1,
        padding: '40px 16px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16,
        borderTop: '1px solid var(--footer-line)',
      }}
    >
      <Logo size={24} />
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10, letterSpacing: '0.12em',
          textTransform: 'uppercase', opacity: 0.3,
        }}
      >
        © {year} Thayana · Built with ♥
      </span>
    </footer>
  );
}

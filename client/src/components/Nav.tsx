import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { useTheme } from '../hooks/useTheme';

interface Props {
  onMenuToggle: (open: boolean) => void;
}

export default function Nav({ onMenuToggle }: Props) {
  const { isDark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '#projects', label: 'Projetos' },
    { href: '#about', label: 'Sobre' },
    { href: '#contact', label: 'Contato' },
  ];

  return (
    <nav
      style={{
        position: 'fixed', top: 28, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', gap: 28,
        padding: '10px 28px',
        background: 'var(--nav)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${scrolled ? 'var(--nav-b)' : 'transparent'}`,
        borderRadius: 50,
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <a href="#" aria-label="Home">
        <Logo size={28} />
      </a>

      {/* Desktop links */}
      <div className="desktop-only" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="nav-link"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* Theme toggle */}
      <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
        <span className="icon-moon" style={{ fontSize: 14 }}>☽</span>
        <span className="icon-sun" style={{ fontSize: 14 }}>☀</span>
      </button>

      {/* LED */}
      <span className="hw-led desktop-only" />

      {/* Hamburger (mobile) */}
      <button
        className="mobile-only"
        onClick={() => onMenuToggle(true)}
        aria-label="Menu"
        style={{
          background: 'none', border: 'none', color: 'var(--text)',
          display: 'flex', flexDirection: 'column', gap: 4,
          cursor: 'pointer', padding: 4,
        }}
      >
        <span style={{ width: 18, height: 1.5, background: 'var(--text)', borderRadius: 1 }} />
        <span style={{ width: 14, height: 1.5, background: 'var(--text)', borderRadius: 1 }} />
        <span style={{ width: 18, height: 1.5, background: 'var(--text)', borderRadius: 1 }} />
      </button>
    </nav>
  );
}

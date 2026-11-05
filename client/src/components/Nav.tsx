import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { useTheme } from '../hooks/useTheme';

const LINKS = [
  { href: '#projects', label: 'Projetos' },
  { href: '#about', label: 'Sobre' },
  { href: '#contact', label: 'Contato' },
  { href: '#music', label: 'Music' },
];

const CLOSE_ON_SCROLL_PX = 40;

export default function Nav() {
  const { toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // While open, the menu closes on scroll, Escape or a click outside
  useEffect(() => {
    if (!open) return;

    const openedAt = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - openedAt) > CLOSE_ON_SCROLL_PX) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <nav ref={navRef} className={`nav ${open ? 'is-open' : ''}`} aria-label="Principal">
      <div className="nav__bar">
        <a href="#hero" aria-label="Voltar ao início" className="nav__logo">
          <Logo size={32} />
        </a>

        <div className="nav__actions">
          <button className="theme-toggle" onClick={toggle} aria-label="Alternar tema claro e escuro">
            <span className="icon-moon" aria-hidden="true">☽</span>
            <span className="icon-sun" aria-hidden="true">☀</span>
          </button>

          <button
            ref={menuButtonRef}
            className="nav__menu-button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="nav-panel"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div id="nav-panel" className="nav__panel">
        <ul className="nav__links">
          {LINKS.map((link, i) => (
            <li key={link.href} style={{ '--i': i } as React.CSSProperties}>
              <a href={link.href} className="nav__link" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

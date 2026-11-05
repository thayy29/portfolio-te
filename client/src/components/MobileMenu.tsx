import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: '#projects', label: 'Projetos' },
  { href: '#about', label: 'Sobre' },
  { href: '#contact', label: 'Contato' },
];

export default function MobileMenu({ open, onClose }: Props) {
  return (
    <div className={`menu-overlay ${open ? 'open' : ''}`}>
      <button
        onClick={onClose}
        aria-label="Fechar menu"
        style={{
          position: 'absolute', top: 24, right: 24,
          background: 'none', border: 'none',
          color: 'var(--text)', fontSize: 28, cursor: 'pointer',
        }}
      >
        ×
      </button>
      {links.map((l) => (
        <a key={l.href} href={l.href} onClick={onClose}>
          {l.label}
        </a>
      ))}
    </div>
  );
}

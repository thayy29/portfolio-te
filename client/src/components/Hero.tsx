import React from 'react';
import { useGitHubProfile } from '../hooks/useGitHub';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useScrollVars } from '../hooks/useScrollVars';
import Globe from './Globe';

/* Each block leaves the screen at its own speed: --depth is its travel in vh */
const depth = (value: number) => ({ '--depth': value } as React.CSSProperties);

export default function Hero() {
  const { profile } = useGitHubProfile();
  const revealRef = useScrollReveal();
  useScrollVars(revealRef);

  return (
    <section id="hero" ref={revealRef} className="rv hero container">
      <div className="hero__content">
        {/* Avatar with XP ring */}
        <div className="hero__avatar-tilt">
          <div className="hero__avatar">
            <svg
              viewBox="0 0 140 140"
              style={{
                position: 'absolute', inset: -5,
                width: 'calc(100% + 10px)', height: 'calc(100% + 10px)',
                animation: 'xp-glow 3s ease-in-out infinite',
              }}
            >
              <circle cx="70" cy="70" r="67" fill="none" stroke="var(--divider)" strokeWidth="3" />
              <circle
                cx="70" cy="70" r="67" fill="none" stroke="var(--accent)"
                strokeWidth="3" strokeDasharray={`${0.75 * 2 * Math.PI * 67} ${2 * Math.PI * 67}`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <img
              src={profile?.avatar_url || 'https://github.com/thayy29.png'}
              alt={profile?.name || 'Thayana'}
              style={{
                width: '100%', height: '100%',
                borderRadius: '50%', objectFit: 'cover',
                border: '3px solid var(--card)',
              }}
            />
            {/* Level badge */}
            <span style={{
              position: 'absolute', bottom: -4, right: -4,
              background: 'var(--accent)', color: '#F2F0EB',
              fontFamily: "'Space Mono', monospace",
              fontSize: 9, fontWeight: 700,
              padding: '2px 8px', borderRadius: 10,
              letterSpacing: '0.05em',
            }}>
              LV.29
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="hero__layer" style={{ ...depth(22), width: '100%' }}>
          <div className="hw-label" style={{ marginBottom: 12 }}>
            <span className="hw-led" /> DEV.FRONTEND
          </div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px',
          }}>
            {profile?.name || 'Thayana'}
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            opacity: 0.7, lineHeight: 1.6, margin: 0, maxWidth: 520,
          }}>
            {profile?.bio || 'Frontend Developer · UI/UX · Creative Technologist'}
          </p>
        </div>

        {/* CTAs */}
        <div className="hero__layer" style={{ ...depth(12), display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="#projects" className="btn-primary">
            ▸ Ver Projetos
          </a>
          <a href="#contact" className="btn-ghost">
            Contato
          </a>
        </div>

        {/* Badges */}
        <div className="hero__layer" style={{ ...depth(6), display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span className="badge badge-live">Disponível</span>
          <span className="badge">
            {profile?.location || 'São Paulo, BR'}
          </span>
        </div>
      </div>

      <div className="hero__globe">
        <Globe />
      </div>
    </section>
  );
}

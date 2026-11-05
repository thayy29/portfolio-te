import React from 'react';
import { useGitHubProfile } from '../hooks/useGitHub';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Globe from './Globe';

export default function Hero() {
  const { profile } = useGitHubProfile();
  const revealRef = useScrollReveal();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 769;

  return (
    <section
      id="hero"
      ref={revealRef}
      className="rv"
      style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '120px 16px 60px' : '140px 60px 80px',
        textAlign: 'center', gap: 32,
      }}
    >
      {/* Globe behind avatar */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.5,
        }}>
          <Globe size={isMobile ? 220 : 320} />
        </div>

        {/* Avatar with XP ring */}
        <div style={{
          position: 'relative', zIndex: 2,
          width: isMobile ? 100 : 130, height: isMobile ? 100 : 130,
          animation: 'avatar-float 4s ease-in-out infinite',
        }}>
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
      <div style={{ maxWidth: 600 }}>
        <div className="hw-label" style={{ justifyContent: 'center', marginBottom: 12 }}>
          <span className="hw-led" /> DEV.FRONTEND
        </div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: isMobile ? 32 : 48,
          fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px',
        }}>
          {profile?.name || 'Thayana'}
        </h1>
        <p style={{
          fontSize: isMobile ? 14 : 16,
          opacity: 0.6, lineHeight: 1.6, margin: 0,
        }}>
          {profile?.bio || 'Frontend Developer · UI/UX · Creative Technologist'}
        </p>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="#projects" className="btn-primary">
          ▸ Ver Projetos
        </a>
        <a href="#contact" className="btn-ghost">
          Contato
        </a>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span className="badge badge-live">Disponível</span>
        <span className="badge">
          {profile?.location || 'São Paulo, BR'}
        </span>
      </div>
    </section>
  );
}

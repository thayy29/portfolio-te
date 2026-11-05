import React from 'react';
import { useGitHubProfile } from '../hooks/useGitHub';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const { profile } = useGitHubProfile();
  const ref = useScrollReveal();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 769;

  /* Calculate real years from GitHub created_at */
  const yearsOnGitHub = profile?.created_at
    ? Math.floor(
        (Date.now() - new Date(profile.created_at).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
      )
    : 8;

  const repoCount = profile?.public_repos ?? 30;
  const followers = profile?.followers ?? 0;

  /* Animated counters */
  const yearsCounter = useAnimatedCounter(yearsOnGitHub, 1500);
  const reposCounter = useAnimatedCounter(repoCount, 1800);
  const followersCounter = useAnimatedCounter(followers, 1200);

  const stats = [
    { label: 'Anos no GitHub', counter: yearsCounter },
    { label: 'Repositórios', counter: reposCounter },
    { label: 'Seguidores', counter: followersCounter },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="rv"
      style={{
        position: 'relative', zIndex: 1,
        padding: isMobile ? '60px 16px' : '80px 60px',
        maxWidth: 1000, margin: '0 auto',
      }}
    >
      <div className="hw-label" style={{ marginBottom: 32 }}>
        <span className="hw-led" /> Sobre // Bio
      </div>

      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: isMobile ? 28 : 36,
        fontWeight: 700, margin: '0 0 24px',
      }}>
        Sobre mim
      </h2>

      <p style={{
        fontSize: isMobile ? 14 : 16,
        lineHeight: 1.8, opacity: 0.7,
        maxWidth: 600, margin: '0 0 48px',
      }}>
        Desenvolvedora frontend apaixonada por criar interfaces que combinam
        design minimalista com engenharia robusta. Experiência com React,
        TypeScript e o ecossistema moderno de desenvolvimento web.
        Produtora musical nas horas vagas.
      </p>

      {/* Stats with animated counters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 20,
      }}>
        {stats.map(({ label, counter }) => (
          <div
            key={label}
            className="hw-panel"
            style={{
              padding: 28, textAlign: 'center',
              position: 'relative',
            }}
          >
            <span className="hw-screw" style={{ top: 8, left: 8 }} />
            <span className="hw-screw" style={{ top: 8, right: 8 }} />
            <span
              ref={counter.ref as React.RefObject<HTMLSpanElement>}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 48, fontWeight: 700,
                color: 'var(--accent)',
                display: 'block',
              }}
            >
              {counter.count}
            </span>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10, letterSpacing: '0.15em',
              textTransform: 'uppercase', opacity: 0.5,
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

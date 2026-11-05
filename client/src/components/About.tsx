import React, { useRef } from 'react';
import { useGitHubProfile } from '../hooks/useGitHub';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useScrollVars } from '../hooks/useScrollVars';

const BIO =
  'Desenvolvedora frontend apaixonada por criar interfaces que combinam ' +
  'design minimalista com engenharia robusta. Experiência com React, ' +
  'TypeScript e o ecossistema moderno de desenvolvimento web. ' +
  'Produtora musical nas horas vagas.';
const BIO_WORDS = BIO.split(' ');

export default function About() {
  const { profile } = useGitHubProfile();
  const ref = useScrollReveal();
  const trackRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  useScrollVars(trackRef);
  useScrollVars(statsRef);

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
    <section id="about" ref={ref} className="rv about">
      {/* The text stays pinned while the words light up with the scroll */}
      <div ref={trackRef} className="about__track">
        <div className="about__sticky container">
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

          <p className="about__bio">
            {BIO_WORDS.map((word, i) => (
              <span
                key={i}
                className="about__word"
                style={{ '--w': i / BIO_WORDS.length } as React.CSSProperties}
              >
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Stats with animated counters */}
      <div ref={statsRef} className="section container" style={{ paddingBlockStart: 0 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 20,
        }}>
          {stats.map(({ label, counter }, i) => (
            <div
              key={label}
              className="hw-panel about__stat"
              style={{
                padding: 28, textAlign: 'center',
                '--lane': i,
              } as React.CSSProperties}
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
      </div>
    </section>
  );
}

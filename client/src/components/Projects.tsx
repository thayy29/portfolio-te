import React from 'react';
import { useGitHubRepos } from '../hooks/useGitHub';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useScrollVars } from '../hooks/useScrollVars';

/* Language → color mapping */
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3572A5',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Java: '#B07219',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Shell: '#89E051',
  Dart: '#00B4AB',
};

export default function Projects() {
  const { repos, loading, failed } = useGitHubRepos();
  const ref = useScrollReveal();
  useScrollVars(ref);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 769;

  return (
    <section
      id="projects"
      ref={ref}
      className="rv section container"
    >
      <div className="hw-label" style={{ marginBottom: 32 }}>
        <span className="hw-led" /> Projetos // GitHub
      </div>

      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: isMobile ? 28 : 36,
        fontWeight: 700, margin: '0 0 40px',
      }}>
        Repositórios
      </h2>

      {loading ? (
        <p style={{ opacity: 0.5, fontFamily: "'Space Mono', monospace", fontSize: 12 }}>
          Carregando repositórios...
        </p>
      ) : failed || repos.length === 0 ? (
        <p style={{ opacity: 0.7, fontSize: 15, lineHeight: 1.6 }}>
          Não foi possível carregar os projetos agora.{' '}
          <a
            href="https://github.com/thayy29"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)' }}
          >
            Ver no GitHub ↗
          </a>
        </p>
      ) : (
        <div className="repo-grid">
          {repos.map((repo, i) => (
            <div key={repo.id} className="repo-cell" style={{ '--lane': i % 3 } as React.CSSProperties}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hw-panel card repo-card"
                style={{
                  display: 'flex', flexDirection: 'column',
                  padding: 24, textDecoration: 'none', color: 'inherit',
                  animationDelay: `${i * 60}ms`,
                }}
              >
                {/* Screws */}
                <span className="hw-screw" style={{ top: 10, left: 10 }} />
                <span className="hw-screw" style={{ top: 10, right: 10 }} />

                {/* Repo name */}
                <h3 style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 14, fontWeight: 700,
                  margin: '0 0 8px', letterSpacing: '0.02em',
                }}>
                  {repo.name}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: 13, opacity: 0.6, lineHeight: 1.5,
                  margin: '0 0 16px', flex: 1,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {repo.description || 'Sem descrição'}
                </p>

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9, letterSpacing: '0.05em',
                          padding: '3px 8px', borderRadius: 3,
                          background: 'var(--badge-bg)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer: language + stars */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11, opacity: 0.5,
                  borderTop: '1px solid var(--divider)',
                  paddingTop: 12,
                }}>
                  {repo.language && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: LANG_COLORS[repo.language] || 'var(--accent)',
                      }} />
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span>★ {repo.stargazers_count}</span>
                  )}
                  {repo.forks_count > 0 && (
                    <span>⑂ {repo.forks_count}</span>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

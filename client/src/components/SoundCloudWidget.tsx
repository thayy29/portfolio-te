import React, { useState } from 'react';
import { useSoundCloud } from '../hooks/useSoundCloud';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* Desktop-only discrete SoundCloud widget */
export default function SoundCloudWidget() {
  const { data, loading } = useSoundCloud();
  const ref = useScrollReveal<HTMLDivElement>();
  const [expanded, setExpanded] = useState(false);

  if (loading || !data) return null;

  return (
    <div
      ref={ref}
      className="rv desktop-only"
      style={{
        position: 'fixed', bottom: 20, right: 20,
        zIndex: 800,
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px',
          background: 'var(--nav)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--nav-b)',
          borderRadius: expanded ? '12px 12px 0 0' : 12,
          fontFamily: "'Space Mono', monospace",
          fontSize: 10, letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text)', cursor: 'pointer',
          transition: 'border-radius 0.3s',
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--accent)',
          animation: 'blink 2s ease-in-out infinite',
        }} />
        {expanded ? '▾ SoundCloud' : '♫ SoundCloud'}
      </button>

      {/* Embed panel */}
      {expanded && (
        <div
          style={{
            width: 320, height: 180,
            background: 'var(--card)',
            border: '1px solid var(--card-b)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{
            __html: data.html
              ? data.html
                  .replace(/height="\d+"/, 'height="166"')
                  .replace(/width="\d+"/, 'width="100%"')
              : `<p style="padding:16px;font-size:12px;opacity:0.5;">
                   <a href="https://soundcloud.com/classocls" target="_blank" rel="noopener">
                     Ouvir no SoundCloud ↗
                   </a>
                 </p>`,
          }}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useScrollVars } from '../hooks/useScrollVars';

export default function Contact() {
  const ref = useScrollReveal();
  useScrollVars(ref);
  const [sent, setSent] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 769;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="rv section"
      style={{
        background: 'var(--contact-bg)',
        color: 'var(--contact-c)',
        transition: 'background 0.5s, color 0.5s',
      }}
    >
      <div className="container contact__inner">
        <div className="hw-label" style={{ marginBottom: 32 }}>
          <span className="hw-led" /> Contato // Mensagem
        </div>

        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: isMobile ? 28 : 36,
          fontWeight: 700, margin: '0 0 12px',
        }}>
          Vamos conversar?
        </h2>
        <p style={{
          fontSize: 14, opacity: 0.6, margin: '0 0 40px',
        }}>
          Tem um projeto ou ideia? Me manda uma mensagem.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700 }}>
          <input
            type="text"
            placeholder="Nome"
            required
            className="input-line"
            style={{ borderColor: 'var(--contact-ib)' }}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="input-line"
            style={{ borderColor: 'var(--contact-ib)' }}
          />
          <textarea
            placeholder="Mensagem"
            required
            rows={4}
            className="input-line"
            style={{
              borderColor: 'var(--contact-ib)',
              resize: 'vertical', fontFamily: "'Space Grotesk', sans-serif",
            }}
          />
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            {sent ? '✓ Enviado!' : '▸ Enviar'}
          </button>
        </form>

        {/* Social links */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 40,
        }}>
          <a
            href="https://github.com/thayy29"
            target="_blank"
            rel="noopener noreferrer"
            className="social-dark"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-dark"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://soundcloud.com/classocls"
            target="_blank"
            rel="noopener noreferrer"
            className="social-dark"
          >
            SoundCloud ↗
          </a>
        </div>
      </div>
    </section>
  );
}

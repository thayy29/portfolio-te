import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useScrollVars } from '../hooks/useScrollVars';

const FIELDS = [
  { name: 'name', label: 'Seu nome', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Seu e-mail', type: 'email', autoComplete: 'email' },
  { name: 'message', label: 'Conte sobre a ideia', type: 'textarea' },
];

const SOCIALS = [
  { href: 'https://github.com/thayy29', label: 'GitHub' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'https://soundcloud.com/classocls', label: 'SoundCloud' },
];

export default function Contact() {
  const ref = useScrollReveal();
  useScrollVars(ref);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" ref={ref} className="rv section">
      <div className="container contact__inner">
        <div className="hw-label" style={{ marginBottom: 32 }}>
          <span className="hw-led" /> Contato // Mensagem
        </div>

        <div className="contact__grid">
          <div className="contact__intro">
            <h2 className="contact__headline">
              <span>Vamos falar</span>
              <span>sobre o seu</span>
              <span className="contact__headline-accent">próximo projeto</span>
            </h2>

            <div className="contact__socials">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-dark"
                >
                  {social.label} ↗
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="hw-panel contact__form">
            <span className="hw-screw" style={{ top: 10, left: 10 }} />
            <span className="hw-screw" style={{ top: 10, right: 10 }} />

            {FIELDS.map((field, i) => (
              <label key={field.name} className="field">
                <span className="field__index" aria-hidden="true">0{i + 1}</span>
                {field.type === 'textarea' ? (
                  <textarea name={field.name} rows={4} required placeholder=" " className="field__input" />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    placeholder=" "
                    className="field__input"
                  />
                )}
                <span className="field__label">{field.label}</span>
              </label>
            ))}

            <button type="submit" className="btn-primary contact__submit" aria-live="polite">
              {sent ? '✓ Enviado!' : '▸ Enviar mensagem'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

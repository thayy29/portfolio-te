import React from 'react';
import { useWeather } from '../hooks/useWeather';

const weatherIcon = (code: number): string => {
  if (code === 0) return '☀';
  if (code <= 3) return '⛅';
  if (code <= 48) return '☁';
  if (code <= 67) return '🌧';
  if (code <= 77) return '❄';
  if (code <= 82) return '🌧';
  if (code <= 99) return '⛈';
  return '☀';
};

export default function StatusBar() {
  const weather = useWeather();

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 24, padding: '6px 16px',
        background: 'var(--status-bg)',
        backdropFilter: 'blur(12px)',
        fontFamily: "'Space Mono', monospace",
        fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--text)', opacity: 0.5,
        borderBottom: '1px solid var(--divider)',
      }}
    >
      <span>
        {weather
          ? `${weatherIcon(weather.weatherCode)} São Paulo ${weather.temperature}°C`
          : '☀ São Paulo 24°C'}
      </span>
      <span className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="hw-led" style={{ width: 4, height: 4 }} /> SYS.OK
      </span>
      <span className="desktop-only">V.2.0</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 4, height: 4, borderRadius: '50%',
          background: '#4ADE80',
        }} />
        ONLINE
      </span>
    </div>
  );
}

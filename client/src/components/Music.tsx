import React, { useState } from 'react';
import { useSpotifyPlaylists } from '../hooks/useSpotifyPlaylists';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useScrollVars } from '../hooks/useScrollVars';

const SOUNDCLOUD_PROFILE = 'https://soundcloud.com/classocls';

/* Official widget pointed at the profile, so new tracks appear without any code change */
const SOUNDCLOUD_PLAYER =
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUNDCLOUD_PROFILE)}` +
  '&color=%23ff6b2c&auto_play=false&visual=false&hide_related=true' +
  '&show_comments=false&show_reposts=false&show_teaser=false';

const IFRAME_ALLOW = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';

/* Fixed heights for the decorative waveform, in percent */
const WAVEFORM = [
  28, 46, 62, 38, 74, 92, 58, 34, 66, 84, 48, 26, 56, 78, 96, 64,
  40, 72, 52, 30, 60, 88, 70, 44, 24, 54, 82, 50, 36, 68, 42, 22,
];

function SpotifyPanel() {
  const { playlists, loading } = useSpotifyPlaylists();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = playlists.find((p) => p.id === selectedId) ?? playlists[0];

  return (
    <article className="hw-panel music__panel">
      <span className="hw-screw" style={{ top: 10, left: 10 }} />
      <span className="hw-screw" style={{ top: 10, right: 10 }} />

      <div>
        <h3 className="music__title">Playlists</h3>
        <p className="music__text">O que eu escuto, do deep house ao jazz japonês. Escolha uma capa.</p>

        {loading && <p className="music__status">Carregando playlists...</p>}
        {!loading && playlists.length === 0 && (
          <p className="music__status">Não foi possível carregar as playlists agora.</p>
        )}

        <div className="music__covers">
          {playlists.map((playlist) => {
            const isSelected = playlist.id === selected?.id;
            return (
              <button
                key={playlist.id}
                type="button"
                className={`music__cover ${isSelected ? 'is-selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedId(playlist.id)}
              >
                <span className="music__cover-art">
                  <img src={playlist.thumbnail_url} alt="" loading="lazy" width={300} height={300} />
                  {isSelected && (
                    <span className="music__eq" aria-hidden="true">
                      <i /><i /><i />
                    </span>
                  )}
                </span>
                <span className="music__cover-title">{playlist.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* A single player that swaps playlists keeps the page far lighter than one iframe per
          cover. Remounting via key stops each swap from adding a browser history entry. */}
      <div className="music__player">
        {selected && (
          <iframe
            key={selected.id}
            title={`Playlist ${selected.title} no Spotify`}
            src={`https://open.spotify.com/embed/playlist/${selected.id}`}
            allow={IFRAME_ALLOW}
            loading="lazy"
          />
        )}
      </div>
    </article>
  );
}

function SoundCloudPanel() {
  return (
    <article className="hw-panel music__panel">
      <span className="hw-screw" style={{ top: 10, left: 10 }} />
      <span className="hw-screw" style={{ top: 10, right: 10 }} />

      <div className="music__intro">
        <div>
          <h3 className="music__title">Produção</h3>
          <p className="music__text">As faixas que eu produzo, das mais recentes às mais antigas.</p>
          <a href={SOUNDCLOUD_PROFILE} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Ouvir no SoundCloud ↗
          </a>
        </div>

        <div className="music__waveform" aria-hidden="true">
          {WAVEFORM.map((height, i) => (
            <span
              key={i}
              style={{ height: `${height}%`, animationDelay: `${(i % 8) * -0.22}s` }}
            />
          ))}
        </div>
      </div>

      <div className="music__player">
        <iframe
          title="Faixas de Thayana no SoundCloud"
          src={SOUNDCLOUD_PLAYER}
          allow={IFRAME_ALLOW}
          loading="lazy"
        />
      </div>
    </article>
  );
}

export default function Music() {
  const ref = useScrollReveal();
  useScrollVars(ref);

  return (
    <section id="music" ref={ref} className="rv section container music">
      <div className="hw-label" style={{ marginBottom: 32 }}>
        <span className="hw-led" /> Music // Som
      </div>

      <h2 className="music__heading">Music</h2>

      <div className="music__panels">
        <SpotifyPanel />
        <SoundCloudPanel />
      </div>
    </section>
  );
}

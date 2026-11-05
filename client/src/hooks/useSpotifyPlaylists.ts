import { useState, useEffect } from 'react';
import type { SpotifyPlaylist } from '../types';

export function useSpotifyPlaylists() {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/spotify/playlists')
      .then((r) => {
        if (!r.ok) throw new Error(`Playlists request failed with ${r.status}`);
        return r.json();
      })
      .then(setPlaylists)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { playlists, loading };
}

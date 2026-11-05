import { Router, Request, Response } from 'express';

export const spotifyRouter = Router();

/* Display order. Override with SPOTIFY_PLAYLIST_IDS to curate without touching code. */
const DEFAULT_PLAYLIST_IDS = [
  '2MSREyme8CeJ0ZhXKVTzWM', // Deep House
  '0Rk1KGZzHiKNAVXnfZjxQf', // DnB
  '4rCLsvfoXnZbBVkDSOugAD', // Dub
  '60IBXFWIrvsFayOfjg9otA', // Jazz Japonês
  '7AbiyXQ6Mm3G9tPaujY26R', // Deep party
  '6vFrR6FCj1MEulTJD8omuD', // abertura deep
  '4HNuKlGKA039VuDAVpicpr', // Deeper grooves
  '3bXx2Jiz39gnYhqFHO1PXq', // Midday groove
  '10IXnDPnj5wiqerCaCxtvB', // Autumn grooves
  '5DZdANbtVVca9wp8YSNVoB', // Active Grooves
  '6xEJlbahsa5p1supXzuMe1', // Thankful Grooves
];

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
let cache: { data: unknown[]; timestamp: number } | null = null;

const playlistIds = () =>
  process.env.SPOTIFY_PLAYLIST_IDS?.split(',').map((id) => id.trim()).filter(Boolean) ??
  DEFAULT_PLAYLIST_IDS;

/* oEmbed needs no credentials and answers 404 for private playlists, so those never show up */
async function fetchPlaylist(id: string) {
  const url = `https://open.spotify.com/playlist/${id}`;
  const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
  if (!response.ok) return null;

  const data: any = await response.json();
  return { id, title: data.title.trim(), thumbnail_url: data.thumbnail_url, url };
}

spotifyRouter.get('/playlists', async (_req: Request, res: Response) => {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return res.json(cache.data);
  }

  const results = await Promise.allSettled(playlistIds().map(fetchPlaylist));
  const playlists = results.flatMap((r) => (r.status === 'fulfilled' && r.value ? [r.value] : []));

  if (playlists.length > 0) {
    cache = { data: playlists, timestamp: Date.now() };
    return res.json(playlists);
  }

  // Spotify unreachable: prefer an expired list over an empty section
  if (cache) return res.json(cache.data);

  console.error('Spotify playlists error: no playlist could be loaded', results);
  res.status(502).json({ error: 'Failed to fetch Spotify playlists' });
});

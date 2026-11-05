import { Router, Request, Response } from 'express';

export const soundcloudRouter = Router();

const SOUNDCLOUD_USERNAME = process.env.SOUNDCLOUD_USERNAME || 'classocls';

let embedCache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

soundcloudRouter.get('/embed', async (_req: Request, res: Response) => {
  try {
    if (embedCache && Date.now() - embedCache.timestamp < CACHE_TTL) {
      return res.json(embedCache.data);
    }

    // Use SoundCloud oEmbed API (public, no auth needed)
    const profileUrl = `https://soundcloud.com/${SOUNDCLOUD_USERNAME}`;
    const oembedUrl = `https://soundcloud.com/oembed?url=${encodeURIComponent(profileUrl)}&format=json&maxheight=166`;

    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error(`SoundCloud oEmbed responded with ${response.status}`);
    }

    const data: any = await response.json();

    const result = {
      username: SOUNDCLOUD_USERNAME,
      profile_url: profileUrl,
      title: data.title,
      author_name: data.author_name,
      author_url: data.author_url,
      html: data.html, // The embed iframe HTML
      thumbnail_url: data.thumbnail_url,
    };

    embedCache = { data: result, timestamp: Date.now() };
    res.json(result);
  } catch (error) {
    console.error('SoundCloud embed error:', error);
    // Return fallback data so the widget still renders
    res.json({
      username: SOUNDCLOUD_USERNAME,
      profile_url: `https://soundcloud.com/${SOUNDCLOUD_USERNAME}`,
      html: null,
      fallback: true,
    });
  }
});

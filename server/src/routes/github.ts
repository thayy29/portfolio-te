import { Router, Request, Response } from 'express';

export const githubRouter = Router();

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'thayy29';
const GITHUB_API = 'https://api.github.com';

const headers: Record<string, string> = {
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'portfolio-te',
};

// Add token if available for higher rate limits
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

// Cache for rate-limit friendliness
let profileCache: { data: unknown; timestamp: number } | null = null;
let reposCache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

githubRouter.get('/profile', async (_req: Request, res: Response) => {
  try {
    if (profileCache && Date.now() - profileCache.timestamp < CACHE_TTL) {
      return res.json(profileCache.data);
    }

    const response = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data: any = await response.json();
    const profile = {
      login: data.login,
      name: data.name,
      avatar_url: data.avatar_url,
      bio: data.bio,
      location: data.location,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      html_url: data.html_url,
      created_at: data.created_at,
    };

    profileCache = { data: profile, timestamp: Date.now() };
    res.json(profile);
  } catch (error) {
    console.error('GitHub profile error:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub profile' });
  }
});

githubRouter.get('/repos', async (_req: Request, res: Response) => {
  try {
    if (reposCache && Date.now() - reposCache.timestamp < CACHE_TTL) {
      return res.json(reposCache.data);
    }

    const response = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = (await response.json()) as any[];
    const repos = data
      .filter((repo: any) => !repo.fork)
      .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 6)
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
        created_at: repo.created_at,
      }));

    reposCache = { data: repos, timestamp: Date.now() };
    res.json(repos);
  } catch (error) {
    console.error('GitHub repos error:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub repos' });
  }
});

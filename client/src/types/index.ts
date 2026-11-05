export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
}

export interface SoundCloudEmbed {
  username: string;
  profile_url: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  html: string | null;
  thumbnail_url?: string;
  fallback?: boolean;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
}

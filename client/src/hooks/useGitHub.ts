import { useState, useEffect } from 'react';
import type { GitHubProfile, GitHubRepo } from '../types';

export function useGitHubProfile() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/github/profile')
      .then((r) => r.json())
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
}

export function useGitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/github/repos')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRepos(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { repos, loading };
}

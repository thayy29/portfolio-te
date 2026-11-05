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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/github/repos')
      .then((r) => {
        if (!r.ok) throw new Error(`Repos request failed with ${r.status}`);
        return r.json();
      })
      .then(setRepos)
      .catch((error) => {
        console.error(error);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return { repos, loading, failed };
}

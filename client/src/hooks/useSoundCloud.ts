import { useState, useEffect } from 'react';
import type { SoundCloudEmbed } from '../types';

export function useSoundCloud() {
  const [data, setData] = useState<SoundCloudEmbed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/soundcloud/embed')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

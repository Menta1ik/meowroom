import { useState, useEffect } from 'react';

export const useJarStatus = (jarId = 'mOhlr2amroz2VqI1VKF1kGw') => {
  const [data, setData] = useState<{ current: number; goal: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/jar-status?id=${jarId}`);
        const json = await res.json();
        
        if (json.amount !== undefined && json.goal !== undefined) {
          setData({
            current: Math.floor(json.amount / 100),
            goal: Math.floor(json.goal / 100)
          });
        }
      } catch (e) {
        console.error('Failed to fetch jar status', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [jarId]);

  return { data, loading };
};

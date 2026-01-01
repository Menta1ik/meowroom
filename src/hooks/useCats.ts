import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Cat } from '../components/cards/CatCard';

export const useCats = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data, error } = await supabase
          .from('cats')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setCats(data || []);
      } catch (err: any) {
        console.error('Error fetching cats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  return { cats, loading, error };
};

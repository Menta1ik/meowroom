import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useJarStatus = () => {
  const [data, setData] = useState<{
    title: string;
    description: string;
    current: number;
    goal: number;
    link: string;
    card: string;
    image: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundraising = async () => {
      try {
        // Get the most recent active fundraising
        const { data: fundraisings, error } = await supabase
          .from('fundraisings')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (fundraisings && fundraisings.length > 0) {
          const item = fundraisings[0];
          setData({
            title: item.title,
            description: item.description,
            current: item.current_amount,
            goal: item.target_amount,
            link: item.jar_link,
            card: item.card_number,
            image: item.image_url
          });
        }
      } catch (e) {
        console.error('Failed to fetch fundraising', e);
      } finally {
        setLoading(false);
      }
    };

    fetchFundraising();
  }, []);

  return { data, loading };
};

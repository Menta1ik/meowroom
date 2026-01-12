import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface JarStatusData {
  id: string;
  title: string;
  description: string;
  current: number;
  goal: number;
  link: string;
  card: string;
  image: string;
}

export const useJarStatus = () => {
  const [items, setItems] = useState<JarStatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundraising = async () => {
      try {
        // Get the most recent active fundraisings (up to 3)
        const { data: fundraisings, error } = await supabase
          .from('fundraisings')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (fundraisings && fundraisings.length > 0) {
          const mappedItems = fundraisings.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            current: item.current_amount,
            goal: item.target_amount,
            link: item.jar_link,
            card: item.card_number,
            image: item.image_url
          }));
          setItems(mappedItems);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error('Failed to fetch fundraising', e);
      } finally {
        setLoading(false);
      }
    };

    fetchFundraising();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('fundraisings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fundraisings',
          filter: 'is_active=eq.true'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          fetchFundraising();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { items, loading };
};

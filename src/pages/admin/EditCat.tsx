import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CatForm } from '../../components/admin/CatForm';
import { Cat } from '../../components/cards/CatCard';

export const EditCat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const { data, error } = await supabase
          .from('cats')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setCat(data);
      } catch (err) {
        console.error('Error fetching cat:', err);
        alert('Failed to load cat details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCat();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!cat) return <div className="p-8 text-center">Cat not found</div>;

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">Edit Cat: {cat.name}</h1>
        <CatForm initialData={cat} isEdit />
      </div>
    </div>
  );
};

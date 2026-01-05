import React from 'react';
import { useCats } from '../../hooks/useCats';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

export const CatsList: React.FC = () => {
  const { cats, loading, error } = useCats();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.common.confirm_delete'))) return;
    
    try {
      const { error } = await supabase.from('cats').delete().eq('id', id);
      if (error) throw error;
      // Refresh list (simple reload for now, ideally update local state)
      window.location.reload();
    } catch (err) {
      console.error('Error deleting cat:', err);
      alert(t('admin.common.delete_error'));
    }
  };

  if (loading) return <div className="p-8 text-center">{t('admin.common.loading')}</div>;
  if (error) return <div className="p-8 text-center text-red-500">{t('admin.common.error')}: {error}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-neutral-800">{t('admin.cats.title')}</h2>
        <Button onClick={() => navigate('/admin/cats/new')} className="flex items-center gap-2">
          <Plus size={18} />
          {t('admin.cats.add_new')}
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">{t('admin.cats.table.image')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">{t('admin.cats.table.name')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">{t('admin.cats.table.age')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">{t('admin.cats.table.gender')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">{t('admin.cats.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {cats.map((cat) => (
              <tr key={cat.id} className="hover:bg-yellow-50 transition-colors">
                <td className="px-6 py-4">
                  <img 
                    src={cat.images?.[0] || 'https://via.placeholder.com/40'} 
                    alt={cat.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-neutral-800">{cat.name}</td>
                <td className="px-6 py-4 text-neutral-600">{cat.age}</td>
                <td className="px-6 py-4 text-neutral-600">
                  {cat.gender === 'boy' || cat.gender === 'Мальчик' ? t('admin.cats.gender.boy') : 
                   cat.gender === 'girl' || cat.gender === 'Девочка' ? t('admin.cats.gender.girl') : cat.gender}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/admin/cats/${cat.id}`)}
                      className="p-2 hover:bg-primary-50 text-primary-600 rounded-full transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {cats.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  No cats found. Add one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

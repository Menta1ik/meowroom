import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Cat } from '../cards/CatCard';
import { X, Upload, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CatFormProps {
  initialData?: Cat;
  isEdit?: boolean;
}

export const CatForm: React.FC<CatFormProps> = ({ initialData, isEdit }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Cat>>({
    name: initialData?.name || '',
    age: initialData?.age || '',
    gender: initialData?.gender || 'Мальчик',
    history: initialData?.history || '',
    tags: initialData?.tags || [],
    images: initialData?.images || [],
  });
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== tagToRemove) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cats')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cats')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, images: [...(prev.images || []), publicUrl] }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images?.filter((_, index) => index !== indexToRemove) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && initialData?.id) {
        const { error } = await supabase
          .from('cats')
          .update(formData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cats')
          .insert([formData]);
        if (error) throw error;
      }
      navigate('/admin');
    } catch (error) {
      console.error('Error saving cat:', error);
      alert(t('admin.cats.form.error_save'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">{t('admin.cats.form.name')}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">{t('admin.cats.form.age')}</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">{t('admin.cats.form.gender')}</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="boy">{t('admin.cats.gender.boy')}</option>
          <option value="girl">{t('admin.cats.gender.girl')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">{t('admin.cats.form.history')}</label>
        <textarea
          name="history"
          value={formData.history}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">{t('admin.cats.form.tags')}</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags?.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-sm flex items-center gap-1">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder={t('admin.cats.form.add_tag_placeholder')}
            className="flex-grow px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <Button type="button" onClick={handleAddTag} variant="outline" size="sm">{t('admin.common.add')}</Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">{t('admin.cats.form.images_hint')}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {formData.images?.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-neutral-200">
              <img src={url} alt={`Cat ${index}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                  {t('admin.cats.form.cover')}
                </div>
              )}
            </div>
          ))}
          <label className="border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors aspect-square">
            <Upload className="text-neutral-400 mb-2" />
            <span className="text-sm text-neutral-500">{uploading ? t('admin.common.uploading') : t('admin.cats.form.upload_image')}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-neutral-100">
        <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
          {t('admin.cats.form.cancel')}
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? t('admin.cats.form.saving') : isEdit ? t('admin.cats.form.update') : t('admin.cats.form.create')}
        </Button>
      </div>
    </form>
  );
};

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Edit2, RefreshCw, Plus, Trash2, ExternalLink, Upload, X, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { compressImage } from '../../utils/imageOptimizer';
import { 
  AdminTable, 
  AdminTableHead, 
  AdminTableHeader, 
  AdminTableBody, 
  AdminTableRow, 
  AdminTableCell 
} from '../../components/ui/AdminTable';

interface Fundraising {
  id: string;
  title: string;
  description: string;
  title_en?: string;
  description_en?: string;
  target_amount: number;
  current_amount: number;
  jar_link: string;
  jar_id: string;
  card_number: string;
  image_url: string;
  is_active: boolean;
}

interface FundraisingMedia {
  id: string;
  fundraising_id: string;
  url: string;
  type: 'image' | 'video';
  created_at: string;
}

const FundraisingList: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<Fundraising[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Fundraising | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<FundraisingMedia[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('fundraisings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching fundraisings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async (fundraisingId: string) => {
    try {
      const { data, error } = await supabase
        .from('fundraising_media')
        .select('*')
        .eq('fundraising_id', fundraisingId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingItem) return;
    
    setUploadingMedia(true);
    try {
      const files = Array.from(e.target.files);
      
      for (const originalFile of files) {
        // Compress if image
        let file = originalFile;
        if (file.type.startsWith('image/')) {
          file = await compressImage(originalFile);
        }
        
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const fileName = `gallery_${editingItem.id === 'new' ? 'temp' : editingItem.id}_${timestamp}_${random}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cats')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('cats')
          .getPublicUrl(filePath);
        
        if (editingItem.id === 'new') {
          // For new items, add to state with temporary ID
          setMediaItems(prev => [{
            id: `temp_${Date.now()}_${Math.random()}`,
            fundraising_id: 'new',
            url: publicUrl,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            created_at: new Date().toISOString()
          }, ...prev]);
        } else {
          // For existing items, save to DB immediately
          const { error: dbError } = await supabase
            .from('fundraising_media')
            .insert([{
              fundraising_id: editingItem.id,
              url: publicUrl,
              type: file.type.startsWith('video/') ? 'video' : 'image'
            }]);

          if (dbError) throw dbError;
        }
      }
      
      if (editingItem.id !== 'new') {
        await fetchMedia(editingItem.id);
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Error uploading media');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm(t('admin.fundraising.delete_confirm'))) return;
    
    if (mediaId.startsWith('temp_')) {
      setMediaItems(prev => prev.filter(m => m.id !== mediaId));
      return;
    }

    try {
      const { error } = await supabase
        .from('fundraising_media')
        .delete()
        .eq('id', mediaId);
      
      if (error) throw error;
      setMediaItems(prev => prev.filter(m => m.id !== mediaId));
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Error deleting media');
    }
  };

  const handleSync = async (item: Fundraising) => {
    if (!item.jar_id && !item.jar_link) {
      alert('No Jar ID or Link provided');
      return;
    }

    const jarId = item.jar_id || item.jar_link.split('/').pop();
    
    try {
      const res = await fetch(`/api/jar-status?id=${jarId}`);
      const data = await res.json();
      
      if (data.amount !== undefined) {
        const newAmount = Math.floor(data.amount / 100);
        
        const updates: any = { current_amount: newAmount };
        if (data.id) {
          updates.jar_id = data.id; // Save internal ID for webhooks
        }

        const { error } = await supabase
          .from('fundraisings')
          .update(updates)
          .eq('id', item.id);

        if (error) throw error;
        
        setItems(items.map(i => i.id === item.id ? { 
          ...i, 
          current_amount: newAmount,
          jar_id: data.id || i.jar_id 
        } : i));
        alert(`${t('admin.fundraising.sync_success')}${newAmount} ₴`);
      } else {
        alert(t('admin.fundraising.sync_error'));
      }
    } catch (error) {
      console.error(error);
      alert(t('admin.fundraising.sync_error'));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingItem) return;
    
    setUploading(true);
    try {
      const originalFile = e.target.files[0];
      const file = await compressImage(originalFile);
      
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const fileName = `fundraising_${timestamp}_${random}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cats') // Using 'cats' bucket for now as it's guaranteed to exist
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cats')
        .getPublicUrl(filePath);
      
      setEditingItem({ ...editingItem, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let jarId = editingItem.jar_id;
    if (!jarId && editingItem.jar_link) {
        // Handle potential trailing slash and full URL
        const parts = editingItem.jar_link.split('/').filter(p => p.length > 0);
        jarId = parts[parts.length - 1] || '';
    }

    const dataToSave = { ...editingItem, jar_id: jarId };

    try {
      if (editingItem.id === 'new') {
        const { id, ...rest } = dataToSave;
        const { data, error } = await supabase
          .from('fundraisings')
          .insert([rest])
          .select()
          .single();

        if (error) throw error;

        // Handle pending media
        const pendingMedia = mediaItems.filter(m => m.id.startsWith('temp_'));
        if (pendingMedia.length > 0 && data) {
          const mediaToInsert = pendingMedia.map(m => ({
            fundraising_id: data.id,
            url: m.url,
            type: m.type
          }));
          const { error: mediaError } = await supabase
            .from('fundraising_media')
            .insert(mediaToInsert);
          
          if (mediaError) console.error('Error saving media:', mediaError);
        }
      } else {
        const { error } = await supabase
          .from('fundraisings')
          .update(dataToSave)
          .eq('id', editingItem.id);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error(error);
      alert('Error saving');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.fundraising.delete_confirm'))) return;
    
    try {
      const { error } = await supabase.from('fundraisings').delete().eq('id', id);
      if (error) throw error;
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      alert('Error deleting');
    }
  };

  const autoTranslate = async (text: string, field: 'title' | 'description') => {
    if (!text) return;
    
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=uk|en`);
      const data = await response.json();
      
      if (data.responseData?.translatedText) {
        setEditingItem(prev => prev ? {
          ...prev,
          [field === 'title' ? 'title_en' : 'description_en']: data.responseData.translatedText
        } : null);
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again or enter manually.');
    }
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-800">{t('admin.fundraising.title')}</h2>
          <Button onClick={() => {
            setEditingItem({
              id: 'new',
              title: '',
              description: '',
              title_en: '',
              description_en: '',
              target_amount: 0,
              current_amount: 0,
              jar_link: '',
              jar_id: '',
              card_number: '',
              image_url: '',
              is_active: true
            });
            setMediaItems([]);
            setIsModalOpen(true);
          }}>
            <Plus size={18} className="mr-2" />
            {t('admin.fundraising.add_new')}
          </Button>
        </div>

        <AdminTable>
          <AdminTableHead>
            <AdminTableHeader>{t('admin.fundraising.table.title')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.fundraising.table.progress')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.fundraising.table.active')}</AdminTableHeader>
            <AdminTableHeader align="right">{t('admin.fundraising.table.actions')}</AdminTableHeader>
          </AdminTableHead>
          <AdminTableBody>
            {items.map((item) => (
              <AdminTableRow key={item.id}>
                <AdminTableCell>
                  <div className="font-bold text-neutral-800">{item.title}</div>
                  <div className="text-sm text-neutral-500 truncate max-w-xs">{item.description}</div>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">
                      {item.current_amount.toLocaleString()} / {item.target_amount.toLocaleString()} ₴
                    </span>
                    <button 
                      onClick={() => handleSync(item)}
                      className="p-1.5 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('admin.fundraising.sync')}
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <div className="w-24 h-1.5 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.min((item.current_amount / item.target_amount) * 100, 100)}%` }}
                    />
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {item.is_active ? t('admin.services.active') : t('admin.services.inactive')}
                  </span>
                </AdminTableCell>
                <AdminTableCell align="right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        setEditingItem(item);
                        fetchMedia(item.id);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingItem.id === 'new' ? t('admin.fundraising.add_new') : t('admin.fundraising.edit')}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <ExternalLink size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.title')}</label>
                <input 
                  type="text" 
                  required
                  value={editingItem.title}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.title')} (EN)</label>
                  <button
                    type="button"
                    onClick={() => autoTranslate(editingItem.title, 'title')}
                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                    disabled={!editingItem.title}
                  >
                    <Languages size={12} />
                    Auto Translate
                  </button>
                </div>
                <input 
                  type="text" 
                  value={editingItem.title_en || ''}
                  onChange={e => setEditingItem({ ...editingItem, title_en: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded-lg"
                  placeholder="English Title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.image_url')}</label>
                <div className="space-y-2">
                  {editingItem.image_url && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-200 group max-h-48">
                      <img 
                        src={editingItem.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, image_url: '' })}
                        className="absolute top-2 right-2 p-1 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input 
                      type="text" 
                      value={editingItem.image_url}
                      onChange={e => setEditingItem({ ...editingItem, image_url: e.target.value })}
                      className="flex-1 p-2 border border-neutral-300 rounded-lg text-sm"
                      placeholder="https://..."
                    />
                    <label className={`flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors whitespace-nowrap ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload size={18} className="text-neutral-500" />
                      <span className="text-sm text-neutral-600">{uploading ? '...' : t('admin.common.upload')}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        disabled={uploading} 
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.description')}</label>
                <textarea 
                  rows={3}
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.description')} (EN)</label>
                  <button
                    type="button"
                    onClick={() => autoTranslate(editingItem.description, 'description')}
                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                    disabled={!editingItem.description}
                  >
                    <Languages size={12} />
                    Auto Translate
                  </button>
                </div>
                <textarea 
                  rows={3}
                  value={editingItem.description_en || ''}
                  onChange={e => setEditingItem({ ...editingItem, description_en: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded-lg"
                  placeholder="English Description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.target')}</label>
                  <input 
                    type="number" 
                    required
                    value={editingItem.target_amount}
                    onChange={e => setEditingItem({ ...editingItem, target_amount: Number(e.target.value) })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.current')}</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      required
                      value={editingItem.current_amount}
                      onChange={e => setEditingItem({ ...editingItem, current_amount: Number(e.target.value) })}
                      className="w-full p-2 border border-neutral-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.jar_link')}</label>
                  <input 
                    type="text" 
                    value={editingItem.jar_link}
                    onChange={e => setEditingItem({ ...editingItem, jar_link: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                    placeholder="https://send.monobank.ua/jar/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.card')}</label>
                  <input 
                    type="text" 
                    value={editingItem.card_number}
                    onChange={e => setEditingItem({ ...editingItem, card_number: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="isActive"
                  checked={editingItem.is_active}
                  onChange={e => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-neutral-700">{t('admin.fundraising.form.is_active')}</label>
              </div>

              {/* Media Gallery Section */}
              <div className="pt-4 border-t border-neutral-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-neutral-800">Gallery (Photos & Videos)</h3>
                    <label className={`flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg cursor-pointer hover:bg-neutral-200 transition-colors ${uploadingMedia ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload size={18} className="text-neutral-600" />
                      <span className="text-sm font-medium text-neutral-700">{uploadingMedia ? 'Uploading...' : 'Add Media'}</span>
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        multiple
                        onChange={handleMediaUpload} 
                        className="hidden" 
                        disabled={uploadingMedia} 
                      />
                    </label>
                  </div>
                  
                  {mediaItems.length === 0 ? (
                    <p className="text-sm text-neutral-500 italic">No media added yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mediaItems.map(media => (
                        <div key={media.id} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group bg-neutral-50">
                          {media.type === 'video' ? (
                            <video src={media.url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={media.url} alt="Gallery item" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(media.id)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          {media.type === 'video' && (
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded uppercase font-bold pointer-events-none">
                              Video
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>{t('admin.fundraising.form.cancel')}</Button>
                <Button type="submit">{t('admin.fundraising.form.save')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FundraisingList;

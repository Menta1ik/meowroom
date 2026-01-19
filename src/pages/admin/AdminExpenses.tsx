import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Edit2, Plus, Trash2, Upload, X, FileText, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { compressImage } from '../../utils/imageOptimizer';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { getDateLocale } from '../../lib/utils';
import { 
  AdminTable, 
  AdminTableHead, 
  AdminTableHeader, 
  AdminTableBody, 
  AdminTableRow, 
  AdminTableCell 
} from '../../components/ui/AdminTable';

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  category: 'monthly' | 'target' | 'operational';
  expense_date: string;
  receipt_urls: string[];
}

export const AdminExpenses: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // View Receipts Modal State
  const [viewingReceipts, setViewingReceipts] = useState<string[] | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Expense) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem({
      id: 'new',
      title: '',
      description: '',
      amount: 0,
      currency: 'UAH',
      category: 'monthly',
      expense_date: new Date().toISOString().split('T')[0],
      receipt_urls: []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.expenses.messages.delete_confirm'))) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const itemToSave = { ...editingItem };
      // Remove id if it's 'new' so Supabase generates one, or keep it for update
      const { id, ...data } = itemToSave;

      if (id === 'new') {
        const { error } = await supabase
          .from('expenses')
          .insert([data]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('expenses')
          .update(data)
          .eq('id', id);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchItems();
    } catch (error: any) {
      console.error('Error saving expense:', error);
      alert(`${t('admin.expenses.messages.save_error')}\n${error.message || JSON.stringify(error)}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingItem) return;
    
    setUploading(true);
    try {
      const newUrls = [...editingItem.receipt_urls];
      
      for (const file of Array.from(e.target.files)) {
        let fileToUpload = file;
        if (file.type.startsWith('image/')) {
          fileToUpload = await compressImage(file);
        }

        const fileExt = fileToUpload.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(filePath, fileToUpload);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('receipts')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      setEditingItem({ ...editingItem, receipt_urls: newUrls });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(t('admin.expenses.messages.upload_error'));
    } finally {
      setUploading(false);
    }
  };

  const removeReceipt = (index: number) => {
    if (!editingItem) return;
    const newUrls = [...editingItem.receipt_urls];
    newUrls.splice(index, 1);
    setEditingItem({ ...editingItem, receipt_urls: newUrls });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-800">{t('admin.expenses.title')}</h2>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus size={18} />
            {t('admin.expenses.add_new')}
          </Button>
        </div>

        <AdminTable>
          <AdminTableHead>
            <AdminTableHeader>{t('admin.expenses.table.date')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.expenses.table.title')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.expenses.table.category')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.expenses.table.amount')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.expenses.table.receipts')}</AdminTableHeader>
            <AdminTableHeader align="right">{t('admin.expenses.table.actions')}</AdminTableHeader>
          </AdminTableHead>
          <AdminTableBody>
            {items.map((item) => (
              <AdminTableRow key={item.id}>
                <AdminTableCell className="font-medium text-neutral-900">
                  {format(new Date(item.expense_date), 'dd MMMM yyyy', { locale: getDateLocale(i18n.language) })}
                </AdminTableCell>
                <AdminTableCell>
                  <div>
                    <div className="font-medium text-neutral-900">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-neutral-500 truncate max-w-xs">{item.description}</div>
                    )}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.category === 'operational' ? 'bg-purple-100 text-purple-700' :
                    item.category === 'monthly' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {t(`admin.expenses.form.categories.${item.category}`)}
                  </span>
                </AdminTableCell>
                <AdminTableCell className="font-mono">
                  {item.amount.toLocaleString()} {item.currency}
                </AdminTableCell>
                <AdminTableCell>
                  {item.receipt_urls && item.receipt_urls.length > 0 ? (
                    <button
                      onClick={() => setViewingReceipts(item.receipt_urls)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                    >
                      <FileText size={16} />
                      {item.receipt_urls.length} {t('admin.expenses.table.files_count')}
                    </button>
                  ) : (
                    <span className="text-sm text-neutral-400">0 {t('admin.expenses.table.files_count')}</span>
                  )}
                </AdminTableCell>
                <AdminTableCell align="right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {items.length === 0 && !loading && (
              <AdminTableRow>
                <AdminTableCell className="text-center py-8 text-neutral-500">
                  {t('admin.expenses.table.empty')}
                </AdminTableCell>
                <AdminTableCell />
                <AdminTableCell />
                <AdminTableCell />
                <AdminTableCell />
                <AdminTableCell />
              </AdminTableRow>
            )}
          </AdminTableBody>
        </AdminTable>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-neutral-800">
                {editingItem.id === 'new' ? t('admin.expenses.form.new_title') : t('admin.expenses.form.edit_title')}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.expenses.form.date')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-neutral-400" size={18} />
                    <input
                      type="date"
                      value={editingItem.expense_date}
                      onChange={(e) => setEditingItem({ ...editingItem, expense_date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.expenses.form.category')}</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                  >
                    <option value="monthly">{t('admin.expenses.form.categories.monthly')}</option>
                    <option value="target">{t('admin.expenses.form.categories.target')}</option>
                    <option value="operational">{t('admin.expenses.form.categories.operational')}</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.expenses.form.title_label')}</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-neutral-400" size={18} />
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder={t('admin.expenses.form.title_placeholder')}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.expenses.form.amount')}</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 text-neutral-400" size={18} />
                    <input
                      type="number"
                      value={editingItem.amount}
                      onChange={(e) => setEditingItem({ ...editingItem, amount: parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.expenses.form.currency')}</label>
                  <input
                    type="text"
                    value={editingItem.currency}
                    onChange={(e) => setEditingItem({ ...editingItem, currency: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.expenses.form.description')}</label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none h-24 resize-none"
                    placeholder={t('admin.expenses.form.description_placeholder')}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-neutral-700">{t('admin.expenses.form.receipts')}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {editingItem.receipt_urls.map((url, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
                        <img src={url} alt="Receipt" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeReceipt(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                      ) : (
                        <>
                          <Upload size={24} className="text-neutral-400 mb-2" />
                          <span className="text-xs text-neutral-500 font-medium">{t('admin.expenses.form.add_files')}</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
                  {t('admin.expenses.form.cancel')}
                </Button>
                <Button type="submit">
                  {editingItem.id === 'new' ? t('admin.expenses.form.create') : t('admin.expenses.form.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Receipts Modal */}
      {viewingReceipts && createPortal(
        <div 
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setViewingReceipts(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-transparent" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setViewingReceipts(null)}
              className="absolute -top-12 right-0 text-white hover:text-neutral-300 transition-colors p-2"
            >
              <span className="sr-only">Close</span>
              <X size={32} />
            </button>
            
            <div className="grid gap-4">
              {viewingReceipts.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={url} 
                    alt={`Receipt ${idx + 1}`} 
                    className="w-full h-auto rounded-lg shadow-2xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Open original"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminExpenses;

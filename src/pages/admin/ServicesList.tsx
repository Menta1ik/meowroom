import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Check, X, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { 
  AdminTable, 
  AdminTableHead, 
  AdminTableHeader, 
  AdminTableBody, 
  AdminTableRow, 
  AdminTableCell 
} from '../../components/ui/AdminTable';

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  description: string;
  requires_prepayment: boolean;
  is_active: boolean;
}

export const ServicesList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { t } = useTranslation();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    duration_minutes: 60,
    price: 0,
    description: '',
    requires_prepayment: true,
    is_active: true
  });

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      alert(t('admin.services.form.save_error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.services.delete_confirm'))) return;
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      duration_minutes: service.duration_minutes,
      price: service.price,
      description: service.description || '',
      requires_prepayment: service.requires_prepayment,
      is_active: service.is_active
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingService(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      duration_minutes: 60,
      price: 0,
      description: '',
      requires_prepayment: true,
      is_active: true
    });
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-800">{t('admin.services.title')}</h2>
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <Plus size={18} />
            {t('admin.services.add_new')}
          </Button>
        </div>

        <AdminTable>
          <AdminTableHead>
            <AdminTableHeader>{t('admin.services.table.name')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.services.table.duration')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.services.table.price')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.services.table.active')}</AdminTableHeader>
            <AdminTableHeader>{t('admin.services.table.actions')}</AdminTableHeader>
            <AdminTableHeader align="right"></AdminTableHeader>
          </AdminTableHead>
          <AdminTableBody>
            {services.map((service) => (
              <AdminTableRow key={service.id}>
                <AdminTableCell>
                  <div className="font-medium text-neutral-800">
                    {service.name}
                    {service.description && <p className="text-xs text-neutral-400 font-normal truncate max-w-xs">{service.description}</p>}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="text-neutral-600 flex items-center gap-1">
                    <Clock size={14} />
                    {service.duration_minutes} {t('booking.duration')}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="font-bold text-primary-600">{service.price} ₴</span>
                </AdminTableCell>
                <AdminTableCell>
                  {service.requires_prepayment ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                      {t('admin.services.form.prepayment')}
                    </span>
                  ) : (
                    <span className="text-neutral-400 text-sm">{t('admin.services.form.optional', 'Optional')}</span>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  {service.is_active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                      {t('admin.services.active', 'Active')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 text-neutral-500 text-xs font-medium">
                      {t('admin.services.inactive', 'Inactive')}
                    </span>
                  )}
                </AdminTableCell>
                <AdminTableCell align="right">
                  <div className="space-x-2">
                    <button 
                      onClick={() => openEditModal(service)}
                      className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {services.length === 0 && (
              <AdminTableRow>
                <AdminTableCell className="text-center text-neutral-500">
                  {t('admin.services.empty')}
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-neutral-800">
                {editingService ? t('admin.services.form.title_edit') : t('admin.services.form.title_new')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">{t('admin.services.form.name')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="e.g. 1 Hour Visit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{t('admin.services.form.duration')}</label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{t('admin.services.form.price')}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">{t('admin.services.form.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none h-24"
                  placeholder="Brief description..."
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requires_prepayment}
                    onChange={(e) => setFormData({...formData, requires_prepayment: e.target.checked})}
                    className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">{t('admin.services.form.prepayment')}</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">{t('admin.services.form.active')}</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => setIsModalOpen(false)}>
                  {t('admin.services.form.cancel')}
                </Button>
                <Button type="submit" className="w-full">
                  {editingService ? t('admin.services.form.save') : t('admin.services.form.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';
import { supabase } from '../../lib/supabase';
import { Cat } from '../cards/CatCard';

interface AdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cat: Cat | null;
}

export const AdoptionModal: React.FC<AdoptionModalProps> = ({ isOpen, onClose, cat }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !cat) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('adoption_requests')
        .insert([{
          cat_id: cat.id,
          cat_name: cat.name,
          applicant_name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          type: 'guardian',
          status: 'new'
        }]);

      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-primary-50">
            <h2 className="text-2xl font-bold text-neutral-800">
              {t('adoption.title', { name: cat.name })}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors text-neutral-500 hover:text-neutral-800"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-2">{t('booking.success_title')}</h3>
                <p className="text-neutral-600 mb-8">{t('adoption.form.success')}</p>
                <Button onClick={onClose} className="w-full">
                  OK
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-6">
                  {t('adoption.info.guardian_desc')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('adoption.form.name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      {t('adoption.form.phone')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      {t('adoption.form.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('adoption.form.message')}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-4 text-lg mt-4"
                >
                  {loading ? t('common.loading') : t('adoption.form.submit')}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

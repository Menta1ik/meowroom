import React, { useEffect, useState } from 'react';
import { X, Heart, Home, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Cat } from '../cards/CatCard';
import { supabase } from '../../lib/supabase';

interface AdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cat: Cat | null;
}

export const AdoptionModal: React.FC<AdoptionModalProps> = ({ isOpen, onClose, cat }) => {
  const { t } = useTranslation();
  // Default to guardian since adopt is hidden for now
  const [type, setType] = useState<'adopt' | 'guardian'>('guardian');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
      // Default to guardian
      setType('guardian');
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .insert([
          {
            cat_id: cat?.id,
            type,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            message: formData.message
          }
        ]);

      if (error) throw error;

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting request:', err);
      // Ideally show error message to user
      alert('Something went wrong. Please try again.');
    }
  };

  if (!cat) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div 
              className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-white shrink-0">
                <h3 className="text-xl font-bold text-primary-700">
                  {t('adoption.title', { name: cat.name })}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-primary-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-y-auto p-6">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                      <Heart size={32} fill="currentColor" />
                    </div>
                    <h4 className="text-2xl font-bold text-neutral-800">{t('adoption.form.success')}</h4>
                    <p className="text-neutral-500 max-w-sm mx-auto">
                      {type === 'adopt' 
                        ? t('adoption.info.adopt_desc') 
                        : t('adoption.info.guardian_desc')}
                    </p>
                    <Button onClick={onClose} className="mt-4">
                      Close
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 1. Header Info (Name, Age, Tags) */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-2xl text-neutral-800">{cat.name}</h4>
                        <p className="text-lg text-neutral-500 font-medium mt-1">{cat.age} • {cat.gender}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.tags.map((tag, i) => (
                          <span key={i} className="text-sm bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-neutral-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 2. Gallery */}
                    <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-sm">
                      <div className="w-full relative flex items-center justify-center h-[300px] sm:h-[450px]">
                        <img 
                          src={cat.images[selectedImageIndex]} 
                          alt={cat.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      {cat.images.length > 1 && (
                        <div className="bg-white p-2 border-t border-neutral-200 overflow-x-auto flex gap-2">
                          {cat.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedImageIndex(idx)}
                              className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                                selectedImageIndex === idx 
                                  ? 'border-primary-500 opacity-100' 
                                  : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt={`${cat.name} ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3. History / Description */}
                    <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                      <h5 className="font-bold text-lg text-neutral-800 mb-2">Історія {cat.name}</h5>
                      <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">{cat.history}</p>
                    </div>

                    {/* 4. Support Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('adoption.type.label')}
                      </label>
                      <div className="grid grid-cols-1 gap-4">
                        {/* 
                        <button
                          type="button"
                          onClick={() => setType('adopt')}
                          className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 ${
                            type === 'adopt'
                              ? 'border-primary-500 bg-primary-50 text-primary-900'
                              : 'border-neutral-200 hover:border-primary-200 text-neutral-600'
                          }`}
                        >
                          <Home className={`shrink-0 ${type === 'adopt' ? 'text-primary-600' : 'text-neutral-400'}`} />
                          <div>
                            <span className="font-bold block text-sm">{t('adoption.type.adopt')}</span>
                            <span className="text-xs opacity-80 mt-1 block leading-tight">
                              {t('adoption.info.adopt_desc')}
                            </span>
                          </div>
                        </button>
                        */}

                        <button
                          type="button"
                          onClick={() => setType('guardian')}
                          className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 w-full ${
                            type === 'guardian'
                              ? 'border-primary-500 bg-primary-50 text-primary-900'
                              : 'border-neutral-200 hover:border-primary-200 text-neutral-600'
                          }`}
                        >
                          <Heart className={`shrink-0 ${type === 'guardian' ? 'text-primary-600' : 'text-neutral-400'}`} />
                          <div>
                            <span className="font-bold block text-sm">{t('adoption.type.guardian')}</span>
                            <span className="text-xs opacity-80 mt-1 block leading-tight">
                              {t('adoption.info.guardian_desc')}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {t('adoption.form.name')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {t('adoption.form.phone')} *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          {t('adoption.form.email')} *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          {t('adoption.form.message')}
                        </label>
                        <textarea
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow resize-none"
                        />
                      </div>

                      <div className="pt-2">
                        <Button type="submit" className="w-full" size="lg">
                          {t('adoption.form.submit')}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

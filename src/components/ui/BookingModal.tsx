import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  // Lock body scroll when modal is open
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
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-white">
                <h3 className="text-xl font-bold text-primary-700">{t('booking.title')}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-primary-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Iframe Content */}
              <div className="flex-grow bg-neutral-50 relative">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                  <div className="animate-pulse">{t('booking.loading')}</div>
                </div>
                <iframe
                  src="https://meowroom.simplybook.it/v2/?widget_type=iframe&theme=default&theme_settings%5Bsb_base_color%5D=2C5F8D&theme_settings%5Bbtn_color_1%5D=FFD700&theme_settings%5Bbody_bg_color%5D=ffffff#book/provider/any/"
                  className="w-full h-full border-0 relative z-10"
                  title="SimplyBook Booking Widget"
                  allow="camera; microphone; autoplay; encrypted-media;"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

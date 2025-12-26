import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { BookingModal } from '../ui/BookingModal';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20cat%20shelter%20anti-cafe%20interior%20with%20comfortable%20seating%20and%20cats%20relaxing%2C%20warm%20lighting%2C%20photorealistic%2C%204k&image_size=landscape_16_9"
          alt="Meowroom interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto font-light text-primary-50">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setIsBookingOpen(true)}
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-4 bg-accent-500 hover:bg-accent-400 text-primary-900"
            >
              {t('hero.cta_visit')}
            </Button>
            <Button
              href="/cats"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-700"
            >
              {t('hero.cta_adopt')}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-current rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

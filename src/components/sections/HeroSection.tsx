import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Cat } from 'lucide-react';

interface HeroSectionProps {
  onBooking?: () => void;
}

const images = [
  "https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", 
  "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onBooking }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [catsCount] = useState<number>(61);

  useEffect(() => {
    // Randomize start image
    setCurrentImageIndex(Math.floor(Math.random() * images.length));
    
    // Optional: Auto-rotate images every 10 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={images[currentImageIndex]}
            alt="Meowroom interior"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-[2px]"></div>
        </motion.div>
      </AnimatePresence>

      {/* Sticker Variant 2: Minimal & Clean */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.5 },
          scale: { duration: 0.5, delay: 0.5 },
          y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
        }}
        className="absolute top-24 right-4 md:top-32 md:right-10 z-20"
      >
        <div className="relative w-28 h-28 md:w-40 md:h-40 bg-white/95 backdrop-blur-sm rounded-full flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.15)] border-4 border-yellow-400 group cursor-default hover:scale-105 transition-transform duration-300">
          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2.5 shadow-md transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
            <Cat size={20} className="text-white md:w-6 md:h-6" />
          </div>
          
          <span className="text-5xl md:text-7xl font-black text-neutral-800 tracking-tighter leading-none mt-2">{catsCount}</span>
          <div className="text-[9px] md:text-xs font-bold text-neutral-500 uppercase text-center leading-tight mb-2">
            <span className="text-yellow-500">{t('hero.sticker.text_1')}</span><br/>
            {t('hero.sticker.text_2')}<br/>
            {t('hero.sticker.text_3')}
          </div>
        </div>
      </motion.div>

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
              onClick={onBooking}
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-4 bg-accent-500 hover:bg-accent-400 text-primary-900"
            >
              {t('hero.cta_visit')}
            </Button>
            <Link to="/cats">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-700"
              >
                {t('hero.cta_cats')}
              </Button>
            </Link>
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

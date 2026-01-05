import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onBooking?: () => void;
}

const images = [
  "https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Wide shot, cozy interior
  "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Cat sleeping on furniture
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"  // Cat looking out window/interior
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onBooking }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

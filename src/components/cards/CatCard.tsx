import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

export interface Cat {
  id: string;
  name: string;
  age: string;
  gender: 'Мальчик' | 'Девочка';
  history: string;
  images: string[];
  tags: string[];
}

interface CatCardProps {
  cat: Cat;
  onAdopt?: (cat: Cat) => void;
}

export const CatCard: React.FC<CatCardProps> = ({ cat, onAdopt }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden group">
        <img
          src={cat.images[0]}
          alt={cat.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm">
          {cat.age}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm line-clamp-2">{cat.history}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-primary-700">{cat.name}</h3>
            <p className="text-sm text-neutral-500">{cat.gender}</p>
          </div>
          <button className="text-neutral-300 hover:text-red-500 transition-colors">
            <Heart size={20} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {cat.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action */}
        <div className="mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onAdopt?.(cat)}
          >
            {t('cats.card.meet')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

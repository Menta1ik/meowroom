import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

import { Link } from 'react-router-dom';

export interface Cat {
  id: string;
  name: string;
  age: string;
  gender: string;
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
      className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300 flex flex-col h-full group"
    >
      <Link to={`/cats/${cat.id}`} className="flex-grow flex flex-col h-full">
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden bg-neutral-100 group-hover:shadow-inner transition-all">
          {/* Blurred Background for fill */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-70 transition-transform duration-700 group-hover:scale-125 saturate-150"
            style={{ backgroundImage: `url(${cat.images[0]})` }}
          />
          
          {/* Light overlay to blend */}
          <div className="absolute inset-0 bg-white/10" />
          
          {/* Main Image */}
          <img
            src={cat.images[0]}
            alt={`${cat.name} - Meowroom Cat Shelter Kharkiv`}
            className="relative w-full h-full object-contain z-10 transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
          />
          
          {/* Glass Badge */}
          <div className="absolute top-4 right-4 z-20 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary-800 shadow-sm border border-white/50 group-hover:bg-white/90 transition-colors">
            {cat.age}
          </div>

          {/* Gender Indicator Line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1.5 z-20 ${
             cat.gender === 'boy' || cat.gender === 'Мальчик' ? 'bg-blue-300/80' : 
             cat.gender === 'girl' || cat.gender === 'Девочка' ? 'bg-pink-300/80' : 'bg-green-300/80'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-neutral-800">{cat.name}</h3>
              <p className="text-sm text-neutral-500 font-medium">
                {cat.gender === 'boy' || cat.gender === 'Мальчик' ? t('admin.cats.gender.boy') : 
                 cat.gender === 'girl' || cat.gender === 'Девочка' ? t('admin.cats.gender.girl') : cat.gender}
              </p>
            </div>
            <div className="flex gap-1 flex-wrap justify-end max-w-[50%]">
              {cat.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <p className="text-neutral-600 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
            {cat.history}
          </p>

          <span 
            className="w-full py-2.5 rounded-xl border border-primary-200 text-primary-700 font-medium hover:bg-primary-50 transition-colors text-sm mt-auto text-center block"
          >
            {t('cats.card.meet')}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
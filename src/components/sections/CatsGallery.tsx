import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CatCard, Cat } from '../cards/CatCard';
import { AdoptionModal } from '../ui/AdoptionModal';
import { useCats } from '../../hooks/useCats';

export const CatsGallery: React.FC = () => {
  const { t } = useTranslation();
  const { cats, loading, error } = useCats();
  const [filter, setFilter] = useState<'all' | 'boy' | 'girl' | 'kitten'>('all');
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdopt = (cat: Cat) => {
    setSelectedCat(cat);
    setIsModalOpen(true);
  };

  const filteredCats = cats.filter((cat) => {
    if (filter === 'all') return true;
    if (filter === 'boy') return cat.gender === 'Мальчик';
    if (filter === 'girl') return cat.gender === 'Девочка';
    if (filter === 'kitten') return cat.age.includes('месяц');
    return true;
  });

  const tabs = [
    { id: 'all', label: t('cats.filters.all') },
    { id: 'boy', label: t('cats.filters.boy') },
    { id: 'girl', label: t('cats.filters.girl') },
    { id: 'kitten', label: t('cats.filters.kitten') },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <AdoptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cat={selectedCat} 
      />
      
      {/* Filters */}
      <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border ${
              filter === tab.id
                ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCats.map((cat) => (
            <CatCard key={cat.id} cat={cat} onAdopt={handleAdopt} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCats.length === 0 && (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100">
          <p className="text-neutral-500 text-lg">{t('cats.empty')}</p>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { CatCard, Cat } from '../cards/CatCard';
import { catsData } from '../../data/cats';

export const CatsGallery: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'boy' | 'girl' | 'kitten'>('all');

  const filteredCats = catsData.filter((cat) => {
    if (filter === 'all') return true;
    if (filter === 'boy') return cat.gender === 'Мальчик';
    if (filter === 'girl') return cat.gender === 'Девочка';
    if (filter === 'kitten') return cat.age.includes('месяц');
    return true;
  });

  const tabs = [
    { id: 'all', label: 'Все котики' },
    { id: 'boy', label: 'Мальчики' },
    { id: 'girl', label: 'Девочки' },
    { id: 'kitten', label: 'Котята' },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === tab.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCats.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>

        {/* Empty State */}
        {filteredCats.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            <p>К сожалению, по вашему запросу котиков не найдено.</p>
          </div>
        )}
      </div>
    </section>
  );
};

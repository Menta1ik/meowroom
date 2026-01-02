import React from 'react';
import { useTranslation } from 'react-i18next';
import { CatsGallery } from '../components/sections/CatsGallery';
import { SEO } from '../components/SEO';

const Cats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 min-h-screen bg-neutral-50 pb-20">
      <SEO 
        title={t('cats.title')} 
        description={t('cats.subtitle')}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Cats for Adoption - Meowroom",
          "description": "Meet our lovely cats waiting for a new home in Kharkiv. Adopt or sponsor a cat today.",
          "url": "https://meowroom.kh.ua/cats"
        }}
      />
      
      {/* Header */}
      <div className="bg-primary-600 text-white py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('cats.title')}</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">{t('cats.subtitle')}</p>
        </div>
      </div>
      <CatsGallery />
    </div>
  );
};

export default Cats;

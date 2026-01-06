import React from 'react';
import { useTranslation } from 'react-i18next';
import { PawPrint } from 'lucide-react';
import { CatsGallery } from '../components/sections/CatsGallery';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const Cats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('cats.title')} | Meowroom</title>
        <meta name="description" content={t('cats.subtitle')} />
      </Helmet>

      <div className="pt-24 pb-20 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          
          {/* Header - Consistent with Visit/About pages */}
          <div className="max-w-4xl mx-auto mb-12 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                <PawPrint size={32} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{t('cats.title')}</h1>
            </div>
            
            <p className="text-xl text-neutral-600 font-light leading-relaxed">
              {t('cats.subtitle')}
            </p>
          </div>

          <CatsGallery />
        </div>
      </div>
    </>
  );
};

export default Cats;

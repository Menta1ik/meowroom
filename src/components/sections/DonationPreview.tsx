import React from 'react';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

export const DonationPreview: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-primary-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          {t('donation_preview.title')}
        </h2>
        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
          {t('donation_preview.text')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            href="/donate" 
            variant="secondary" 
            size="lg"
            className="font-bold"
          >
            {t('donation_preview.cta_support')}
          </Button>
          <Button 
            href="/cats" 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary-700"
          >
            {t('donation_preview.cta_volunteer')}
          </Button>
        </div>
      </div>
    </section>
  );
};

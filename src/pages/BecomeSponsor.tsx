import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Building2, Handshake, HeartHandshake, Phone, Mail } from 'lucide-react';
import { SEO } from '../components/SEO';

const BecomeSponsor: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 min-h-screen bg-neutral-50 pb-20">
      <SEO 
        title={t('become_sponsor.hero.title')} 
        description={t('become_sponsor.hero.text')} 
      />
      {/* Hero */}
      <div className="bg-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('become_sponsor.hero.title')}</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('become_sponsor.hero.text')}
          </p>
          <Button href="#contact" size="lg" className="bg-accent-500 text-primary-900 hover:bg-accent-400">
            {t('become_sponsor.hero.btn')}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <img 
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20cat%20rehabilitation%20center%20architectural%20concept%2C%20eco-friendly%20design%2C%20bright%20and%20welcoming%2C%20photorealistic&image_size=landscape_4_3" 
                alt="Future Center Concept" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-primary-800 mb-6">{t('become_sponsor.vision.title')}</h2>
              <p className="text-lg text-neutral-600 mb-6">
                {t('become_sponsor.vision.text')}
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                    <HeartHandshake size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary-800">{t('become_sponsor.vision.items.integration.title')}</h4>
                    <p className="text-neutral-600 text-sm">{t('become_sponsor.vision.items.integration.desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary-800">{t('become_sponsor.vision.items.clinic.title')}</h4>
                    <p className="text-neutral-600 text-sm">{t('become_sponsor.vision.items.clinic.desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                    <Handshake size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary-800">{t('become_sponsor.vision.items.culture.title')}</h4>
                    <p className="text-neutral-600 text-sm">{t('become_sponsor.vision.items.culture.desc')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Offer */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-800 mb-10">{t('become_sponsor.offer.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-primary-700 mb-4">{t('become_sponsor.offer.items.pr.title')}</h3>
              <p className="text-neutral-600">{t('become_sponsor.offer.items.pr.desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-primary-700 mb-4">{t('become_sponsor.offer.items.csr.title')}</h3>
              <p className="text-neutral-600">{t('become_sponsor.offer.items.csr.desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-primary-700 mb-4">{t('become_sponsor.offer.items.future.title')}</h3>
              <p className="text-neutral-600">{t('become_sponsor.offer.items.future.desc')}</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div id="contact" className="bg-primary-50 rounded-3xl p-8 md:p-12 text-center border border-primary-100">
          <h2 className="text-3xl font-bold text-primary-800 mb-6">{t('become_sponsor.contact.title')}</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            {t('become_sponsor.contact.text')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="mailto:info@meowroom.kh.ua" size="lg" className="flex items-center gap-2">
              <Mail size={20} />
              {t('become_sponsor.contact.email_btn')}
            </Button>
            <Button href="tel:+380661732463" variant="outline" size="lg" className="flex items-center gap-2 bg-white">
              <Phone size={20} />
              {t('become_sponsor.contact.call_btn')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSponsor;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Building2, Handshake, HeartHandshake, Phone, Mail, Megaphone, Target, Briefcase } from 'lucide-react';
import { SEO } from '../components/SEO';

const BecomeSponsor: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 min-h-screen bg-white pb-20">
      <SEO 
        title={t('become_sponsor.hero.title')} 
        description={t('become_sponsor.hero.text')} 
      />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
              <Handshake size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{t('become_sponsor.hero.title')}</h1>
          </div>
          <p className="text-xl text-neutral-600 font-light leading-relaxed max-w-3xl">
            {t('become_sponsor.hero.text')}
          </p>
          <div className="mt-8 flex justify-center md:justify-start">
            <Button href="#contact" size="lg">
              {t('become_sponsor.hero.btn')}
            </Button>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-8 md:p-12 mb-16 shadow-sm">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <img 
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20cat%20rehabilitation%20center%20architectural%20concept%2C%20eco-friendly%20design%2C%20bright%20and%20welcoming%2C%20photorealistic&image_size=landscape_4_3" 
                alt="Future Center Concept" 
                className="rounded-2xl shadow-sm w-full object-cover aspect-video"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">{t('become_sponsor.vision.title')}</h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                {t('become_sponsor.vision.text')}
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-neutral-800 mb-1">{t('become_sponsor.vision.items.integration.title')}</h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">{t('become_sponsor.vision.items.integration.desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-neutral-800 mb-1">{t('become_sponsor.vision.items.clinic.title')}</h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">{t('become_sponsor.vision.items.clinic.desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-neutral-800 mb-1">{t('become_sponsor.vision.items.culture.title')}</h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">{t('become_sponsor.vision.items.culture.desc')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Offer Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-800 mb-8 text-center md:text-left">{t('become_sponsor.offer.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center mb-6">
                <Megaphone size={24} />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-3">{t('become_sponsor.offer.items.pr.title')}</h3>
              <p className="text-neutral-600 leading-relaxed text-sm">{t('become_sponsor.offer.items.pr.desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center mb-6">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-3">{t('become_sponsor.offer.items.csr.title')}</h3>
              <p className="text-neutral-600 leading-relaxed text-sm">{t('become_sponsor.offer.items.csr.desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center mb-6">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-3">{t('become_sponsor.offer.items.future.title')}</h3>
              <p className="text-neutral-600 leading-relaxed text-sm">{t('become_sponsor.offer.items.future.desc')}</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div id="contact" className="bg-primary-50 rounded-3xl p-8 md:p-12 text-center border border-primary-100">
          <div className="inline-flex p-3 bg-white rounded-full text-primary-600 mb-6 shadow-sm">
            <Handshake size={32} />
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">{t('become_sponsor.contact.title')}</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('become_sponsor.contact.text')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="mailto:meowroom.kharkiv@gmail.com" size="lg" className="flex items-center gap-2">
              <Mail size={20} />
              {t('become_sponsor.contact.email_btn')}
            </Button>
            <Button href="tel:+380661732463" variant="outline" size="lg" className="flex items-center gap-2 bg-white hover:bg-neutral-50">
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

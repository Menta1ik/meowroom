import React from 'react';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TikTokIcon } from '../components/ui/TikTokIcon';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const Contacts: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('contacts.title')} | Meowroom</title>
        <meta name="description" content={t('contacts.subtitle')} />
      </Helmet>

      <div className="pt-24 min-h-screen bg-white pb-20">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-12 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                <Phone size={32} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{t('contacts.title')}</h1>
            </div>
            <p className="text-xl text-neutral-600 font-light leading-relaxed max-w-2xl">
              {t('contacts.subtitle')}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Info Column */}
              <div className="space-y-8">
                {/* Contact Details Card */}
                <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                  <div className="space-y-8">
                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-neutral-50 text-primary-600 rounded-2xl shrink-0">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-800 mb-1">{t('contacts.address.label')}</h3>
                        <p className="text-neutral-600 text-lg">{t('contacts.address.value')}</p>
                        <p className="text-sm text-neutral-400 mt-1">{t('contacts.address.note')}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-neutral-50 text-primary-600 rounded-2xl shrink-0">
                        <Phone size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-800 mb-1">{t('contacts.phone')}</h3>
                        <a href="tel:+380661732463" className="text-lg text-neutral-600 hover:text-primary-600 transition-colors font-medium">
                          +38 (066) 173 24 63
                        </a>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-neutral-50 text-primary-600 rounded-2xl shrink-0">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-800 mb-1">{t('contacts.schedule.label')}</h3>
                        <p className="text-neutral-600 text-lg">{t('contacts.schedule.days')}: 12:00 - 17:00</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-neutral-50 text-primary-600 rounded-2xl shrink-0">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-800 mb-1">{t('contacts.email')}</h3>
                        <a href="mailto:meowroom.kharkiv@gmail.com" className="text-lg text-neutral-600 hover:text-primary-600 transition-colors">
                          meowroom.kharkiv@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Socials Card */}
                <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                  <h3 className="text-xl font-bold text-neutral-800 mb-6">{t('contacts.social')}</h3>
                  <div className="flex gap-4">
                    <a 
                      href="https://www.instagram.com/meowroom.kh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-white text-neutral-600 rounded-2xl flex items-center justify-center hover:text-pink-600 hover:shadow-md transition-all border border-neutral-100"
                    >
                      <Instagram size={28} />
                    </a>
                    <a 
                      href="https://www.facebook.com/1alxdmm6yh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-white text-neutral-600 rounded-2xl flex items-center justify-center hover:text-blue-600 hover:shadow-md transition-all border border-neutral-100"
                    >
                      <Facebook size={28} />
                    </a>
                    <a 
                      href="https://www.tiktok.com/@meowroom.kh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-white text-neutral-600 rounded-2xl flex items-center justify-center hover:text-black hover:shadow-md transition-all border border-neutral-100"
                    >
                      <TikTokIcon size={24} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Column */}
              <div className="h-full min-h-[400px] lg:min-h-auto">
                <div className="bg-neutral-100 rounded-3xl overflow-hidden shadow-sm border border-neutral-100 h-full w-full">
                  <iframe 
                    src="https://maps.google.com/maps?q=266G%2BJ4%20Kharkiv%2C%20Kharkiv%20Oblast&t=&z=17&ie=UTF8&iwloc=&output=embed"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, minHeight: '500px' }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Meowroom Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;

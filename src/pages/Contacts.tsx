import React from 'react';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TikTokIcon } from '../components/ui/TikTokIcon';

const Contacts: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 min-h-screen bg-neutral-50 pb-20">
      <div className="bg-primary-600 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contacts.title')}</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">{t('contacts.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-1">{t('contacts.address.label')}</h3>
                  <p className="text-neutral-600">{t('contacts.address.value')}</p>
                  <p className="text-sm text-neutral-400 mt-1">{t('contacts.address.note')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-1">{t('contacts.phone')}</h3>
                  <a href="tel:+380661732463" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    +38 (066) 173 24 63
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-1">{t('contacts.schedule.label')}</h3>
                  <p className="text-neutral-600">{t('contacts.schedule.days')}: 12:00 - 17:00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-1">{t('contacts.email')}</h3>
                  <a href="mailto:info@meowroom.kh.ua" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    info@meowroom.kh.ua
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
              <h3 className="text-xl font-bold text-neutral-800 mb-6">{t('contacts.social')}</h3>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/meowroom.kh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center hover:bg-pink-50 hover:text-pink-600 transition-all"
                >
                  <Instagram size={24} />
                </a>
                <a 
                  href="https://www.facebook.com/1alxdmm6yh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <Facebook size={24} />
                </a>
                <a 
                  href="https://www.tiktok.com/@meowroom.kh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all"
                >
                  <TikTokIcon size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-neutral-200 rounded-3xl overflow-hidden min-h-[400px] shadow-sm border border-neutral-100">
            <iframe 
              src="https://maps.google.com/maps?q=266G%2BJ4%20Kharkiv%2C%20Kharkiv%20Oblast&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '400px' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;

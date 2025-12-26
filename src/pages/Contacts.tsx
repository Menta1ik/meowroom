import React from 'react';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from 'lucide-react';

const Contacts: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-neutral-50 pb-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-primary-700 text-center">Контакты</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-neutral-100">
            <h2 className="text-2xl font-bold text-primary-700 mb-8">Свяжитесь с нами</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-800 mb-1">Адрес</h3>
                  <p className="text-neutral-600">вул. Культури, 23,<br />Харків, 61000</p>
                  <p className="text-sm text-neutral-400 mt-2">Метро "Научная"</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-800 mb-1">Телефон</h3>
                  <a href="tel:+380661732463" className="text-neutral-600 hover:text-primary-600 transition-colors text-lg">
                    +380 66 173 2463
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-800 mb-1">График работы</h3>
                  <p className="text-neutral-600">Ежедневно</p>
                  <p className="text-xl font-bold text-primary-600 mt-1">12:00 - 17:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-800 mb-1">Email</h3>
                  <a href="mailto:info@meowroom.kh.ua" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    info@meowroom.kh.ua
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-800 mb-4">Социальные сети</h3>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-800 rounded-full hover:bg-neutral-50 transition-colors font-medium shadow-sm group"
                >
                  <Instagram className="w-5 h-5 group-hover:text-[#E4405F] transition-colors" />
                  Instagram
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61551609639660" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-800 rounded-full hover:bg-neutral-50 transition-colors font-medium shadow-sm group"
                >
                  <Facebook className="w-5 h-5 group-hover:text-[#1877F2] transition-colors" />
                  Facebook
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-800 rounded-full hover:bg-neutral-50 transition-colors font-medium shadow-sm group"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-5 h-5 group-hover:text-[#000000] transition-colors"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[600px] bg-neutral-200 rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2564.336976646777!2d36.2289!3d50.0051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4127a0f19690623d%3A0x2804365778486518!2z0LLRg9C7LiDQmtGD0LvRjNGC0YPRgNC4LCAyMywg0KXQsNGA0YzQutC-0LIsINCf0L7Qu9GC0LDQstGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMLCA2MTAwMA!5e0!3m2!1suk!2sua!4v1703581234567!5m2!1suk!2sua"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Meowroom Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;

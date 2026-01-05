import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';
import { TikTokIcon } from '../ui/TikTokIcon';
import { useBooking } from '../../context/BookingContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { openBooking } = useBooking();

  return (
    <footer className="bg-white border-t border-neutral-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <Logo className="w-10 h-10 transition-transform group-hover:scale-105" />
              <span className="font-display font-bold text-2xl tracking-tight text-primary-700">
                Meowroom
              </span>
            </Link>
            <p className="text-neutral-500 leading-relaxed">
              {t('footer.about')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-lg text-primary-800 mb-6">{t('footer.nav')}</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-neutral-600 hover:text-primary-600 transition-colors">{t('nav.about')}</Link>
              </li>
              <li>
                <Link to="/cats" className="text-neutral-600 hover:text-primary-600 transition-colors">{t('nav.cats')}</Link>
              </li>
              <li>
                <Link to="/visit" className="text-neutral-600 hover:text-primary-600 transition-colors">{t('nav.visit')}</Link>
              </li>
              <li>
                <Link to="/donate" className="text-neutral-600 hover:text-primary-600 transition-colors">{t('nav.donate')}</Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-bold text-lg text-primary-800 mb-6">{t('footer.contacts')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-neutral-600">
                <MapPin size={20} className="text-primary-500 shrink-0 mt-1" />
                <span>{t('contacts.address.value')}</span>
              </li>
              <li className="flex items-center gap-3 text-neutral-600">
                <Phone size={20} className="text-primary-500 shrink-0" />
                <a href="tel:+380661732463" className="hover:text-primary-600 transition-colors">+38 (066) 173 24 63</a>
              </li>
              <li className="flex items-center gap-3 text-neutral-600">
                <Mail size={20} className="text-primary-500 shrink-0" />
                <a href="mailto:info@meowroom.kh.ua" className="hover:text-primary-600 transition-colors">info@meowroom.kh.ua</a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg text-primary-800 mb-6">{t('footer.social')}</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/meowroom.kharkiv" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61551609639660" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/@bluecrossforcats" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors"
              >
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-500 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-primary-500 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

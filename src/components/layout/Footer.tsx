import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import Logo from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-700 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & About */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <Logo className="w-10 h-10 transition-transform group-hover:scale-105" />
              <span className="font-display font-bold text-2xl tracking-tight">
                Meowroom
              </span>
            </Link>
            <p className="text-primary-50 mb-4 text-sm leading-relaxed">
              Уникальное пространство в Харькове, объединяющее формат "Кото-кафе" и приют для кошек. Найди своего пушистого друга или просто проведи время в уютной компании.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent-400">Навигация</h3>
            <ul className="space-y-2">
              {[
                { name: 'О нас', path: '/about' },
                { name: 'Наши котики', path: '/cats' },
                { name: 'Посетить', path: '/visit' },
                { name: 'Поддержать', path: '/donate' },
                { name: 'Спонсорам', path: '/become-sponsor' },
                { name: 'Контакты', path: '/contacts' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-primary-50 hover:text-accent-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent-400">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 text-accent-400" size={20} />
                <span className="text-primary-50 text-sm">
                  вул. Культури, 23,<br />Харків, 61000
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-accent-400" size={20} />
                <a href="tel:+380661732463" className="text-primary-50 hover:text-accent-400 transition-colors text-sm">
                  +380 66 173 2463
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-2 text-primary-50">Мы в соцсетях:</h4>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-accent-500 hover:text-white text-primary-700 transition-all p-2"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61551609639660" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-accent-500 hover:text-white text-primary-700 transition-all p-2"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-accent-500 hover:text-white text-primary-700 transition-all p-2"
                  aria-label="TikTok"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    width="20" 
                    height="20" 
                    className="lucide lucide-tiktok"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Map Embed (Small Preview) */}
          <div className="h-48 bg-neutral-100 rounded-lg overflow-hidden">
             <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2564.336976646777!2d36.2289!3d50.0051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4127a0f19690623d%3A0x2804365778486518!2z0LLRg9C7LiDQmtGD0LvRjNGC0YPRgNC4LCAyMywg0KXQsNGA0YzQutC-0LIsINCf0L7Qu9GC0LDQstGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMLCA2MTAwMA!5e0!3m2!1suk!2sua!4v1703581234567!5m2!1suk!2sua"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Meowroom Location"
            />
          </div>
        </div>

        <div className="border-t border-primary-600 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-200">
          <p>© 2025 Meowroom & BlueCross for Cats. Все права защищены.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

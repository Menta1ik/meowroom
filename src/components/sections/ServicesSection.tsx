import React from 'react';
import { Button } from '../ui/Button';
import { Coffee, Gamepad2, BookOpen, Clock, Laptop } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-primary-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                alt="Visitors enjoying Meowroom"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-400 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-400 rounded-full opacity-30 blur-3xl"></div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">
              {t('services.title')}
            </h2>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              <Trans 
                i18nKey="services.description" 
                components={[
                  <span className="font-bold text-primary-600" key="0">shelter</span>, 
                  <span className="font-bold text-primary-600" key="1">anticafe</span>
                ]} 
              />
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-500 shadow-sm">
                  <Coffee size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-primary-700">{t('services.features.relax.title')}</h3>
                  <p className="text-sm text-neutral-500">{t('services.features.relax.desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-500 shadow-sm">
                  <Gamepad2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-primary-700">{t('services.features.fun.title')}</h3>
                  <p className="text-sm text-neutral-500">{t('services.features.fun.desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-500 shadow-sm">
                  <Laptop size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-primary-700">{t('services.features.coworking.title')}</h3>
                  <p className="text-sm text-neutral-500">{t('services.features.coworking.desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-500 shadow-sm">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-primary-700">{t('services.features.schedule.title')}</h3>
                  <p className="text-sm text-neutral-500">{t('services.features.schedule.desc')}</p>
                </div>
              </div>
            </div>

            <Button href="/visit" variant="primary">
              {t('services.cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

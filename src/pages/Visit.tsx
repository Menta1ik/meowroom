import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Coffee, ShieldAlert, Check, Info, PawPrint, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useBooking } from '../context/BookingContext';
import { Helmet } from 'react-helmet-async';

const Visit: React.FC = () => {
  const { t } = useTranslation();
  const { openBooking } = useBooking();

  const prices = [
    { label: t('visit.pricing.hour_1'), price: '250 ₴' },
    { label: t('visit.pricing.hour_2'), price: '350 ₴' },
    { label: t('visit.pricing.hour_3'), price: '450 ₴' },
  ];

  return (
    <>
      <Helmet>
        <title>{t('visit.title')} | Meowroom</title>
        <meta name="description" content={t('visit.subtitle')} />
      </Helmet>

      <div className="pt-24 pb-20 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Header - Matching About Page style */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                <Clock size={32} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{t('visit.title')}</h1>
            </div>

            <div className="space-y-6 text-lg text-neutral-700 leading-relaxed font-light mb-12">
              <p className="text-xl text-neutral-600 mb-8">
                {t('visit.subtitle')}
              </p>
              
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex gap-4 items-start">
                <Info className="text-primary-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-neutral-800 mb-2">{t('visit.info.title')}</h3>
                  <p className="text-neutral-600 text-base">{t('visit.info.text')}</p>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-8 text-center">{t('visit.pricing.title')}</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {prices.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all text-center group">
                    <p className="text-neutral-500 font-medium mb-2">{item.label}</p>
                    <p className="text-4xl font-bold text-primary-700 mb-4 group-hover:scale-110 transition-transform">{item.price}</p>
                    <div className="w-12 h-1 bg-primary-100 mx-auto rounded-full group-hover:bg-primary-300 transition-colors"></div>
                  </div>
                ))}
              </div>

              <div className="bg-primary-50 rounded-2xl p-8 text-center mb-8">
                <p className="text-neutral-600 mb-6 max-w-2xl mx-auto italic">
                  {t('visit.pricing.note')}
                </p>
                <Button onClick={openBooking} size="lg" className="px-12">
                  {t('visit.pricing.book_btn')}
                </Button>
                <p className="text-sm text-neutral-400 mt-4">
                  {t('visit.pricing.book_note')}
                </p>
              </div>
            </div>

            {/* Rules Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <ShieldAlert className="text-red-500" size={28} />
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">{t('visit.rules.title')}</h2>
              </div>

              <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
                <p className="text-lg text-neutral-700 mb-8 font-medium text-center border-b border-neutral-100 pb-6">
                  {t('visit.rules.intro')}
                </p>

                <ul className="space-y-4 mb-8">
                  {Object.keys(t('visit.rules.list', { returnObjects: true })).map((key) => (
                    <li key={key} className="flex gap-4 text-neutral-700 items-start">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 text-primary-600 font-bold flex items-center justify-center text-sm">
                        {key}
                      </span>
                      <span className="pt-1">{t(`visit.rules.list.${key}`)}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-neutral-50 rounded-xl p-6 text-center border border-neutral-100">
                  <p className="font-bold text-primary-800 text-lg mb-2">{t('visit.rules.outro')}</p>
                  <p className="text-neutral-500 text-sm">{t('visit.rules.disclaimer')}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Visit;

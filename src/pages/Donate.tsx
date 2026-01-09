import React from 'react';
import { useTranslation } from 'react-i18next';
import { DonationBlock } from '../components/sections/DonationBlock';
import { UrgentFundraising } from '../components/sections/UrgentFundraising';
import { Button } from '../components/ui/Button';
import { Heart, Building, ShoppingBag, Gift, HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { useJarStatus } from '../hooks/useJarStatus';

const Donate: React.FC = () => {
  const { t } = useTranslation();
  const { data: jarData } = useJarStatus();
  
  const currentAmount = jarData?.current || 9450;
  const targetAmount = jarData?.goal || 35000;

  return (
    <>
      <Helmet>
        <title>{t('donate.title')} | Meowroom</title>
        <meta name="description" content={t('donate.subtitle')} />
      </Helmet>

      <div className="pt-24 min-h-screen bg-white pb-20">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-12 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="p-2 bg-red-50 text-red-500 rounded-xl">
                <Heart size={32} fill="currentColor" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{t('donate.title')}</h1>
            </div>
            <p className="text-xl text-neutral-600 font-light leading-relaxed max-w-2xl">
              {t('donate.subtitle')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Urgent Fundraising Section */}
            <UrgentFundraising
              title={t('donate.urgent.title')}
              description={t('donate.urgent.desc')}
              currentAmount={currentAmount}
              targetAmount={targetAmount}
              jarLink="https://send.monobank.ua/jar/89zjWt9p7P"
              cardNumber="4874 1000 2241 5460"
            />

            {/* Sponsor Banner */}
            <div className="bg-neutral-50 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-neutral-100">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-white rounded-lg border border-neutral-100 text-primary-600">
                     <Building size={24} />
                   </div>
                   <h2 className="text-2xl font-bold text-neutral-800">{t('donate.sponsor.title')}</h2>
                </div>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  {t('donate.sponsor.text')}
                </p>
              </div>
              <Link 
                to="/become-sponsor"
                className="whitespace-nowrap bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm"
              >
                {t('donate.sponsor.btn')}
              </Link>
            </div>

            <div className="flex flex-col gap-12">
              {/* Main Donation Block */}
              <div className="w-full">
                <DonationBlock />
              </div>

              {/* Where Money Goes Section */}
              <div className="w-full">
                <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <HandHeart size={18} />
                  </div>
                  {t('donate.expenses.title')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-neutral-100 hover:border-primary-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <span className="font-bold text-lg text-neutral-800">{t('donate.expenses.utilities')}</span>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed">{t('donate.expenses.utilities_desc')}</p>
                  </div>

                  <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-neutral-100 hover:border-primary-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <span className="font-bold text-lg text-neutral-800">{t('donate.expenses.litter')}</span>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed">{t('donate.expenses.litter_desc')}</p>
                  </div>

                  <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-neutral-100 hover:border-primary-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <span className="font-bold text-lg text-neutral-800">{t('donate.expenses.vet')}</span>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed">{t('donate.expenses.vet_desc')}</p>
                  </div>
                </div>
              </div>

              {/* Other Ways Section */}
              <div className="w-full">
                <h2 className="text-2xl font-bold text-neutral-800 mb-6">{t('donate.other.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-sm transition-all">
                    <div className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center mb-4">
                      <ShoppingBag size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-neutral-800 mb-2">{t('donate.other.items.stuff.title')}</h3>
                    <p className="text-neutral-600 text-sm mb-4 leading-relaxed">{t('donate.other.items.stuff.desc')}</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-sm transition-all">
                    <div className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center mb-4">
                      <Heart size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-neutral-800 mb-2">{t('donate.other.items.volunteer.title')}</h3>
                    <p className="text-neutral-600 text-sm mb-4 leading-relaxed">{t('donate.other.items.volunteer.desc')}</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-sm transition-all">
                    <div className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center mb-4">
                      <Gift size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-neutral-800 mb-2">{t('donate.other.items.guardian.title')}</h3>
                    <p className="text-neutral-600 text-sm mb-4 leading-relaxed">{t('donate.other.items.guardian.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donate;

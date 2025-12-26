import React from 'react';
import { useTranslation } from 'react-i18next';
import { DonationBlock } from '../components/sections/DonationBlock';
import { UrgentFundraising } from '../components/sections/UrgentFundraising';
import { Button } from '../components/ui/Button';
import { Package, Camera, Heart, Building, ShoppingBag, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const Donate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('donate.title')}</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            {t('donate.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Urgent Fundraising Section */}
        <UrgentFundraising
          title={t('donate.urgent.title')}
          description={t('donate.urgent.desc')}
          currentAmount={9450}
          targetAmount={35000}
          jarLink="https://send.monobank.ua/jar/89zjWt9p7P"
          cardNumber="4874 1000 2241 5460"
        />

        {/* Sponsor Banner */}
        <div className="bg-gradient-to-r from-accent-500 to-accent-400 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg text-primary-900">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Building size={28} className="text-primary-800" />
               <h2 className="text-2xl font-bold text-primary-800">{t('donate.sponsor.title')}</h2>
            </div>
            <p className="text-primary-800/80 max-w-2xl text-lg">
              {t('donate.sponsor.text')}
            </p>
          </div>
          <Link 
            to="/become-sponsor"
            className="whitespace-nowrap bg-white text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-sm"
          >
            {t('donate.sponsor.btn')}
          </Link>
        </div>
        <div className="flex flex-col gap-8">
          {/* Main Donation Block */}
          <div className="w-full">
            <DonationBlock />
          </div>

          {/* Where Money Goes Section */}
          <div className="w-full bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
            <h2 className="text-2xl font-bold text-primary-700 mb-6">{t('donate.expenses.title')}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="font-bold text-lg text-primary-800">{t('donate.expenses.utilities')}</span>
                </div>
                <p className="text-neutral-700 text-sm">{t('donate.expenses.utilities_desc')}</p>
              </li>
              <li className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="font-bold text-lg text-primary-800">{t('donate.expenses.litter')}</span>
                </div>
                <p className="text-neutral-700 text-sm">{t('donate.expenses.litter_desc')}</p>
              </li>
              <li className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="font-bold text-lg text-primary-800">{t('donate.expenses.vet')}</span>
                </div>
                <p className="text-neutral-700 text-sm">{t('donate.expenses.vet_desc')}</p>
              </li>
            </ul>
          </div>

          {/* Other Ways Section */}
          <div className="w-full">
            <h2 className="text-2xl font-bold text-primary-700 mb-6">{t('donate.other.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('donate.other.items.stuff.title')}</h3>
                <p className="text-neutral-600 text-sm mb-4">{t('donate.other.items.stuff.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <Heart size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('donate.other.items.volunteer.title')}</h3>
                <p className="text-neutral-600 text-sm mb-4">{t('donate.other.items.volunteer.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <Gift size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('donate.other.items.guardian.title')}</h3>
                <p className="text-neutral-600 text-sm mb-4">{t('donate.other.items.guardian.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;

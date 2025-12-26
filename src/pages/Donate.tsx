import React from 'react';
import { DonationBlock } from '../components/sections/DonationBlock';
import { UrgentFundraising } from '../components/sections/UrgentFundraising';
import { Gift, Heart, ShoppingBag, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const Donate: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Поддержать Мяурум</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Ваша помощь спасает жизни и дарит котикам надежду.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Urgent Fundraising Section */}
        <UrgentFundraising
          title="На оплату операции Джордану"
          description="Операция по извлечению пули от пневматики из носовой полости прошла успешно, Джордан уже выздоравливает! Теперь нам нужно закрыть долг перед клиникой за его спасение."
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
               <h2 className="text-2xl font-bold text-primary-800">Станьте нашим партнером</h2>
            </div>
            <p className="text-primary-800/80 max-w-2xl text-lg">
              Мы ищем генерального спонсора для создания полноценного центра реабилитации. Узнайте больше о нашем проекте.
            </p>
          </div>
          <Link 
            to="/become-sponsor"
            className="whitespace-nowrap bg-white text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-sm"
          >
            Узнать подробнее
          </Link>
        </div>
        <div className="flex flex-col gap-8">
          {/* Main Donation Block */}
          <div className="w-full">
            <DonationBlock />
          </div>

          {/* Where Money Goes Section */}
          <div className="w-full bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
            <h2 className="text-2xl font-bold text-primary-700 mb-6">На что идут деньги?</h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="font-bold text-lg text-primary-800">Коммунальные услуги</span>
                </div>
                <p className="text-neutral-700 text-sm">Свет, газ, вода — поддержание тепла и уюта для котиков.</p>
              </li>
              <li className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="font-bold text-lg text-primary-800">Наполнитель</span>
                </div>
                <p className="text-neutral-700 text-sm">Ежемесячно нам нужно более 100 кг наполнителя.</p>
              </li>
              <li className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="font-bold text-lg text-primary-800">Ветеринария</span>
                </div>
                <p className="text-neutral-700 text-sm">Лекарства, вакцины, лечение, операции, анализы.</p>
              </li>
            </ul>
          </div>

          {/* Other Ways Section */}
          <div className="w-full">
            <h2 className="text-2xl font-bold text-primary-700 mb-6">Другие способы помочь</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Принести вещи</h3>
                <p className="text-neutral-600 text-sm mb-4">Нам всегда нужны: влажные салфетки для уборки, мусорные пакеты с ручками (40л), лотки и качественные миски, когтеточки, лежанки, вкусняшки и игрушки. Влажный корм Royal Canin: Recovery, Gastrointestinal, Babycat.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <Heart size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Стать волонтером</h3>
                <p className="text-neutral-600 text-sm mb-4">Приходите помогать с уборкой, чистота приюта - залог здоровья котиков или фотосъемкой для рекламы приюта в социальных сетях и средствах массовой информации с целью продвижения проекта.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <Gift size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Стать опекуном</h3>
                <p className="text-neutral-600 text-sm mb-4">Возьмите котика под свою опеку. Ваша поддержка обеспечит друга всем необходимым: наполнителем, вкусняшками и уходом, а вы сможете навещать подопечного и следить за его успехами.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;

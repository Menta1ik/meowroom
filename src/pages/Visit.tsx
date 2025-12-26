import React, { useState } from 'react';
import { VisitRules } from '../components/sections/VisitRules';
import { Button } from '../components/ui/Button';
import { Info } from 'lucide-react';
import { BookingModal } from '../components/ui/BookingModal';

const Visit: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="pt-20 min-h-screen bg-neutral-50 pb-20">
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      
      {/* Header */}
      <div className="bg-primary-600 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Посетить Мяурум</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Проведите время в самой уютной компании Харькова.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Important Info Alert */}
        <div className="max-w-4xl mx-auto mb-12 bg-primary-50 border border-primary-100 rounded-2xl p-6 flex items-start gap-4">
          <Info className="text-primary-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-primary-800 text-lg mb-2">Важная информация о формате</h3>
            <p className="text-primary-700">
              Мы работаем в формате <strong>антикафе</strong>. Это значит, что у нас нет кухни, поваров и меню с блюдами. 
              Вы платите за время, проведенное в компании котиков. У нас можно читать, играть в настольные игры, работать или просто отдыхать душой.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          {/* Pricing Section */}
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-neutral-100 text-center">
              <h2 className="text-3xl font-bold text-primary-700 mb-8">Стоимость посещения</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-primary-50 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105">
                  <span className="font-medium text-primary-800 text-lg">1 час</span>
                  <span className="text-3xl font-bold text-primary-600">250 грн</span>
                </div>
                <div className="p-6 bg-accent-50 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 border border-accent-100 relative overflow-hidden">
                  <span className="font-medium text-primary-800 text-lg">2 часа</span>
                  <span className="text-3xl font-bold text-primary-600">350 грн</span>
                </div>
                <div className="p-6 bg-neutral-50 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 border border-neutral-100">
                  <span className="font-medium text-neutral-700 text-lg">3 часа</span>
                  <span className="text-3xl font-bold text-neutral-600">400 грн</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-neutral-500 max-w-lg mx-auto mb-2">
                  * Все собранные средства идут на закупку корма, наполнителя, оплату ветеринарных услуг и обеспечение комфортной жизни наших подопечных.
                </p>
                <Button 
                  onClick={() => setIsBookingOpen(true)}
                  size="lg"
                  className="px-10 py-4 text-lg shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30"
                >
                  Записаться онлайн
                </Button>
                <p className="text-sm text-neutral-400">Это быстро и удобно. Просим записываться минимум за день до планируемого посещения</p>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <VisitRules />
        </div>
      </div>
    </div>
  );
};

export default Visit;

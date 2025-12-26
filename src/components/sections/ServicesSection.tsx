import React from 'react';
import { Button } from '../ui/Button';
import { Coffee, Gamepad2, BookOpen, Clock, Laptop } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  return (
    <section className="py-20 bg-primary-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=People%20playing%20board%20games%20in%20a%20cozy%20cafe%20with%20cats%20around%2C%20happy%20atmosphere%2C%20soft%20lighting&image_size=landscape_4_3"
                alt="Visitors enjoying Meowroom"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-400 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-400 rounded-full opacity-30 blur-3xl"></div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">
              Как это работает?
            </h2>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              В первую очередь, мы <span className="font-bold text-primary-600">приют</span>, а уж только во вторую, мы <span className="font-bold text-primary-600">антикафе</span>. 
              Спокойствие котиков для нас важнее всего. Ваша оплата идет на поддержку котиков в приюте.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-500 shadow-sm">
                  <Coffee size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary-700">Вкусный отдых</h4>
                  <p className="text-sm text-neutral-500">Чай, кофе и сладости включены</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-500 shadow-sm">
                  <Gamepad2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary-700">Развлечения</h4>
                  <p className="text-sm text-neutral-500">Настольные игры</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-500 shadow-sm">
                  <Laptop size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary-700">Коворкинг</h4>
                  <p className="text-sm text-neutral-500">Поработать на компьютере</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-500 shadow-sm">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary-700">График работы</h4>
                  <p className="text-sm text-neutral-500">Ежедневно с 12:00 до 17:00</p>
                </div>
              </div>
            </div>

            <Button href="/visit" variant="primary">
              Узнать правила и цены
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

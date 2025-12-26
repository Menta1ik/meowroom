import React from 'react';
import { PawPrint } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <PawPrint className="text-primary-600" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">О нас</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
             <div className="space-y-3">
               <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] group">
                 <img 
                   src="/vitaly-fatsky.jpg" 
                   alt="Виталий Фатский" 
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                 />
               </div>
               <p className="text-center font-bold text-lg text-primary-700">Виталий Фатский</p>
             </div>
             <div className="space-y-3">
               <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] group">
                 <img 
                   src="/veronika-fatsky.jpg" 
                   alt="Вероника Фатская" 
                   className="w-full h-full object-cover object-[5%_center] hover:scale-105 transition-transform duration-500"
                 />
               </div>
               <p className="text-center font-bold text-lg text-primary-700">Вероника Фатская</p>
             </div>
          </div>

          <div className="space-y-6 text-lg text-neutral-700 leading-relaxed font-light">
            <p>
              🐾 Привет, друзья! Мы - обычная семья из Харькова, и у нас есть страсть к кошкам. Но с началом войны наш мир изменился. Мы не могли остаться равнодушными к бедствиям, которые они переживают.
            </p>
            <p>
              Сегодня на улицах нашего города сотни бездомных животных, которые ищут любовь и уход. Мы не могли остаться равнодушными и начали действовать. Мы кормим уличных кошек, спасаем их из страшных ситуаций, оказываем им медицинскую помощь и даем им ДОМ.
            </p>
            <p>
              Мы основали благотворительный фонд "BlueCross for Cats" и открыли дом для котиков - Мяурум, где они находят приют, тепло и любящую семью. Под нашей заботой больше 60 хвостиков! Это настоящий дом, где им хорошо. Их любят и ухаживают за ними, у них есть вода и вкусная, полезная еда, игрушки развлечения.
            </p>
            <p>
              Очень надеемся и рассчитываем на помощь всех неравнодушных людей! Только вместе мы сможем помочь четвероногим нашим друзьям. А свою благодарность они продемонстрируют мурчанием. Нам очень нужна ваша помощь и поддержка.
            </p>
            
            <div className="pt-6 border-t border-neutral-100 mt-8">
              <p className="text-xl font-display font-bold text-primary-800 italic">
                "Мы в ответе за тех, кого приручили"
              </p>
            </div>
            
            <div className="mt-24">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-8 text-center">Мы в медиа</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/8KjpmerOZbo?si=1yLYJRZVHKSKVv8D" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/2H_kLnerNQo?si=7dRa9LJA-D3r2Pj8&start=974" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

import React from 'react';
import { PawPrint } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <SEO 
        title={t('about.title')} 
        description={t('about.story_1')} 
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <PawPrint className="text-primary-600" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{t('about.title')}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
             <div className="space-y-3">
               <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] group">
                 <img 
                   src="/vitaly-fatsky.jpg" 
                   alt={t('about.vitaly')} 
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                 />
               </div>
               <p className="text-center font-bold text-lg text-primary-700">{t('about.vitaly')}</p>
             </div>
             <div className="space-y-3">
               <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] group">
                 <img 
                   src="/veronika-fatsky.jpg" 
                   alt={t('about.veronika')} 
                   className="w-full h-full object-cover object-[5%_center] hover:scale-105 transition-transform duration-500"
                 />
               </div>
               <p className="text-center font-bold text-lg text-primary-700">{t('about.veronika')}</p>
             </div>
          </div>

          <div className="space-y-6 text-lg text-neutral-700 leading-relaxed font-light">
            <p>
              🐾 {t('about.story_1')}
            </p>
            <p>
              {t('about.story_2')}
            </p>
            <p>
              {t('about.story_3')}
            </p>
            <p>
              {t('about.story_4')}
            </p>
            
            <div className="pt-6 border-t border-neutral-100 mt-8">
              <p className="text-xl font-display font-bold text-primary-800 italic">
                {t('about.quote')}
              </p>
            </div>
            
            {/* Partners Section */}
            <div className="mt-16 bg-neutral-50 rounded-3xl p-8 border border-neutral-100">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-8 text-center">{t('about.partners_title')}</h2>
              <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
                <div className="flex items-center justify-center w-full md:w-auto md:min-w-[200px] h-[120px]">
                  <img 
                    src="/josera-logo.png" 
                    alt="Josera Logo" 
                    className="w-full h-full object-contain max-w-[180px]"
                  />
                </div>
                <div className="max-w-xl text-center md:text-left">
                  <h3 className="text-xl font-bold text-neutral-800 mb-2">{t('about.josera')}</h3>
                  <p className="text-neutral-600 mb-6">
                    {t('about.josera_desc')}
                  </p>
                  
                  {/* Josera Products */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 h-32 md:h-36">
                    {['dailycat', 'marinesse', 'naturecat', 'naturelle'].map((product) => (
                      <div key={product} className="h-full w-auto aspect-[0.7] relative transition-transform hover:scale-110 duration-300">
                        <img 
                          src={`/josera-${product}.webp`} 
                          alt={`Josera ${product}`} 
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-24">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-8 text-center">{t('about.media_title')}</h2>
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
                    loading="lazy"
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
                    loading="lazy"
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

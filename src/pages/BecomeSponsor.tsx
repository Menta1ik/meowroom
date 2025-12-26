import React from 'react';
import { Building, ArrowRight, Heart, Handshake, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

const BecomeSponsor: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="bg-primary-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-800/50 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Станьте партнером будущего</h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
              Мы ищем генерального спонсора для создания полноценного центра реабилитации и адопции животных европейского уровня в Харькове.
            </p>
            <Button href="#contact" size="lg" className="bg-accent-500 hover:bg-accent-400 text-primary-900">
              Связаться с нами
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img 
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20architectural%20design%20of%20a%20cat%20shelter%20and%20community%20center%2C%20eco-friendly%2C%20bright%2C%20welcoming%2C%203d%20render&image_size=landscape_4_3" 
                alt="Проект будущего центра" 
                className="rounded-3xl shadow-xl w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-primary-700 mb-6">Наша мечта и цель</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                "Мяурум" стремится стать не просто приютом, а масштабным социальным проектом. Мы хотим создать пространство, где забота о животных переплетается с поддержкой людей и просвещением общества.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center shrink-0">
                    <Handshake size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-800">Социальная интеграция</h4>
                    <p className="text-sm text-neutral-600">Создание рабочих мест для людей с инвалидностью, обеспечивая им достойную работу и социализацию в рамках нашего проекта.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center shrink-0">
                    <Building size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-800">Собственная ветклиника</h4>
                    <p className="text-sm text-neutral-600">Современный ветеринарный кабинет с полным спектром оборудования для своевременного и качественного лечения наших подопечных.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center shrink-0">
                    <Heart size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-800">Культура и образование</h4>
                    <p className="text-sm text-neutral-600">Просветительская работа: мы несем в массы культуру гуманного и ответственного обращения с домашними животными.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-700 mb-12">Что мы предлагаем спонсору</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">Имидж и PR</h3>
              <p className="text-neutral-600">
                Упоминание во всех СМИ, логотип на фасаде здания и на всех ресурсах проекта. Статус генерального партнера социально значимого проекта.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">CSR Программы</h3>
              <p className="text-neutral-600">
                Реализация стратегии корпоративной социальной ответственности вашей компании. Волонтерские дни для сотрудников.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">Вклад в будущее</h3>
              <p className="text-neutral-600">
                Возможность оставить след в истории города, создав уникальный объект, который будет служить людям и животным долгие годы.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
             <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Готовы обсудить сотрудничество?</h2>
              <p className="text-lg text-primary-100 mb-8">
                Мы открыты к диалогу и готовы представить детальный бизнес-план и концепцию развития. Свяжитесь с нами напрямую.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <a 
                  href="mailto:contact@meowroom.kh.ua" 
                  className="flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold hover:bg-primary-50 transition-colors"
                >
                  <Mail size={20} />
                  Написать нам
                </a>
                 <a 
                  href="tel:+380661732463" 
                  className="flex items-center justify-center gap-2 bg-accent-500 text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-accent-400 transition-colors"
                >
                  Позвонить
                </a>
              </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeSponsor;

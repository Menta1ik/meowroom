import React from 'react';
import { ShieldCheck, Heart, Home, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <Home size={32} />,
      title: 'Уютный дом',
      description: 'Безопасное пространство, где котики живут в любви и заботе, окруженные вниманием наших гостей.',
    },
    {
      icon: <ShieldCheck size={32} />,
      title: 'Здоровье и безопасность',
      description: 'Все наши подопечные здоровы, привиты, стерилизованы и имеют ветеринарные паспорта.',
    },
    {
      icon: <Heart size={32} />,
      title: 'Благотворительность',
      description: 'Мы работаем совместно с фондом "BlueCross for Cats". Все средства идут на помощь животным.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">Что такое Мяурум?</h2>
          <p className="text-lg text-neutral-600 leading-relaxed mb-4">
            "Мяурум" — это уникальное пространство в Харькове, объединяющее формат <strong>антикафе</strong> и приюта. 
            Это не обычное кафе: у нас нет кухни и меню. Вы платите только за время пребывания, наслаждаясь обществом котиков.
          </p>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Мяурум стал настоящим домом для спасенных котиков. Здесь они живут в безопасности и любви. Вы можете приходить к нам, чтобы пообщаться с пушистыми друзьями, а при желании — взять кого-то из них под свою опеку.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-neutral-50 hover:bg-primary-50 transition-colors text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center text-primary-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-primary-700 mb-4">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

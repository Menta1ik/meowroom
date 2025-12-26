import React from 'react';
import { Clock, Ban, Hand, Footprints } from 'lucide-react';

export const VisitRules: React.FC = () => {
  const rules = [
    {
      icon: <Hand size={24} />,
      title: 'Чистота — залог здоровья',
      description: 'Пожалуйста, дезинфицируйте руки при входе и перед общением с котиками. Мы предоставляем антисептик.',
    },
    {
      icon: <Footprints size={24} />,
      title: 'Сменная обувь',
      description: 'У нас принято переобуваться в тапочки или бахилы, чтобы поддерживать чистоту пола, где играют коты.',
    },
    {
      icon: <Clock size={24} />,
      title: 'Не будите спящих',
      description: 'Котики спят много и сладко. Пожалуйста, не тревожьте их сон, лучше погладьте тех, кто бодрствует.',
    },
    {
      icon: <Ban size={24} />,
      title: 'Без своей еды',
      description: 'У наших подопечных строгая диета. Пожалуйста, не кормите их принесенной едой.',
    },
  ];

  return (
    <section className="py-12 bg-white rounded-3xl shadow-sm border border-neutral-100">
      <div className="px-6 md:px-10">
        <h2 className="text-2xl font-bold text-primary-700 mb-8 text-center">Правила посещения</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rules.map((rule, index) => (
            <div key={index} className="flex gap-4">
              <div className="shrink-0 w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center">
                {rule.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-800 mb-2">{rule.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

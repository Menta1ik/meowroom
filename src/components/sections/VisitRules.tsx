import React from 'react';
import { Footprints, Hand, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const VisitRules: React.FC = () => {
  const { t } = useTranslation();

  const rules = [
    {
      icon: <Sparkles size={32} />,
      title: t('visit.rules.items.clean.title'),
      description: t('visit.rules.items.clean.desc'),
    },
    {
      icon: <Footprints size={32} />,
      title: t('visit.rules.items.shoes.title'),
      description: t('visit.rules.items.shoes.desc'),
    },
    {
      icon: <Hand size={32} />,
      title: t('visit.rules.items.sleep.title'),
      description: t('visit.rules.items.sleep.desc'),
    },
    {
      icon: <UtensilsCrossed size={32} />,
      title: t('visit.rules.items.food.title'),
      description: t('visit.rules.items.food.desc'),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-neutral-800 mb-10 text-center">{t('visit.rules.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shrink-0">
              {rule.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-800 mb-2">{rule.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

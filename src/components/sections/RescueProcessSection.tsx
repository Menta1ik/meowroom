import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Ambulance, Stethoscope, ClipboardCheck, Syringe, Utensils } from 'lucide-react';

export const RescueProcessSection: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Ambulance size={32} />,
      title: t('rescue_process.steps.1.title'),
      desc: t('rescue_process.steps.1.desc')
    },
    {
      icon: <Stethoscope size={32} />,
      title: t('rescue_process.steps.2.title'),
      desc: t('rescue_process.steps.2.desc')
    },
    {
      icon: <ClipboardCheck size={32} />,
      title: t('rescue_process.steps.3.title'),
      desc: t('rescue_process.steps.3.desc')
    },
    {
      icon: <Syringe size={32} />,
      title: t('rescue_process.steps.4.title'),
      desc: t('rescue_process.steps.4.desc')
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            {t('rescue_process.title')}
          </h2>
          <p className="text-lg text-neutral-600">
            {t('rescue_process.subtitle')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-neutral-200 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 border-4 border-white">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-3">{step.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Info Block */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-neutral-50 rounded-3xl p-8 md:p-12 text-center h-full">
            <h3 className="text-2xl font-bold text-primary-700 mb-6">
              {t('rescue_process.info_title')}
            </h3>
            <p className="text-lg text-neutral-700 leading-relaxed">
              {t('rescue_process.info_text')}
            </p>
          </div>

          <div className="bg-primary-50 rounded-3xl p-8 md:p-12 text-center h-full relative overflow-hidden">
            <div className="absolute top-4 right-4 text-primary-200 opacity-50">
              <Utensils size={64} />
            </div>
            <h3 className="text-2xl font-bold text-primary-700 mb-6">
              {t('rescue_process.nutrition_title')}
            </h3>
            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
              {t('rescue_process.nutrition_text')}
            </p>
            <img 
              src="/josera-logo.png" 
              alt="Josera" 
              className="h-12 mx-auto object-contain opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const VisitRules: React.FC = () => {
  const { t } = useTranslation();

  // Create an array of keys for the list items (1 to 13)
  const ruleKeys = Array.from({ length: 13 }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-neutral-800 mb-8 text-center">{t('visit.rules.title')}</h2>
      
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 md:p-10">
        {/* Intro */}
        <div className="mb-8 p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-start gap-3">
            <AlertCircle className="text-primary-600 shrink-0 mt-1" size={24} />
            <p className="text-lg font-medium text-primary-800 leading-relaxed">
              {t('visit.rules.intro')}
            </p>
        </div>

        {/* Rules List */}
        <div className="space-y-4 mb-10">
          {ruleKeys.map((key) => (
            <div key={key} className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={20} />
              <p className="text-neutral-700 leading-relaxed text-lg">
                {t(`visit.rules.list.${key}`)}
              </p>
            </div>
          ))}
        </div>

        {/* Outro */}
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-neutral-800">
                {t('visit.rules.outro')}
            </h3>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-neutral-400 italic">
            {t('visit.rules.disclaimer')}
        </p>
      </div>
    </div>
  );
};

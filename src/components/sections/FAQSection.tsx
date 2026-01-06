import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between gap-4 text-left focus:outline-none group"
      >
        <span className="font-bold text-lg text-neutral-800 group-hover:text-primary-600 transition-colors">
          {question}
        </span>
        <span className={`text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-neutral-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection: React.FC = () => {
  const { t } = useTranslation();

  const questions = [
    { q: t('faq.items.booking.q'), a: t('faq.items.booking.a') },
    { q: t('faq.items.price.q'), a: t('faq.items.price.a') },
    { q: t('faq.items.animals.q'), a: t('faq.items.animals.a') },
    { q: t('faq.items.adopt.q'), a: t('faq.items.adopt.a') },
  ];

  // Schema.org FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">{t('faq.title')}</h2>
        </div>
        
        <div className="bg-neutral-50 rounded-3xl p-6 md:p-10 shadow-sm border border-neutral-100">
          {questions.map((item, index) => (
            <FAQItem key={index} question={item.q} answer={item.a} />
          ))}
        </div>

        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </div>
    </section>
  );
};

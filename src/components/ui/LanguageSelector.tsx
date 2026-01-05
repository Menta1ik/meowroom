import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  isTransparent?: boolean;
}

const CIS_LANGUAGES = ['uk', 'ru', 'be', 'kk', 'az', 'hy', 'ka', 'ky', 'tg', 'uz', 'ro', 'md'];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isTransparent = false }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isUk = CIS_LANGUAGES.includes(i18n.language);

  return (
    <div className="relative group">
      <button 
        className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors font-bold text-sm ${
          isTransparent 
            ? 'text-white hover:bg-white/10' 
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
      >
        {isUk ? 'UA' : 'EN'}
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-neutral-100 p-1 w-auto min-w-[60px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col gap-1">
        <button
          onClick={() => changeLanguage('uk')}
          className={`flex items-center justify-center px-3 py-2 rounded-md hover:bg-neutral-50 transition-colors font-medium text-sm ${
            isUk ? 'bg-primary-50 text-primary-600 ring-1 ring-primary-100' : 'text-neutral-600'
          }`}
        >
          UA
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`flex items-center justify-center px-3 py-2 rounded-md hover:bg-neutral-50 transition-colors font-medium text-sm ${
            !isUk ? 'bg-primary-50 text-primary-600 ring-1 ring-primary-100' : 'text-neutral-600'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;

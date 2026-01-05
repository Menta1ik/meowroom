import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';
import { CIS_LANGUAGES } from '../../lib/utils';

interface LanguageSelectorProps {
  isTransparent?: boolean;
  variant?: 'dropdown' | 'toggle';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  isTransparent = false, 
  variant = 'dropdown' 
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLang = i18n.language || 'en';
  const isUk = CIS_LANGUAGES.some(lang => currentLang.startsWith(lang));
  const displayLang = isUk ? 'UA' : 'EN';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // TOGGLE VARIANT (For Admin Panel)
  if (variant === 'toggle') {
    return (
      <div className={`inline-flex items-center p-1 rounded-xl transition-colors ${
        isTransparent 
          ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
          : 'bg-neutral-100 border border-neutral-200'
      }`}>
        <button
          onClick={() => changeLanguage('uk')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            isUk
              ? 'bg-white text-primary-600 shadow-sm'
              : isTransparent ? 'text-white/70 hover:text-white' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          UA
        </button>
        <div className={`w-px h-3 mx-1 ${isTransparent ? 'bg-white/20' : 'bg-neutral-300'}`}></div>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            !isUk
              ? 'bg-white text-primary-600 shadow-sm'
              : isTransparent ? 'text-white/70 hover:text-white' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          EN
        </button>
      </div>
    );
  }

  // DROPDOWN VARIANT (Original / Main Page)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 font-medium text-sm ${
          isTransparent
            ? 'text-white hover:bg-white/10'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
      >
        <Globe size={16} />
        <span>{displayLang}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-16 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => changeLanguage('uk')}
            className={`w-full px-3 py-1.5 text-center text-sm hover:bg-neutral-50 font-medium ${
              isUk ? 'text-primary-600 bg-primary-50/50' : 'text-neutral-600'
            }`}
          >
            UA
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`w-full px-3 py-1.5 text-center text-sm hover:bg-neutral-50 font-medium ${
              !isUk ? 'text-primary-600 bg-primary-50/50' : 'text-neutral-600'
            }`}
          >
            EN
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

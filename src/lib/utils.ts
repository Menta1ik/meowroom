import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { uk, enUS } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CIS countries (Commonwealth of Independent States) + Georgia/Ukraine neighbours
export const CIS_LANGUAGES = ['uk', 'ru', 'be', 'kk', 'az', 'hy', 'ka', 'ky', 'tg', 'uz', 'ro', 'md'];

// Helper to get date-fns locale based on i18n language
export const getDateLocale = (language: string | undefined | null) => {
  if (!language) return enUS;
  
  const lang = language.toLowerCase();
  // Direct check for Ukrainian and Russian (common case)
  if (lang === 'uk' || lang.startsWith('uk-') || lang === 'ru' || lang.startsWith('ru-')) {
    return uk;
  }

  // If language starts with any of CIS languages or is 'uk', return Ukrainian locale
  if (CIS_LANGUAGES.some(l => lang.startsWith(l))) {
    return uk;
  }
  
  // Default to English for everyone else
  return enUS;
};

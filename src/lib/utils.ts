import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { uk, enUS } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CIS countries (Commonwealth of Independent States) + Georgia/Ukraine neighbours
const CIS_LANGUAGES = ['uk', 'ru', 'be', 'kk', 'az', 'hy', 'ka', 'ky', 'tg', 'uz', 'ro', 'md'];

// Helper to get date-fns locale based on i18n language
export const getDateLocale = (language: string) => {
  // If language is in CIS list, return Ukrainian locale
  if (CIS_LANGUAGES.includes(language)) {
    return uk;
  }
  // Default to English for everyone else
  return enUS;
};

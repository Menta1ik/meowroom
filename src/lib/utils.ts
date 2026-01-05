import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { uk, enUS } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to get date-fns locale based on i18n language
export const getDateLocale = (language: string) => {
  switch (language) {
    case 'en': return enUS;
    default: return uk; // Default to Ukrainian for 'ru', 'uk', etc.
  }
};

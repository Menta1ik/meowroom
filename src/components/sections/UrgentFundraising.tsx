import React from 'react';
import { AlertCircle, CreditCard, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface UrgentFundraisingProps {
  id: string;
  title: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  jarLink: string;
  cardNumber: string;
}

export const UrgentFundraising: React.FC<UrgentFundraisingProps> = ({
  id,
  title,
  description,
  currentAmount,
  targetAmount,
  jarLink,
  cardNumber
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const percentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);

  const handleCardClick = () => {
    navigate(`/fundraising/${id}`);
  };

  const copyCardNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
    alert(t('urgent.copy_success'));
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={handleCardClick}
      className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full flex items-center gap-2">
            <AlertCircle size={14} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('urgent.label')}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-neutral-800 mb-3 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <p className="text-neutral-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
          {description}
        </p>
        
        {/* Progress Card */}
        <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-4 mb-6 relative overflow-hidden">
          <div className="flex justify-between items-end mb-3 relative z-10">
            <div>
              <span className="block text-xs font-bold text-neutral-400 uppercase mb-1">{t('urgent.collected')}</span>
              <span className="text-xl font-black text-primary-600">{currentAmount.toLocaleString('ru-RU')} ₴</span>
            </div>
            <div className="text-right">
              <span className="block text-xs font-bold text-neutral-400 uppercase mb-1">{t('urgent.goal')}</span>
              <span className="text-lg font-bold text-neutral-400">{targetAmount.toLocaleString('ru-RU')} ₴</span>
            </div>
          </div>
          <ProgressBar progress={percentage} colorClass="bg-gradient-to-r from-red-500 to-red-400" className="h-2.5 bg-neutral-200" />
          <div className="mt-2 flex justify-between items-center text-xs font-medium">
              <span className="text-red-500">{percentage}%</span>
              <span className="text-neutral-400">{t('urgent.remaining')} {(targetAmount - currentAmount).toLocaleString('ru-RU')} ₴</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3 mt-auto">
          <Button 
            href={jarLink} 
            target="_blank" 
            className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100 py-3 rounded-xl font-bold text-base"
            onClick={handleButtonClick}
          >
            {t('urgent.cta_help')}
          </Button>
          <button 
            onClick={copyCardNumber}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-neutral-300 hover:border-red-400 hover:bg-red-50 transition-all group/btn bg-white"
          >
            <CreditCard size={16} className="text-neutral-400 group-hover/btn:text-red-500 transition-colors" />
            <span className="font-mono text-sm text-neutral-600 group-hover/btn:text-red-700 font-medium">{cardNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
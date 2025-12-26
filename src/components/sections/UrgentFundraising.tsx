import React from 'react';
import { AlertCircle, CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface UrgentFundraisingProps {
  title: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  jarLink: string;
  cardNumber: string;
}

export const UrgentFundraising: React.FC<UrgentFundraisingProps> = ({
  title,
  description,
  currentAmount,
  targetAmount,
  jarLink,
  cardNumber,
}) => {
  const percentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);

  const copyCardNumber = () => {
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
    alert('Номер карты скопирован!');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-neutral-100 group hover:shadow-2xl transition-shadow duration-300">
      {/* Header - Full Width with Red Gradient */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 md:p-8 text-white flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm shrink-0">
          <AlertCircle className="text-white animate-pulse" size={28} />
        </div>
        <div>
          <h3 className="font-bold text-red-100 text-sm uppercase tracking-wider mb-1">Срочный сбор</h3>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{title}</h2>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        {/* Left Column: Media (Video + Timeline) */}
        <div className="w-full lg:w-1/2 bg-neutral-50 p-6 md:p-8 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-neutral-100">
           {/* Main Video */}
           <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video relative group/video">
              <video 
                src="/jordan-video.mp4" 
                controls 
                className="w-full h-full object-contain"
                poster="/jordan-before.jpg"
              >
                Ваш браузер не поддерживает видео.
              </video>
           </div>

           {/* Timeline Photos */}
           <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="space-y-2 group/photo">
                <div className="aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-neutral-200 group-hover/photo:ring-red-300 transition-all">
                  <img src="/jordan-before.jpg" alt="До лечения" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-center font-bold text-neutral-500 uppercase tracking-wide">ДО ОПЕРАЦИИ</p>
              </div>
              <div className="space-y-2 group/photo">
                <div className="aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-neutral-200 group-hover/photo:ring-red-300 transition-all">
                  <img src="/jordan-stitches.jpg" alt="После операции" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-center font-bold text-neutral-500 uppercase tracking-wide">После операции</p>
              </div>
              <div className="space-y-2 group/photo">
                <div className="aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-neutral-200 group-hover/photo:ring-red-300 transition-all">
                  <img src="/jordan-after.jpg" alt="Восстановление" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-center font-bold text-neutral-500 uppercase tracking-wide">Восстановление</p>
              </div>
           </div>
        </div>

        {/* Right Column: Content & Action */}
        <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="prose prose-lg text-neutral-600 mb-8 leading-relaxed">
              <p>{description}</p>
            </div>
            
            {/* Progress Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                  <span className="block text-sm font-medium text-neutral-500 mb-1">Уже собрано</span>
                  <span className="text-3xl font-bold text-primary-800 tracking-tight">{currentAmount.toLocaleString('ru-RU')} ₴</span>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-medium text-neutral-500 mb-1">Цель</span>
                  <span className="text-xl font-bold text-neutral-400">{targetAmount.toLocaleString('ru-RU')} ₴</span>
                </div>
              </div>
              <ProgressBar progress={percentage} colorClass="bg-gradient-to-r from-red-500 to-red-400" className="h-3 bg-red-50" />
              <div className="mt-3 flex justify-between items-center text-sm">
                 <span className="font-bold text-red-600">{percentage}%</span>
                 <span className="text-neutral-400">Осталось собрать: <span className="font-medium text-neutral-600">{(targetAmount - currentAmount).toLocaleString('ru-RU')} ₴</span></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              href={jarLink} 
              target="_blank" 
              className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100 py-4 text-xl border-0"
              size="lg"
            >
              Помочь Джордану
            </Button>
            <button 
              onClick={copyCardNumber}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-neutral-300 hover:border-red-400 hover:bg-red-50 transition-all group bg-white"
            >
              <CreditCard size={22} className="text-neutral-400 group-hover:text-red-500 transition-colors" />
              <span className="font-mono text-lg text-neutral-600 group-hover:text-red-700 font-medium tracking-wide">{cardNumber}</span>
            </button>
            <p className="text-center text-xs text-neutral-400">
              Нажмите на номер карты, чтобы скопировать
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

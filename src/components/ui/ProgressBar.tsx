import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  progress: number;
  colorClass?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  colorClass = 'bg-primary-500',
  className 
}) => {
  return (
    <div className={clsx("w-full bg-neutral-200 rounded-full h-2.5", className)}>
      <div 
        className={clsx("h-2.5 rounded-full transition-all duration-500", colorClass)} 
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      ></div>
    </div>
  );
};

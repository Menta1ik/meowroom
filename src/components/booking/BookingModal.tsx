import React from 'react';
import { BookingWidget } from './BookingWidget';
import { X } from 'lucide-react';

interface BookingModalProps {
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="max-h-[90vh] overflow-y-auto">
          <BookingWidget />
        </div>
      </div>
    </div>
  );
};

import React, { createContext, useContext, useState } from 'react';
import { BookingModal } from '../components/booking/BookingModal';

interface BookingContextType {
  isOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openBooking = () => setIsOpen(true);
  const closeBooking = () => {
    setIsOpen(false);
    // Clear URL params if closing after success
    if (window.location.search.includes('success=true')) {
        const url = new URL(window.location.href);
        url.searchParams.delete('success');
        url.searchParams.delete('bookingId');
        window.history.replaceState({}, '', url.toString());
    }
  };

  // Check for success redirect from payment
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsOpen(true);
    }
  }, []);

  return (
    <BookingContext.Provider value={{ isOpen, openBooking, closeBooking }}>
      {children}
      {isOpen && <BookingModal onClose={closeBooking} />}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

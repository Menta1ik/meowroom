import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../ui/Button';
import Logo from '../ui/Logo';
import { BookingModal } from '../ui/BookingModal';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'О нас', path: '/about' },
    { name: 'Наши котики', path: '/cats' },
    { name: 'Посетить', path: '/visit' },
    { name: 'Поддержать', path: '/donate' },
    { name: 'Спонсорам', path: '/become-sponsor' },
    { name: 'Контакты', path: '/contacts' },
  ];

  return (
    <>
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <Logo className="w-12 h-12 transition-transform group-hover:scale-105" />
              <span className={`font-display font-bold text-2xl tracking-tight transition-colors ${
                isTransparent ? 'text-white' : 'text-primary-700'
              }`}>
                Meowroom
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium transition-colors hover:text-primary-500 ${
                    location.pathname === link.path
                      ? 'text-primary-500'
                      : isTransparent
                        ? 'text-white'
                        : 'text-neutral-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                onClick={() => setIsBookingOpen(true)}
                variant="secondary"
                size="sm"
              >
                Забронировать
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 transition-colors hover:text-primary-500 ${
                isTransparent ? 'text-white' : 'text-neutral-600'
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-neutral-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-lg font-medium py-2 ${
                      location.pathname === link.path
                        ? 'text-primary-500'
                        : 'text-neutral-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setIsBookingOpen(true);
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  Забронировать визит
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

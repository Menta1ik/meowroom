import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import Logo from '../ui/Logo';
import LanguageSelector from '../ui/LanguageSelector';
import { useBooking } from '../../context/BookingContext';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { openBooking } = useBooking();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  // Logic for transparent/colored header:
  // On Home: transparent at top, colored when scrolled.
  // On inner pages: always colored background (white), but we want the "layout behavior" to be consistent.
  // Actually, for inner pages, if we want the SAME behavior (text disappears on scroll), we should rely on 'scrolled' state.
  // However, on inner pages, the background is ALWAYS white (or at least not transparent over a hero image).
  // Let's refine 'isTransparent' to strictly mean "is the header currently transparent?".
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
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.visit'), path: '/visit' },
    { name: t('nav.cats'), path: '/cats' },
    { name: t('nav.donate'), path: '/donate' },
    { name: t('nav.reports'), path: '/reports' },
    { name: t('nav.contacts'), path: '/contacts' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          // Background logic:
          // Home & Not Scrolled -> Transparent
          // Home & Scrolled -> White
          // Inner Pages -> Always White (or at least when at top, it's white/light)
          isTransparent 
            ? 'bg-transparent py-4' 
            : 'bg-white/90 backdrop-blur-md shadow-sm py-2'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex items-center gap-2 group shrink-0">
              <Link to="/" className="flex items-center gap-2" aria-label="Meowroom Home">
                <Logo className="w-12 h-12 transition-transform group-hover:scale-105" />
                {/* Meowroom text logic:
                    - Visible when at top (scrolled === false)
                    - Hidden when scrolled (scrolled === true)
                    - Color: White on Home (Transparent), Primary on Inner pages or when Scrolled
                */}
                <span 
                  className={`font-display font-bold text-2xl tracking-tight transition-all duration-300 overflow-hidden whitespace-nowrap ${
                    !scrolled 
                      ? 'max-w-[200px] opacity-100' // Visible at top
                      : 'md:max-w-0 md:opacity-0 md:mr-0 max-w-[200px] opacity-100' // Hidden on desktop scroll
                  } ${
                    isTransparent ? 'text-white' : 'text-primary-700' // Color logic
                  }`}
                >
                  Meowroom
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {/* Shift logic:
                - Not scrolled: Center (default flex behavior in this layout context? Actually previous code relied on space-between).
                - To truly center it when not scrolled, we might need absolute positioning or flex-grow hacks, 
                  BUT the previous request implied "looks as is" (which was likely centered or spaced evenly).
                  Let's stick to the "shift left" logic:
                - If scrolled: margin-left to push it near logo.
                - If NOT scrolled: centered relative to container? Or just default position?
                  The previous working version had it just in the flow.
                  "shift to left" means `mr-auto ml-8`.
                  So when NOT scrolled, it should be just centered? 
                  The `justify-between` on the parent container spreads Logo, Nav, Actions.
                  So Nav is naturally in the middle-ish.
            */}
            <nav className={`hidden md:flex items-center gap-8 transition-all duration-500 ${
              scrolled ? 'mr-auto ml-8' : ''
            }`}>
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
            </nav>

            {/* Right Side: Language & Booking */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
               <LanguageSelector isTransparent={isTransparent} />
               <Button
                onClick={openBooking}
                variant="secondary"
                size="sm"
              >
                {t('hero.cta_visit')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
              <LanguageSelector isTransparent={isTransparent} />
              <button
                className={`p-2 transition-colors hover:text-primary-500 ${
                  isTransparent ? 'text-white' : 'text-neutral-600'
                }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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
                    openBooking();
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  {t('hero.cta_visit')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

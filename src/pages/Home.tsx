import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../context/BookingContext';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { DonationPreview } from '../components/sections/DonationPreview';
import { ReviewsSection } from '../components/sections/ReviewsSection';
import { SEO } from '../components/SEO';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { openBooking } = useBooking();

  return (
    <div className="flex flex-col">
      <SEO 
        title={t('hero.title')} 
        description={t('hero.subtitle')} 
      />
      <HeroSection onBooking={openBooking} />
      <AboutSection />
      <ServicesSection />
      <ReviewsSection />
      <DonationPreview />
    </div>
  );
};

export default Home;

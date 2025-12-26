import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { DonationPreview } from '../components/sections/DonationPreview';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <DonationPreview />
    </div>
  );
};

export default Home;

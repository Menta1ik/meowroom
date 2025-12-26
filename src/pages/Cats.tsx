import React from 'react';
import { CatsGallery } from '../components/sections/CatsGallery';

const Cats: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-neutral-50">
      <div className="bg-primary-600 text-white py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Наши котики</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">Здесь они нашли любящую семью и теплый дом. Познакомьтесь с ними и найдите своего любимца, чтобы стать его другом и опекуном.</p>
        </div>
      </div>
      <CatsGallery />
    </div>
  );
};

export default Cats;

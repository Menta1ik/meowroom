import React, { useEffect } from 'react';

export const ReviewsSection: React.FC = () => {
  useEffect(() => {
    // Check if the script is already present
    if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
      const script = document.createElement('script');
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Elfsight Widget Container */}
        <div className="elfsight-app-1945678e-b646-47cf-855e-b68740deaa55" data-elfsight-app-lazy></div>
      </div>
    </section>
  );
};

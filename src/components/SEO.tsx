import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = '/logo.png', 
  type = 'website',
  url = 'https://meowroom.kh.ua' // Assuming this domain or similar, can be updated
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  // Defaults
  const siteTitle = 'Meowroom';
  const fullTitle = title ? `${title} | ${siteTitle}` : 'Meowroom - Cat Shelter & Anticafe in Kharkiv';
  const defaultDescription = 'Meowroom is a unique space in Kharkiv combining a cat shelter and an anticafe. Visit us to relax with cats or adopt a friend.';
  const finalDescription = description || defaultDescription;
  const fullUrl = url; // In a real app, combine with current path

  // JSON-LD Schema for LocalBusiness / AnimalShelter
  // This is crucial for AI search (ChatGPT, Gemini, etc.) to understand what this entity is.
  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["AnimalShelter", "CafeOrCoffeeShop"],
    "name": "Meowroom",
    "image": [
      `${url}/logo.png`,
      `${url}/about-1.jpg`
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "23 Kultury Str.",
      "addressLocality": "Kharkiv",
      "postalCode": "61000",
      "addressCountry": "UA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 50.009, // Approx for Kharkiv Naukova area
      "longitude": 36.225
    },
    "url": url,
    "telephone": "+380000000000", // Needs actual phone
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "12:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$",
    "description": finalDescription
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content="cat shelter, anticafe, kharkiv, adopt cat, meowroom, charity, animals, котокафе, приют, харьков, взять кота" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Meowroom" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org JSON-LD for AI */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

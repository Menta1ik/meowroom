import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  url?: string;
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = '/logo.png', 
  type = 'website',
  url = 'https://meowroom.top',
  schema
}) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  // Defaults
  const siteTitle = 'Meowroom';
  const siteUrl = 'https://meowroom.top';
  const fullTitle = title ? `${title} | ${siteTitle}` : t('seo.default_title');
  const finalDescription = description || t('seo.default_description');
  const fullUrl = url; // In a real app, combine with current path
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Default JSON-LD Schema for LocalBusiness / AnimalShelter
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": ["AnimalShelter", "CafeOrCoffeeShop"],
    "name": t('seo.schema.name'),
    "image": [
      fullImage,
      `${siteUrl}/about-1.jpg`
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": t('seo.schema.address_street'),
      "addressLocality": t('seo.schema.address_locality'),
      "postalCode": "61000",
      "addressCountry": t('seo.schema.address_country')
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 50.009, 
      "longitude": 36.225
    },
    "url": siteUrl,
    "telephone": "+380661732463",
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
    "priceRange": t('seo.schema.price_range'),
    "description": t('seo.schema.description')
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={t('seo.keywords')} />

      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Meowroom" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Schema.org JSON-LD for AI */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

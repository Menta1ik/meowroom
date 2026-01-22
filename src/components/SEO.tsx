import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

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
  url, // Optional override
  schema
}) => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const lang = i18n.language;

  // Defaults
  const siteTitle = 'Meowroom';
  const siteUrl = 'https://meowroom.top';
  const fullTitle = title ? `${title} | ${siteTitle}` : t('seo.default_title');
  const finalDescription = description || t('seo.default_description');
  
  // Canonical URL logic
  const currentPath = location.pathname === '/' ? '' : location.pathname;
  const canonicalUrl = url || `${siteUrl}${currentPath}`;
  
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
  
  // Enhance schema with sameAs social links
  if (!schema) {
    (finalSchema as any).sameAs = [
      "https://www.instagram.com/meowroom.kharkiv",
      "https://www.facebook.com/profile.php?id=61551609639660",
      "https://www.tiktok.com/@bluecrossforcats"
    ];
  }

  return (
    <Helmet>
      {/* Standard Metadata */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={t('seo.keywords')} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Meowroom" />
      <meta name="format-detection" content="telephone=no" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags for International SEO */}
      <link rel="alternate" hrefLang="uk" href={`${siteUrl}${currentPath}`} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}${currentPath}?lng=en`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${currentPath}`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Meowroom" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@meowroom.kharkiv" />
      <meta name="twitter:creator" content="@meowroom.kharkiv" />
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

import type { Metadata } from 'next';

interface SearchSEOProps {
  category?: string;
  city?: string;
  count?: number;
  locale?: string;
}

export function getSearchMetadata({ 
  category = 'Drag Queen', 
  city = 'Global', 
  count = 100, 
  locale = 'en' 
}: SearchSEOProps): Metadata {
  const url = `https://dragdem.com/search/${category.toLowerCase().replace(' ', '-')}-in-${city.toLowerCase().replace(' ', '-')}`;
  
  const title = locale === 'pt' 
    ? `Top ${count} Artistas de ${category} em ${city} | DRAGDEM`
    : locale === 'th'
    ? `สุดยอดนักแสดง ${category} ${count} ท่านใน ${city} | DRAGDEM`
    : `Top ${count} ${category} Artists in ${city} | DRAGDEM`;

  const description = locale === 'pt'
    ? `Encontre e reserve os melhores artistas de ${category} em ${city}. Veja perfis, vídeos e avaliações verificadas.`
    : locale === 'th'
    ? `ค้นหาและจองนักแสดง ${category} ที่ดีที่สุดใน ${city} ดูโปรไฟล์ วิดีโอ และรีวิวที่ได้รับการยืนยัน`
    : `Find and book the best ${category} artists in ${city}. View verified profiles, performance reels, and reviews.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'DRAGDEM',
      type: 'website',
      images: [
        {
          url: 'https://dragdem.com/og-image.png',
          width: 1200,
          height: 630,
          alt: 'DRAGDEM - The Professional Backbone for Drag',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://dragdem.com/og-image.png'],
    }
  };
}

// Deprecated: Component-based SEO is not recommended in App Router.
// Keeping it for backward compatibility during transition if needed, but it does nothing now.
export const SearchSEO = () => null;

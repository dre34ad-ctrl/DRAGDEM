import Head from 'next/head';

interface SearchSEOProps {
  category?: string;
  city?: string;
  count?: number;
  locale?: string;
}

export const SearchSEO = ({ 
  category = 'Drag Queen', 
  city = 'Global', 
  count = 100, 
  locale = 'en' 
}: SearchSEOProps) => {
  const url = `https://dragdem.com/search/${category}-in-${city.toLowerCase().replace(' ', '-')}`;
  
  // Basic localization logic for title/desc (will be replaced by i18n hooks later)
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

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </Head>
  );
};

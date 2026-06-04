import Head from 'next/head';

interface ProfileSEOProps {
  name?: string;
  stageName?: string; // Add support for both
  bio?: string;
  image?: string;
  slug?: string;
  location?: string;
  categories?: string[];
}

export const ProfileSEO = ({ 
  name, 
  stageName, 
  bio, 
  image = 'https://dragdem.com/og-default.jpg', 
  slug = 'performer', 
  location = 'Global', 
  categories = [] 
}: ProfileSEOProps) => {
  const displayName = name || stageName || 'Drag Performer';
  const url = `https://dragdem.com/performer/${slug}`;
  const title = `${displayName} | Drag Performer in ${location} | DRAGDEM`;
  const description = bio || `Book ${displayName}, a professional drag performer in ${location}.`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="profile:username" content={slug} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

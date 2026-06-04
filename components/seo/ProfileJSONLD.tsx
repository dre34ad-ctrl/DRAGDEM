interface ProfileJSONLDProps {
  name?: string;
  stageName?: string;
  description?: string;
  bio?: string;
  image?: string;
  slug?: string;
  location?: string;
  ratingValue?: number;
  reviewCount?: number;
}

export const ProfileJSONLD = ({
  name,
  stageName,
  description,
  bio,
  image = 'https://dragdem.com/og-default.jpg',
  slug = 'performer',
  location = 'Global',
  ratingValue,
  reviewCount
}: ProfileJSONLDProps) => {
  const displayName = name || stageName || 'Drag Performer';
  const displayDescription = description || bio || `Professional drag performer in ${location}`;
  const url = `https://dragdem.com/performer/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": displayName,
    "description": displayDescription,
    "image": image,
    "url": url,
    "jobTitle": "Drag Performer",
    "workLocation": {
      "@type": "Place",
      "name": location
    },
    ...(ratingValue && reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingValue,
        "reviewCount": reviewCount
      }
    } : {})
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

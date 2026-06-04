import { createClient } from './server';

export async function getSearchMetadata(city?: string, category?: string) {
  const supabase = await createClient();
  
  let title = 'Find Drag Queens';
  let description = 'Discover and book top drag talent internationally.';
  
  if (city && category) {
    title = `${category} in ${city} | DRAGDEM`;
    description = `The best ${category} available for booking in ${city}. Compare rates, view media kits, and secure your event today.`;
  } else if (city) {
    title = `Drag Queens in ${city} | DRAGDEM`;
    description = `Book professional drag performers in ${city}. Browse local artists, read reviews, and manage your booking end-to-end.`;
  } else if (category) {
    title = `${category} Worldwide | DRAGDEM`;
    description = `Hire the world's best ${category}. From live vocals to death drops, find the perfect talent for your next event.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    }
  };
}

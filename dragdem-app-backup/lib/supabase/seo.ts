import { createClient } from './server';

export async function getPerformerSEOData(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('performer_profiles')
    .select(`
      stage_name,
      bio,
      location,
      vanity_url,
      users (
        image_url
      )
    `)
    .eq('vanity_url', slug)
    .single();

  if (error) {
    console.error('Error fetching performer SEO data:', error);
    return null;
  }

  return {
    name: data.stage_name,
    bio: data.bio,
    location: data.location,
    slug: data.vanity_url,
    image: (data.users as any)?.image_url
  };
}

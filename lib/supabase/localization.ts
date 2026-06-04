import { createClient } from './server';

export async function getLocalizedString(resourceType: string, resourceId: string, locale: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('localized_strings')
    .select('value')
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .eq('locale', locale)
    .single();

  if (error) {
    console.error('Error fetching localized string:', error);
    return null;
  }

  return data?.value;
}

export async function upsertLocalizedString(resourceType: string, resourceId: string, locale: string, value: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('localized_strings')
    .upsert({
      resource_type: resourceType,
      resource_id: resourceId,
      locale,
      value
    }, { onConflict: 'resource_type,resource_id,locale' });

  if (error) {
    console.error('Error upserting localized string:', error);
    throw error;
  }
}

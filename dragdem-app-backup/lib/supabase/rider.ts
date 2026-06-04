import { createClient } from './server';

export async function saveTechnicalRider(performerId: string, name: string, data: any, isDefault: boolean = false) {
  const supabase = await createClient();
  const { data: result, error } = await supabase
    .from('technical_rider_templates')
    .upsert({
      performer_id: performerId,
      name,
      stage_requirements: data.stage,
      audio_requirements: data.audio,
      hospitality_requirements: data.hospitality,
      is_default: isDefault
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving technical rider:', error);
    throw error;
  }

  return result;
}

export async function getTechnicalRiders(performerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('technical_rider_templates')
    .select('*')
    .eq('performer_id', performerId);

  if (error) {
    console.error('Error fetching technical riders:', error);
    return [];
  }

  return data;
}

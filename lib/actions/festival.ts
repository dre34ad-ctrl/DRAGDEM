'use server';

import { team_db } from '@/lib/utils/team-db';
import { createClient } from '@/lib/supabase/server';
import { generateMasterRider } from '@/lib/services/festival-service';

export async function getFestivalData(festivalId: string) {
  // 1. Get festival details
  const festival = (await team_db(`SELECT * FROM festivals WHERE id = '${festivalId}'`))[0];
  
  // 2. Get stages for this festival
  const stages = await team_db(`SELECT * FROM festival_stages WHERE festival_id = '${festivalId}'`);
  
  // 3. Get all slots for these stages
  const stageIds = stages.map((s: any) => s.id).join("','");
  const slots = await team_db(`
    SELECT * FROM festival_slots 
    WHERE stage_id IN ('${stageIds}')
    ORDER BY start_time ASC
  `);

  // 4. Get performer names from Supabase
  const performerIds = Array.from(new Set(slots.map((s: any) => s.performer_id)));
  const supabase = await createClient();
  const { data: performers } = await supabase
    .from('performer_profiles')
    .select('id, stage_name, institutional_badge')
    .in('id', performerIds);

  // Enrich slots with performer data
  const enrichedSlots = slots.map((slot: any) => {
    const performer = performers?.find(p => p.id === slot.performer_id);
    return {
      ...slot,
      performer_name: performer?.stage_name || 'Unknown Artist',
      is_pro: performer?.institutional_badge || false
    };
  });

  return {
    festival,
    stages,
    slots: enrichedSlots
  };
}

export async function getMasterRiderAction(stageId: string, date: string) {
  return await generateMasterRider(stageId, date);
}

export async function searchPerformersForInvite(query: string, certificationOnly: boolean = false) {
  const supabase = await createClient();
  let q = supabase
    .from('performer_profiles')
    .select('id, stage_name, institutional_badge, bio')
    .ilike('stage_name', `%${query}%`);
  
  if (certificationOnly) {
    q = q.eq('institutional_badge', true);
  }

  const { data, error } = await q.limit(10);
  if (error) throw error;
  return data;
}

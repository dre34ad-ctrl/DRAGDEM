import { teamDb } from '../db';
import { createClient } from '../supabase/server';

export async function generateMasterRider(stageId: string, dateStr: string) {
  // 1. Get confirmed slots for the stage on the given date from Turso
  const sql = `
    SELECT performer_id, start_time, end_time, tech_rider_override 
    FROM festival_slots 
    WHERE stage_id = '${stageId}' 
      AND status = 'confirmed' 
      AND date(start_time) = date('${dateStr}')
    ORDER BY start_time ASC
  `;
  const slots = await teamDb(sql);

  if (!slots || slots.length === 0) {
    return {
      stage_id: stageId,
      date: dateStr,
      lighting_requirements: [],
      sound_requirements: [],
      performer_summaries: []
    };
  }

  // 2. Get performer details and their default riders from Supabase
  const performerIds = slots.map(s => s.performer_id);
  const supabase = await createClient();
  
  const { data: performers, error: pError } = await supabase
    .from('performer_profiles')
    .select('id, stage_name')
    .in('id', performerIds);

  if (pError) throw pError;

  const { data: riders, error: rError } = await supabase
    .from('technical_rider_templates')
    .select('*')
    .in('performer_id', performerIds)
    .eq('is_default', true);

  if (rError) throw rError;

  // 3. Consolidate
  const performerSummaries = slots.map(slot => {
    const performer = performers.find(p => p.id === slot.performer_id);
    const defaultRider = riders.find(r => r.performer_id === slot.performer_id);
    
    // override if exists in slot
    const finalRider = slot.tech_rider_override ? JSON.parse(slot.tech_rider_override) : (defaultRider || {});

    return {
      performer_id: slot.performer_id,
      stage_name: performer?.stage_name || 'Unknown',
      start_time: slot.start_time,
      end_time: slot.end_time,
      rider: finalRider
    };
  });

  return {
    stage_id: stageId,
    date: dateStr,
    performer_summaries: performerSummaries,
    // Aggregated high-level notes (simplified logic)
    aggregated_needs: {
      audio_channels: performerSummaries.reduce((acc, p) => acc + (p.rider.audio_requirements?.channels || 0), 0),
      hospitality_summary: performerSummaries.map(p => `${p.stage_name}: ${p.rider.hospitality_requirements?.dietary || 'No special needs'}`)
    }
  };
}

export async function bulkBookRoster(festivalId: string, stageId: string, bookingData: { performer_id: string, start_time: string, end_time: string, fee: number }[]) {
  const results = [];
  for (const data of bookingData) {
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO festival_slots (id, festival_id, stage_id, performer_id, start_time, end_time, fee, status)
      VALUES ('${id}', '${festivalId}', '${stageId}', '${data.performer_id}', '${data.start_time}', '${data.end_time}', ${data.fee}, 'invitation_sent')
    `;
    await teamDb(sql);
    results.push(id);
  }
  return results;
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get all academy modules
    const { data: modules, error: mError } = await supabase
      .from('academy_modules')
      .select('id, module_code, title')
      .order('module_code', { ascending: true });

    if (mError) throw mError;

    // 2. Get performer progress
    const { data: certifications, error: cError } = await supabase
      .from('performer_certifications')
      .select('module_id, progress_percent, completed_at')
      .eq('performer_id', user.id);

    if (cError) throw cError;

    // 3. Get certification status and hash
    const { data: performer, error: pError } = await supabase
      .from('performer_profiles')
      .select('institutional_badge')
      .eq('id', user.id)
      .single();

    if (pError && pError.code !== 'PGRST116') throw pError;

    let certificateHash = null;
    if (performer?.institutional_badge) {
      const { data: certLog } = await supabase
        .from('certification_audit_log')
        .select('certificate_hash')
        .eq('performer_id', user.id)
        .order('issued_at', { ascending: false })
        .limit(1)
        .single();
      
      certificateHash = certLog?.certificate_hash;
    }

    // Map progress to modules
    const progressMap = modules.map(m => {
      const cert = certifications?.find(c => c.module_id === m.id);
      return {
        module_code: m.module_code,
        title: m.title,
        progress_percent: cert?.progress_percent || 0,
        completed_at: cert?.completed_at || null
      };
    });

    return NextResponse.json({
      success: true,
      progress: progressMap,
      isCertified: performer?.institutional_badge || false,
      certificateHash
    });

  } catch (error) {
    console.error('Academy status fetch failed:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

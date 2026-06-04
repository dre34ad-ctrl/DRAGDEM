import { NextResponse } from 'next/server';
import { updateAcademyProgress } from '@/lib/services/academy-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId, progressPercent } = await request.json();

    if (!moduleId || progressPercent === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    await updateAcademyProgress(user.id, moduleId, progressPercent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Academy progress update failed:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

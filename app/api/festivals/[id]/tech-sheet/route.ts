import { NextResponse } from 'next/server';
import { generateMasterRider } from '@/lib/services/festival-service';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // We await params even if we don't use id directly, for consistency and types
  await params;
  const { searchParams } = new URL(request.url);
  const stageId = searchParams.get('stageId');
  const date = searchParams.get('date');

  if (!stageId || !date) {
    return NextResponse.json({ error: 'Missing stageId or date' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const techSheet = await generateMasterRider(stageId, date);

    return NextResponse.json(techSheet);
  } catch (error) {
    console.error('Tech sheet generation failed:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

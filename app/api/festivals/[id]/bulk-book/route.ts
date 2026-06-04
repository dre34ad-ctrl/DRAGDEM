import { NextResponse } from 'next/server';
import { bulkBookRoster } from '@/lib/services/festival-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: festivalId } = await params;
  const body = await request.json();
  const { stageId, bookings } = body;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call service to perform bulk booking in Turso
    const slotIds = await bulkBookRoster(festivalId, stageId, bookings);

    return NextResponse.json({ 
      success: true, 
      count: slotIds.length,
      slotIds 
    });
  } catch (error) {
    console.error('Bulk booking failed:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

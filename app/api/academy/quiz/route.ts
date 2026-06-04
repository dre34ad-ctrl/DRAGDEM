import { NextResponse } from 'next/server';
import { evaluateQuiz } from '@/lib/services/academy-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId, answers } = await request.json();

    if (!moduleId || !answers) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const result = await evaluateQuiz(user.id, moduleId, answers);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Quiz evaluation failed:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { verifyCertificate } from '@/lib/services/academy-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;

    if (!hash) {
      return NextResponse.json({ error: 'Missing hash' }, { status: 400 });
    }

    const certification = await verifyCertificate(hash);

    if (!certification) {
      return NextResponse.json({ valid: false, error: 'Certificate not found or invalid' }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      certification: {
        performer_id: certification.performer_id,
        badge_name: certification.badge_name,
        issued_at: certification.issued_at,
        modules_completed: certification.modules_completed,
        valid_until: certification.valid_until
      }
    });
  } catch (error) {
    console.error('Certification verification failed:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

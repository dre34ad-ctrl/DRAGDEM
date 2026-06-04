import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * dLocal Webhook Handler
 * Handles status updates for PIX, PromptPay, and SPEI payouts.
 */
export async function POST(req: Request) {
  const body = await req.json();
  
  // dLocal security: In production, verify the notification signature
  // const signature = req.headers.get('X-Notification-Signature');
  
  console.log('[dLocal Webhook] Received notification:', body);

  const { id, status, external_id } = body;

  if (!id || !external_id) {
    return new NextResponse('Invalid payload', { status: 400 });
  }

  const supabase = await createClient();

  // 1. Update payout record
  const { error: payoutError } = await supabase
    .from('payouts')
    .update({ 
      status: mapDLocalStatus(status),
      updated_at: new Date().toISOString()
    })
    .eq('transaction_ref', id);

  if (payoutError) {
    console.error('[dLocal Webhook] Payout update error:', payoutError);
    return new NextResponse('Database error', { status: 500 });
  }

  // 2. If payout is successful, we might want to update the escrow or booking status
  // though typically escrow is released BEFORE payout initiation.
  
  return new NextResponse('OK', { status: 200 });
}

function mapDLocalStatus(dlocalStatus: string): string {
  switch (dlocalStatus) {
    case 'PAID':
    case 'SUCCESS':
      return 'completed';
    case 'REJECTED':
    case 'CANCELLED':
    case 'ERROR':
      return 'failed';
    case 'PENDING':
      return 'pending';
    default:
      return 'processing';
  }
}

import { getDisputeWithEvidence } from '@/lib/supabase/dispute';
import { MediatorWorkbench } from '@/components/support/MediatorWorkbench';
import { notFound } from 'next/navigation';

export default async function MediatorPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id } = await params;
  
  try {
    const dispute = await getDisputeWithEvidence(id);
    if (!dispute) notFound();

    // Transform Supabase data to the format expected by MediatorWorkbench
    const formattedData = {
      id: dispute.id,
      status: dispute.status,
      priority: dispute.priority || 'medium',
      escrowTotal: dispute.bookings?.total_fee || 0,
      currency: dispute.bookings?.currency || 'USD',
      performerName: dispute.bookings?.performer?.display_name || 'Unknown Performer',
      seekerName: dispute.bookings?.seeker?.display_name || 'Unknown Seeker',
      bookingDate: dispute.bookings?.event_date ? new Date(dispute.bookings.event_date).toLocaleDateString() : 'N/A',
      eventContext: dispute.bookings?.event_name || 'Private Event',
      technicalRider: dispute.bookings?.technical_rider || 'No rider provided.',
      cueSheet: dispute.bookings?.cue_sheet || '',
      seekerStatement: dispute.claim_statement || 'No statement provided by seeker.',
      performerStatement: dispute.rebuttal_statement || 'No rebuttal provided by performer.',
      seekerEvidence: (dispute.seeker_evidence || []).map((url: string) => ({ type: 'image', url, timestamp: 'Uploaded during claim' })),
      performerEvidence: (dispute.performer_evidence || []).map((url: string) => ({ type: 'image', url, timestamp: 'Uploaded during rebuttal' })),
      chatLogs: dispute.chat_logs || [],
      bookingId: dispute.booking_id
    };

    return (
      <main className="min-h-screen bg-[#0a0a0c]">
        <MediatorWorkbench disputeData={formattedData} />
      </main>
    );
  } catch (error) {
    console.error('Error loading dispute:', error);
    // If we're in development or the dispute doesn't exist, we might want to show something else
    // but following standard practice we'll use notFound()
    notFound();
  }
}

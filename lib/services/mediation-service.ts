import { team_db } from '../utils/team-db.js';
import { FestivalPayoutService } from './festival-payout-service.js';
import * as crypto from 'crypto';

export interface Dispute {
  id: string;
  booking_id: string;
  festival_id: string;
  client_id: string;
  performer_id: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'open' | 'triage_tier1' | 'triage_tier2' | 'escalated' | 'resolved' | 'closed';
  tier: number;
  multi_sig_status: 'pending' | 'client_signed' | 'artist_signed' | 'mediator_signed' | 'fully_signed';
  resolution_summary?: string;
}

export class MediationService {
  /**
   * Initializes a new dispute and starts automated triage.
   */
  static async openDispute(data: Partial<Dispute>) {
    const id = `disp_${crypto.randomBytes(4).toString('hex')}`;
    await team_db(`
      INSERT INTO disputes (id, booking_id, festival_id, client_id, performer_id, amount, currency, reason, status, tier, multi_sig_status)
      VALUES ('${id}', '${data.booking_id}', '${data.festival_id}', '${data.client_id}', '${data.performer_id}', ${data.amount}, '${data.currency}', '${data.reason}', 'triage_tier1', 1, 'pending')
    `);

    console.log(`[MediationService] Dispute ${id} opened. Starting Tier 1 Triage...`);
    return await this.runTier1Triage(id);
  }

  /**
   * Tier 1: Objective Technical Triage (AI-Led).
   * Cross-references GPS, IoT, and Telemetry.
   */
  private static async runTier1Triage(disputeId: string) {
    const dispute = (await team_db(`SELECT * FROM disputes WHERE id = '${disputeId}'`))[0];
    
    // Simulate fetching IoT/GPS data
    const iotData = {
      arrival_time: '2026-05-26T18:05:00Z',
      scheduled_time: '2026-05-26T18:00:00Z',
      gps_proximity: 0.98, // 98% matching venue coordinates
      tech_rig_status: 'partial_failure', // e.g. Sound was 100%, but Lighting 70%
      missing_equipment: ['moving_head_04', 'strobe_02']
    };

    await this.addEvidence(disputeId, 'iot_telemetry', iotData, 0.95);

    // AI Logic: If missing equipment is detected, suggest a technical variance refund
    if (iotData.missing_equipment.length > 0 || iotData.tech_rig_status === 'partial_failure') {
      const variance = 0.10; // 10% refund suggested
      const suggestedRefund = dispute.amount * variance;
      
      console.log(`[MediationService] Tier 1 found technical variance. Suggesting ${variance * 100}% refund.`);
      
      await team_db(`
        UPDATE disputes 
        SET status = 'triage_tier2', tier = 2, resolution_summary = 'Tier 1 AI Triage: Technical variance detected. Suggested refund: ${suggestedRefund} ${dispute.currency} (10%).'
        WHERE id = '${disputeId}'
      `);
      
      return await this.runTier2Triage(disputeId);
    }

    return { id: disputeId, status: 'triage_tier1', action: 'waiting_for_tier2' };
  }

  /**
   * Tier 2: Evidence-Based Settlement (AI-Assisted).
   * Computer Vision & Sentiment analysis.
   */
  private static async runTier2Triage(disputeId: string) {
    const dispute = (await team_db(`SELECT * FROM disputes WHERE id = '${disputeId}'`))[0];

    // Simulate Computer Vision analysis of event photos
    const cvData = {
      stage_presence_detected: true,
      costume_match_rider: 0.85,
      crowd_sentiment: 'high_engagement'
    };
    await this.addEvidence(disputeId, 'computer_vision', cvData, 0.88);

    // Simulate Sentiment analysis of communications
    const sentimentData = {
      client_sentiment: 'frustrated',
      artist_sentiment: 'defensive',
      escalation_risk: 'medium'
    };
    await this.addEvidence(disputeId, 'sentiment', sentimentData, 0.80);

    // Search for Precedents
    const precedents = await this.searchSettlementPrecedents('technical_failure', 'EU');
    
    const suggestedResolution = `Based on Precedent ${precedents[0]?.id || 'GENERIC'}, recommended settlement is 12.5% refund.`;

    await team_db(`
      UPDATE disputes 
      SET status = 'escalated', tier = 3, resolution_summary = '${dispute.resolution_summary} Tier 2 AI suggests: ${suggestedResolution}'
      WHERE id = '${disputeId}'
    `);

    console.log(`[MediationService] Tier 2 complete. Escalating to Human Mediator with Precedent data.`);
    return { id: disputeId, status: 'escalated', recommendation: suggestedResolution };
  }

  /**
   * Multi-Sig 2-of-3 Escrow Override.
   */
  static async multiSigSign(disputeId: string, role: 'client' | 'artist' | 'mediator', signature: string) {
    const dispute = (await team_db(`SELECT * FROM disputes WHERE id = '${disputeId}'`))[0];
    
    let newStatus = dispute.multi_sig_status;
    if (role === 'client') newStatus = 'client_signed';
    if (role === 'artist') newStatus = 'artist_signed';
    if (role === 'mediator') {
      // Mediator can finalize if at least one other party has signed
      if (dispute.multi_sig_status !== 'pending') {
        newStatus = 'fully_signed';
      } else {
        newStatus = 'mediator_signed';
      }
    }

    await team_db(`
      UPDATE disputes 
      SET multi_sig_status = '${newStatus}', updated_at = CURRENT_TIMESTAMP
      WHERE id = '${disputeId}'
    `);

    if (newStatus === 'fully_signed') {
      await this.finalizeDispute(disputeId);
    }

    return { id: disputeId, multi_sig_status: newStatus };
  }

  private static async finalizeDispute(disputeId: string) {
    const dispute = (await team_db(`SELECT * FROM disputes WHERE id = '${disputeId}'`))[0];
    console.log(`[MediationService] Dispute ${disputeId} fully signed. Executing payout override...`);
    
    // Trigger payout via FestivalPayoutService (or manual override logic)
    // In this simulation, we mark as resolved.
    await team_db(`UPDATE disputes SET status = 'resolved' WHERE id = '${disputeId}'`);
  }

  private static async addEvidence(disputeId: string, type: string, data: any, score: number) {
    const id = `ev_${crypto.randomBytes(4).toString('hex')}`;
    await team_db(`
      INSERT INTO dispute_evidence (id, dispute_id, evidence_type, data, confidence_score)
      VALUES ('${id}', '${disputeId}', '${type}', '${JSON.stringify(data)}', ${score})
    `);
  }

  static async searchSettlementPrecedents(category: string, region: string) {
    return await team_db(`
      SELECT * FROM settlement_precedents 
      WHERE dispute_category = '${category}' AND region = '${region}'
      ORDER BY created_at DESC LIMIT 5
    `);
  }

  /**
   * Seeds some precedent data for the engine.
   */
  static async seedPrecedents() {
    const precedents = [
      { id: 'prec_01', category: 'technical_failure', region: 'EU', variance: 0.15, summary: 'Sound system failure during 1st set (15% refund).' },
      { id: 'prec_02', category: 'no_show', region: 'US', variance: 1.0, summary: 'Complete non-arrival (100% refund).' },
      { id: 'prec_03', category: 'technical_failure', region: 'JP', variance: 0.05, summary: 'Missing specific prop from tech rider (5% refund).' }
    ];

    for (const p of precedents) {
      await team_db(`
        INSERT INTO settlement_precedents (id, dispute_category, region, variance_percent, ruling_summary)
        VALUES ('${p.id}', '${p.category}', '${p.region}', ${p.variance}, '${p.summary}')
        ON CONFLICT(id) DO NOTHING
      `);
    }
  }
}

import { webcrypto } from 'node:crypto';

interface ContractData {
  contractId: string;
  performerName: string;
  seekerName: string;
  venueName: string;
  venueAddress: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  acts: string[];
  totalFee: number;
  currency: string;
  stageReq: string;
  audioReq: string;
}

export function generateContractText(data: ContractData): string {
  return `
DRAGDEM OFFICIAL PERFORMANCE AGREEMENT
Contract ID: #${data.contractId}

1. THE PARTIES
Performer: ${data.performerName}
Talent Seeker: ${data.seekerName}

2. EVENT DETAILS
Venue: ${data.venueName}
Address: ${data.venueAddress}
Date: ${data.eventDate}
Performance Window: ${data.startTime} - ${data.endTime}
Acts: ${data.acts.join(', ')}

3. FINANCIAL TERMS
Total Fee: ${data.currency} ${data.totalFee.toLocaleString()}
Payment: 100% Escrow on confirmation.
Kill Fee Schedule:
- > 14 days: 0%
- 7-14 days: 50%
- < 7 days: 100%

4. TECHNICAL REQUIREMENTS
Stage: ${data.stageReq}
Audio: ${data.audioReq}

5. POLICIES
5.1 Safety-Exit Guarantee: Performer right to exit for 100% payout in unsafe conditions.
5.2 Escrow Release: 48h post-event.

This document is a binding agreement generated via DRAGDEM.com.
  `.trim();
}

export async function calculateContractHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await webcrypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

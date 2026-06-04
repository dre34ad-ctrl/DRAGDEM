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
  region?: string;
  stealthMode?: boolean;
}

export function generateContractText(data: ContractData): string {
  const isFrance = data.region === 'FR';
  const isQuebec = data.region === 'CA' && /^[GHJ]/i.test(data.venueAddress || ''); // Simplified check for Quebec address/postal code in address string
  const isNZ = data.region === 'NZ';
  const useFrench = isFrance || isQuebec;

  let header = '';
  if (data.stealthMode) {
    header = '*** ENCRYPTED STEALTH CONTRACT ***\n';
  }

  if (useFrench) {
    return `
${header}ACCORD DE PERFORMANCE OFFICIEL DRAGDEM
ID du contrat: #${data.contractId}

1. LES PARTIES
Artiste: ${data.performerName}
Chercheur de talent: ${data.seekerName}

2. DÉTAILS DE L'ÉVÉNEMENT
Lieu: ${data.venueName}
Adresse: ${data.venueAddress}
Date: ${data.eventDate}
Fenêtre de performance: ${data.startTime} - ${data.endTime}
Actes: ${data.acts.join(', ')}

3. CONDITIONS FINANCIÈRES
Frais totaux: ${data.currency} ${data.totalFee.toLocaleString()}
Paiement: 100% Escrow lors de la confirmation.
Calendrier des frais d'annulation:
- > 14 jours: 0%
- 7-14 jours: 50%
- < 7 jours: 100%

4. EXIGENCES TECHNIQUES
Scène: ${data.stageReq}
Audio: ${data.audioReq}

5. POLITIQUES
5.1 Garantie de sortie de sécurité: Droit de l'artiste de sortir pour un paiement de 100% dans des conditions dangereuses.
5.2 Libération de l'engagement: 48h après l'événement.

Ce document est un accord contraignant généré via DRAGDEM.com. Conformément à la Loi 96, cette version française constitue la version officielle.
`.trim();
}

if (isNZ) {
return `
DRAGDEM OFFICIAL PERFORMANCE AGREEMENT / WHAKAAETANGA WHAKAAHUA O DRAGDEM
Contract ID: #${data.contractId}

1. THE PARTIES / NGĀ RŌPŪ
Performer / Kaiwhakaari: ${data.performerName}
Talent Seeker / Kaiwhakawhiwhi Pūmanawa: ${data.seekerName}

2. EVENT DETAILS / NGĀ MANAITANGA O TE KAIHAU
Venue / Wāhi: ${data.venueName}
Address / Wāhitau: ${data.venueAddress}
Date / Rā: ${data.eventDate}
Performance Window: ${data.startTime} - ${data.endTime}
Acts: ${data.acts.join(', ')}

3. FINANCIAL TERMS / NGĀ KUPU PŪTEA
Total Fee / Tapeke Utu: ${data.currency} ${data.totalFee.toLocaleString()}
Payment: 100% Escrow on confirmation.
Kill Fee Schedule:
- > 14 days: 0%
- 7-14 days: 50%
- < 7 days: 100%

4. TECHNICAL REQUIREMENTS / NGĀ PAEREWA HANGARAU
Stage: ${data.stageReq}
Audio: ${data.audioReq}

5. POLICIES / NGĀ KAUPAPAHERE
5.1 Safety-Exit Guarantee: Performer right to exit for 100% payout in unsafe conditions.
5.2 Escrow Release: 48h post-event.

This document is a binding agreement generated via DRAGDEM.com.
`.trim();
}

return `
${header}DRAGDEM OFFICIAL PERFORMANCE AGREEMENT
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

export interface FeeCalculationParams {
  amount: number;
  performerRegion: string;
  seekerRegion: string;
  isB2B?: boolean;
  performerTaxRegime?: string;
  performerVatRate?: number; 
  totalRevenueYTD?: number;
  hasVerifiedABN?: boolean; // Australia specific
  isLaborOnly?: boolean; // Australia specific
  hasTNumber?: boolean; // Japan specific
}

export function calculateFees({
  amount,
  performerRegion,
  seekerRegion,
  isB2B = false,
  performerTaxRegime,
  performerVatRate = 0,
  totalRevenueYTD = 0,
  hasVerifiedABN = false,
  isLaborOnly = false,
  hasTNumber = false,
}: FeeCalculationParams) {
  const platformFeePercent = 0.15; // 15%
  
  let isrWithholdingPercent = 0;
  let ivaWithholdingPercent = 0;
  let withholdingTax50aPercent = 0;
  let solidaritySurchargePercent = 0;
  let kskLiabilityPercent = 0;
  let superannuationPercent = 0;
  let abnWithholdingPercent = 0;
  let jpWithholdingPercent = 0;

  // 1. VAT / GST / Consumption Tax Logic
  let appliedVatRate = performerVatRate;

  // Thailand VAT Threshold (1.8M THB)
  if (performerRegion === 'TH' && totalRevenueYTD > 1800000 && appliedVatRate === 0) {
    appliedVatRate = 0.07; // Default 7% if threshold reached
  }

  // UK VAT Threshold (£90,000)
  if (performerRegion === 'GB' && totalRevenueYTD > 90000 && appliedVatRate === 0) {
    appliedVatRate = 0.20; // Standard 20% UK VAT
  }

  // Australia GST (10%)
  // Typically businesses with turnover > $75k must register for GST
  if (performerRegion === 'AU' && totalRevenueYTD > 75000 && appliedVatRate === 0) {
    appliedVatRate = 0.10;
  }

  // Japan Consumption Tax (10%)
  // Requires T-Number registration
  if (performerRegion === 'JP' && hasTNumber && appliedVatRate === 0) {
    appliedVatRate = 0.10;
  }

  // Canada HST (13% for Ontario/Generic)
  if (performerRegion === 'CA' && totalRevenueYTD > 30000 && appliedVatRate === 0) {
    appliedVatRate = 0.13;
  }

  // Taiwan VAT (5%)
  if (performerRegion === 'TW' && appliedVatRate === 0) {
    appliedVatRate = 0.05;
  }

  // Argentina IVA (21%)
  if (performerRegion === 'AR' && appliedVatRate === 0) {
    appliedVatRate = 0.21;
  }

  // Spain VAT (21%)
  if (performerRegion === 'ES' && appliedVatRate === 0) {
    appliedVatRate = 0.21;
  }

  // 2. Regional Specifics
  const withholdingsList: { name: string; amount: number }[] = [];

  // Spain: IRPF Withholding
  if (performerRegion === 'ES') {
    const irpfAmount = amount * 0.15;
    withholdingsList.push({ name: 'IRPF (ES)', amount: irpfAmount });
  }

  // Australia: ABN & Superannuation
  if (performerRegion === 'AU') {
    if (!hasVerifiedABN && isB2B) {
      const abnWithholdingAmount = amount * 0.47;
      withholdingsList.push({ name: 'ABN Withholding (47%)', amount: abnWithholdingAmount });
    }
    
    // Superannuation Guarantee (11.5%) applies for labor-only contracts in AU
    if (isLaborOnly) {
      superannuationPercent = 0.115;
    }
  }

  // Japan: Withholding Tax for Individual Performers
  if (performerRegion === 'JP' && performerTaxRegime !== 'CORPORATION') {
    const jpWithholdingAmount = amount * 0.1021;
    withholdingsList.push({ name: 'Withholding Tax (JP)', amount: jpWithholdingAmount });
  }

  // Mexico RESICO Compliance
  if (performerRegion === 'MX' && performerTaxRegime === 'RESICO') {
    if (isB2B && seekerRegion === 'MX') {
      withholdingsList.push({ name: 'ISR (MX)', amount: amount * 0.0125 });
      withholdingsList.push({ name: 'IVA Withholding (MX)', amount: amount * 0.1066 });
    }
  }

  // Germany KSK & Foreign Withholding (50a)
  if (seekerRegion === 'DE' && isB2B) {
    kskLiabilityPercent = 0.05;
    
    if (performerRegion !== 'DE') {
      const tax50aAmount = amount * 0.15;
      const solidaritySurchargeAmount = tax50aAmount * 0.055;
      withholdingsList.push({ name: '50a (DE)', amount: tax50aAmount });
      withholdingsList.push({ name: 'Solidarity Surcharge (DE)', amount: solidaritySurchargeAmount });
    }
  }

  const platformFee = amount * platformFeePercent;
  const totalWithholdings = withholdingsList.reduce((sum, w) => sum + w.amount, 0);

  // Calculate Net Payout
  const netPayout = amount - platformFee - totalWithholdings;

  // Venue Liabilities (Extra costs for the booker)
  const kskLiabilityAmount = amount * kskLiabilityPercent;
  const superannuationAmount = amount * superannuationPercent;
  const vatAmount = amount * appliedVatRate;

  return {
    subtotal: amount,
    platformFee,
    vatAmount,
    appliedVatRate,
    totalWithholdings,
    withholdings: withholdingsList,
    kskLiabilityAmount,
    superannuationAmount,
    netPayout,
  };
}

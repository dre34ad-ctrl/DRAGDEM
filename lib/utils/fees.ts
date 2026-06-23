export interface FeeCalculationParams {
  amount: number;
  performerRegion: string;
  seekerRegion: string;
  isB2B?: boolean;
  isInstitutional?: boolean;
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
  isInstitutional = false,
  performerTaxRegime,
  performerVatRate = 0,
  totalRevenueYTD = 0,
  hasVerifiedABN = false,
  isLaborOnly = false,
  hasTNumber = false,
}: FeeCalculationParams) {
  // Global 0.3% industry-disrupting margin (Phase 13 Standard)
  const platformFeePercent = 0.003;
  const performerPlatformFee = amount * platformFeePercent;
  const seekerPlatformFee = amount * platformFeePercent;
  
  let isrWithholdingPercent = 0;
  let ivaWithholdingPercent = 0;
  let withholdingTax50aPercent = 0;
  let solidaritySurchargePercent = 0;
  let kskLiabilityPercent = 0;
  let gusoLiabilityPercent = 0;
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
  if (performerRegion === 'AU' && totalRevenueYTD > 75000 && appliedVatRate === 0) {
    appliedVatRate = 0.10;
  }

  // Japan Consumption Tax (10%)
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

  // Israel VAT (17%)
  if (performerRegion === 'IL' && appliedVatRate === 0) {
    appliedVatRate = 0.17;
  }

  // Italy VAT (22%)
  if (performerRegion === 'IT' && appliedVatRate === 0) {
    appliedVatRate = 0.22;
  }

  // France VAT (20%)
  if (performerRegion === 'FR' && appliedVatRate === 0) {
    appliedVatRate = 0.20;
  }

  // Nordics VAT (25%)
  if (['SE', 'NO', 'DK'].includes(performerRegion) && appliedVatRate === 0) {
    appliedVatRate = 0.25;
  }

  // New Zealand GST (15%)
  if (performerRegion === 'NZ' && appliedVatRate === 0) {
    appliedVatRate = 0.15;
  }

  // 2. Regional Specifics
  const withholdingsList: { name: string; amount: number }[] = [];

  // Sweden: A-skatt for performers without F-skatt
  if (performerRegion === 'SE' && performerTaxRegime !== 'F-SKATT') {
    withholdingsList.push({ name: 'A-skatt (SE)', amount: amount * 0.30 });
    withholdingsList.push({ name: 'Arbetsgivaravgifter (SE)', amount: amount * 0.3142 });
  }

  // Spain: IRPF Withholding
  if (performerRegion === 'ES') {
    const irpfRate = performerTaxRegime === 'RETA_NEW' ? 0.07 : 0.15;
    const irpfAmount = amount * irpfRate;
    withholdingsList.push({ name: `IRPF (ES - ${irpfRate * 100}%)`, amount: irpfAmount });
  }

  // France: GUSO Liability
  if (performerRegion === 'FR' && performerTaxRegime === 'GUSO') {
    gusoLiabilityPercent = 0.35;
  }

  // Australia: ABN & Superannuation
  if (performerRegion === 'AU') {
    if (!hasVerifiedABN && isB2B) {
      const abnWithholdingAmount = amount * 0.47;
      withholdingsList.push({ name: 'ABN Withholding (47%)', amount: abnWithholdingAmount });
    }
    
    if (isLaborOnly) {
      superannuationPercent = 0.115;
    }
  }

  // Japan: Withholding Tax for Individual Performers
  if (performerRegion === 'JP' && performerTaxRegime !== 'CORPORATION') {
    const jpWithholdingAmount = amount * 0.1021;
    withholdingsList.push({ name: 'Gensen Choshu (JP)', amount: jpWithholdingAmount });
  }

  // Israel: Nikui Mas Withholding
  if (performerRegion === 'IL' && seekerRegion === 'IL' && !hasTNumber) {
    const ilWithholdingAmount = amount * 0.20;
    withholdingsList.push({ name: 'Nikui Mas (IL)', amount: ilWithholdingAmount });
  }

  // Italy: Ritenuta d'Acconto for Occasionale
  if (performerRegion === 'IT' && performerTaxRegime === 'OCCASIONALE') {
    const itWithholdingAmount = amount * 0.20;
    withholdingsList.push({ name: 'Ritenuta d\'Acconto (IT)', amount: itWithholdingAmount });
  }

  // Mexico RESICO Compliance
  if (performerRegion === 'MX' && performerTaxRegime === 'RESICO') {
    if (isB2B && seekerRegion === 'MX') {
      withholdingsList.push({ name: 'ISR (MX)', amount: amount * 0.0125 });
      withholdingsList.push({ name: 'IVA Withholding (MX)', amount: amount * 0.1066 });
    }
  }

  // Southeast Asia & Thailand specifics
  if (performerRegion === 'TH') {
    if (seekerRegion === 'TH' && isB2B) {
      withholdingsList.push({ name: 'WHT (TH - 3%)', amount: amount * 0.03 });
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

  const totalWithholdings = withholdingsList.reduce((sum, w) => sum + w.amount, 0);

  // Calculate Net Payout
  const netPayout = amount - performerPlatformFee - totalWithholdings;

  // Venue Liabilities (Extra costs for the booker)
  const kskLiabilityAmount = amount * kskLiabilityPercent;
  const gusoLiabilityAmount = amount * gusoLiabilityPercent;
  const superannuationAmount = amount * superannuationPercent;
  const vatAmount = amount * appliedVatRate;

  return {
    subtotal: amount,
    platformFee: performerPlatformFee,
    performerPlatformFee,
    seekerPlatformFee,
    vatAmount,
    appliedVatRate,
    totalWithholdings,
    withholdings: withholdingsList,
    kskLiabilityAmount,
    gusoLiabilityAmount,
    superannuationAmount,
    netPayout,
  };
}

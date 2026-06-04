export interface TaxCalculationParams {
  amount: number;
  performerRegion: string;
  seekerRegion: string;
  totalRevenueYTD?: number;
  performerTaxRegime?: string;
  hasTNumber?: boolean;
}

export interface TaxResult {
  vatRate: number;
  withholdings: { name: string; percent: number }[];
  isLiabilityToVenue: boolean;
}

/**
 * Placeholder service for Global Tax Calculation (e.g., Stripe Tax / Avalara integration)
 */
export class TaxService {
  /**
   * Calculates the applicable tax rates and withholdings for a transaction.
   */
  static async calculateGlobalTax(params: TaxCalculationParams): Promise<TaxResult> {
    const { amount, performerRegion, seekerRegion, totalRevenueYTD = 0, performerTaxRegime, hasTNumber } = params;
    
    let vatRate = 0;
    const withholdings: { name: string; percent: number }[] = [];
    let isLiabilityToVenue = false;

    // 1. Thailand VAT Threshold (1.8M THB)
    if (performerRegion === 'TH' && totalRevenueYTD > 1800000) {
      vatRate = 0.07;
    }

    // 2. UK VAT Threshold (£90,000)
    if (performerRegion === 'GB' && totalRevenueYTD > 90000) {
      vatRate = 0.20;
    }

    // 3. Australia GST ($75,000)
    if (performerRegion === 'AU' && totalRevenueYTD > 75000) {
      vatRate = 0.10;
    }

    // 4. Japan Consumption Tax (Requires T-Number)
    if (performerRegion === 'JP' && hasTNumber) {
      vatRate = 0.10;
    }

    // 5. Canada HST (Ontario/Generic)
    if (performerRegion === 'CA' && totalRevenueYTD > 30000) {
      vatRate = 0.13;
    }

    // 6. Taiwan VAT
    if (performerRegion === 'TW') {
      vatRate = 0.05;
    }

    // 7. Argentina IVA
    if (performerRegion === 'AR') {
      vatRate = 0.21;
    }

    // 8. Spain VAT
    if (performerRegion === 'ES') {
      vatRate = 0.21;
      withholdings.push({ name: 'IRPF (ES)', percent: 0.15 });
    }

    // 9. Mexico Withholdings (RESICO)
    if (performerRegion === 'MX' && performerTaxRegime === 'RESICO' && seekerRegion === 'MX') {
      withholdings.push({ name: 'ISR (MX)', percent: 0.0125 });
      withholdings.push({ name: 'IVA Withholding (MX)', percent: 0.1066 });
    }

    // 10. Germany Section 50a (Foreign Artist Withholding)
    if (seekerRegion === 'DE' && performerRegion !== 'DE') {
      withholdings.push({ name: '50a (DE)', percent: 0.15 });
      withholdings.push({ name: 'Solidarity Surcharge (DE)', percent: 0.15 * 0.055 });
    }

    return {
      vatRate,
      withholdings,
      isLiabilityToVenue: seekerRegion === 'DE' || (performerRegion === 'AU' && vatRate > 0)
    };
  }

  /**
   * Placeholder for future integration with Stripe Tax API
   */
  static async syncToStripeTax(transactionId: string) {
    console.log(`[TaxService] Syncing transaction ${transactionId} to Stripe Tax for global filing.`);
    return { status: 'synced' };
  }
}

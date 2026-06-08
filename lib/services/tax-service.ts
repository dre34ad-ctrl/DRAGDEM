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

    // 8. Spain VAT (IVA) & RETA Withholding (IRPF)
    if (performerRegion === 'ES') {
      vatRate = 0.21; // Standard IVA for services
      
      // IRPF Withholding for Autónomos (RETA)
      // Applies when the seeker is a business (B2B) located in Spain
      if (seekerRegion === 'ES' && performerTaxRegime?.startsWith('RETA')) {
        const irpfRate = performerTaxRegime === 'RETA_NEW' ? 0.07 : 0.15;
        withholdings.push({ name: `IRPF (ES - ${performerTaxRegime === 'RETA_NEW' ? '7%' : '15%'})`, percent: irpfRate });
      }
    }

    // 9. Israel VAT (17%) & Withholding
    if (performerRegion === 'IL') {
      vatRate = 0.17;
      // Default withholding for local performers without certificate or international artists
      if (seekerRegion === 'IL' && !hasTNumber) {
        withholdings.push({ name: 'Nikui Mas (IL)', percent: 0.20 }); // 20% simplified rate
      }
    }

    // 10. Italy VAT (22%)
    if (performerRegion === 'IT') {
      vatRate = 0.22;
      // Withholding for "Prestazione Occasionale" if applicable
      if (performerTaxRegime === 'OCCASIONALE') {
        withholdings.push({ name: 'Ritenuta d\'Acconto (IT)', percent: 0.20 });
      }
    }

    // 11. France VAT (20%) & GUSO Support
    if (performerRegion === 'FR') {
      vatRate = 0.20;
      
      // GUSO applies for one-off bookings by non-entertainment professionals
      if (performerTaxRegime === 'GUSO') {
        // GUSO contributions are liabilities for the employer (seeker)
        isLiabilityToVenue = true;
        
        // Detailed GUSO breakdown (Simplified for MVP)
        // Gross = Net / 0.78 (approx)
        // Contributions (Employer) = Gross * 0.45
        const netAmount = amount;
        const estimatedGross = netAmount / 0.78;
        const employerContribs = estimatedGross * 0.45;
        const employeeContribs = estimatedGross * 0.22;
        
        withholdings.push({ name: 'GUSO Employee Social (FR)', percent: 0.22 });
        withholdings.push({ name: 'GUSO Employer Social (FR)', percent: 0.45 });
      }
    }

    // 12. Japan Withholding (10.21%)
    if (performerRegion === 'JP' && performerTaxRegime !== 'CORPORATION') {
      withholdings.push({ name: 'Gensen Choshu (JP)', percent: 0.1021 });
    }

    // 13. Mexico Withholdings (RESICO)
    if (performerRegion === 'MX' && performerTaxRegime === 'RESICO' && seekerRegion === 'MX') {
      withholdings.push({ name: 'ISR (MX)', percent: 0.0125 });
      withholdings.push({ name: 'IVA Withholding (MX)', percent: 0.1066 });
    }

    // 14. Nordics (SE, NO, DK)
    if (['SE', 'NO', 'DK'].includes(performerRegion)) {
      vatRate = 0.25;
      if (performerRegion === 'SE' && performerTaxRegime !== 'F-SKATT') {
        withholdings.push({ name: 'A-skatt (SE)', percent: 0.30 });
        withholdings.push({ name: 'Arbetsgivaravgifter (SE)', percent: 0.3142 });
      }
    }

    // 15. New Zealand GST
    if (performerRegion === 'NZ') {
      vatRate = 0.15;
    }

    // 16. Poland VAT
    if (performerRegion === 'PL') {
      vatRate = 0.23;
    }

    // 17. Southeast Asia (PH, VN)
    if (performerRegion === 'PH') vatRate = 0.12;
    if (performerRegion === 'VN') vatRate = 0.10;

    // 18. South Korea VAT
    if (performerRegion === 'KR') vatRate = 0.10;

    // 19. Colombia VAT
    if (performerRegion === 'CO') vatRate = 0.19;

    // 20. Middle East (AE, SA)
    if (performerRegion === 'AE') vatRate = 0.05;
    if (performerRegion === 'SA') vatRate = 0.15;

    // 21. Germany Section 50a (Foreign Artist Withholding)
    if (seekerRegion === 'DE' && performerRegion !== 'DE') {
      withholdings.push({ name: '50a (DE)', percent: 0.15 });
      withholdings.push({ name: 'Solidarity Surcharge (DE)', percent: 0.15 * 0.055 });
    }

    return {
      vatRate,
      withholdings,
      isLiabilityToVenue: seekerRegion === 'DE' || (performerRegion === 'AU' && vatRate > 0) || withholdings.length > 0
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
// Triggering fresh build for production verification - Mon Jun  8 06:54:43 UTC 2026

import { FXService } from './fx-service';

export type PayoutProvider = 'stripe' | 'dlocal' | 'wise' | 'airwallex' | 'mercadopago' | 'bizum' | 'interac';

export interface RoutingDecision {
  provider: PayoutProvider;
  estimatedFee: number;
  reason: string;
}

export class PayoutEngine {
  /**
   * Selects the best payout provider based on the destination region and currency.
   */
  static getOptimalProvider(region: string, currency: string, amount: number): RoutingDecision {
    const curr = currency.toUpperCase();
    
    // 1. LATAM & Thailand -> dLocal, Mercado Pago or Wise
    if (['BR', 'MX', 'TH', 'AR'].includes(region)) {
      if (region === 'AR' && curr === 'ARS') {
        return {
          provider: 'mercadopago',
          estimatedFee: amount * 0.015,
          reason: 'Mercado Pago is the primary local rail for Argentina.'
        };
      }
      if (amount < 1000) {
        return {
          provider: 'dlocal',
          estimatedFee: amount * 0.02, // 2% for local rails
          reason: 'dLocal local rails (PIX/SPEI/PromptPay) are optimal for small transfers in this region.'
        };
      } else {
        return {
          provider: 'wise',
          estimatedFee: amount * 0.007 + 2, // ~0.7% + flat fee
          reason: 'Wise is more cost-effective for larger cross-border transfers to this region.'
        };
      }
    }

    // 2. Europe, UK, Australia, Canada -> Wise, Stripe, Bizum or Interac
    if (['EU', 'GB', 'AU', 'CA', 'DE', 'ES'].includes(region)) {
      if (region === 'ES' && curr === 'EUR' && amount <= 500) {
        return {
          provider: 'bizum',
          estimatedFee: 0.10, // Very low cost for Bizum
          reason: 'Bizum is optimal for small P2P-style transfers in Spain.'
        };
      }
      if (region === 'CA' && curr === 'CAD') {
        return {
          provider: 'interac',
          estimatedFee: 1.00, // Typical flat fee for Interac e-Transfer
          reason: 'Interac is the standard local rail for Canadian CAD transfers.'
        };
      }
      if (curr === 'EUR' || curr === 'GBP') {
        return {
          provider: 'stripe',
          estimatedFee: 0.25, // Stripe Connect flat fee for local currency
          reason: 'Stripe Connect local transfers are fastest and cheapest for primary markets.'
        };
      }
      return {
        provider: 'wise',
        estimatedFee: amount * 0.005 + 1,
        reason: 'Wise offers superior FX rates for secondary currencies in this region.'
      };
    }

    // 3. Japan & Taiwan -> Stripe or Airwallex
    if (['JP', 'TW'].includes(region)) {
      if (region === 'JP') {
        return {
          provider: 'stripe',
          estimatedFee: amount * 0.015, // Higher fee for JP
          reason: 'Stripe Connect has deep integration with Japanese banking rails.'
        };
      }
      return {
        provider: 'airwallex',
        estimatedFee: amount * 0.008,
        reason: 'Airwallex is highly efficient for Taiwan and SEA corridors.'
      };
    }

    // 4. Default to Airwallex for business-heavy or unsupported regions
    return {
      provider: 'airwallex',
      estimatedFee: amount * 0.01,
      reason: 'Airwallex selected for global corridor stability.'
    };
  }

  /**
   * Executes the payout using the selected provider.
   * (Placeholder logic for Wise/Airwallex integration)
   */
  static async executePayout(userId: string, amount: number, currency: string, region: string) {
    const decision = this.getOptimalProvider(region, currency, amount);
    console.log(`[PayoutEngine] Routing payout for user ${userId} to ${decision.provider}. Reason: ${decision.reason}`);

    switch (decision.provider) {
      case 'stripe':
        // Call existing Stripe logic
        break;
      case 'dlocal':
        // Call existing dLocal logic
        break;
      case 'wise':
        return await this.executeWiseTransfer(userId, amount, currency);
      case 'airwallex':
        return await this.executeAirwallexTransfer(userId, amount, currency);
      case 'mercadopago':
        return await this.executeMercadoPagoTransfer(userId, amount, currency);
      case 'bizum':
        return await this.executeBizumTransfer(userId, amount, currency);
      case 'interac':
        return await this.executeInteracTransfer(userId, amount, currency);
    }
  }

  private static async executeWiseTransfer(userId: string, amount: number, currency: string) {
    console.log(`[Wise] Initiating transfer of ${amount} ${currency} for ${userId}`);
    return { success: true, provider: 'wise', ref: `wise_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeAirwallexTransfer(userId: string, amount: number, currency: string) {
    console.log(`[Airwallex] Initiating transfer of ${amount} ${currency} for ${userId}`);
    return { success: true, provider: 'airwallex', ref: `awx_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeMercadoPagoTransfer(userId: string, amount: number, currency: string) {
    console.log(`[Mercado Pago] Initiating transfer of ${amount} ${currency} for ${userId}`);
    return { success: true, provider: 'mercadopago', ref: `mp_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeBizumTransfer(userId: string, amount: number, currency: string) {
    console.log(`[Bizum] Initiating transfer of ${amount} ${currency} for ${userId}`);
    return { success: true, provider: 'bizum', ref: `biz_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeInteracTransfer(userId: string, amount: number, currency: string) {
    console.log(`[Interac] Initiating transfer of ${amount} ${currency} for ${userId}`);
    return { success: true, provider: 'interac', ref: `int_${Math.random().toString(36).substr(2, 9)}` };
  }
}

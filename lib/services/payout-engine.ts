import { FXService } from './fx-service';
import { ComplianceService } from './compliance-service';
import { TaxService } from './tax-service';

export type PayoutProvider = 'stripe' | 'dlocal' | 'wise' | 'airwallex' | 'mercadopago' | 'bizum' | 'interac' | 'paypay' | 'paybox' | 'swish' | 'vipps' | 'mobilepay' | 'gcash' | 'maya' | 'momo' | 'kakaopay' | 'naverpay' | 'nequi' | 'daviplata' | 'promptpay';

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
    
    // 1. LATAM & Thailand -> dLocal, Mercado Pago, Wise or PromptPay
    if (['BR', 'MX', 'TH', 'AR'].includes(region)) {
      if (region === 'TH' && curr === 'THB') {
        return {
          provider: 'promptpay',
          estimatedFee: 0.0, // Often zero fee for PromptPay QR payouts via local rails
          reason: 'PromptPay is the absolute priority for the Thailand Phase 15 pilot.'
        };
      }
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
    if (['EU', 'GB', 'AU', 'CA', 'DE', 'ES', 'FR', 'IT'].includes(region)) {
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
      if (region === 'JP' && curr === 'JPY' && amount <= 5000) {
        return {
          provider: 'paypay',
          estimatedFee: 0.0, // Often zero fee for P2P in PayPay
          reason: 'PayPay is the most popular QR rail for small JPY transfers in Japan.'
        };
      }
      if (region === 'JP') {
        return {
          provider: 'stripe',
          estimatedFee: amount * 0.015, // Higher fee for JP
          reason: 'Stripe Connect supports Zengin bank transfers for compliant Japanese payouts.'
        };
      }
      return {
        provider: 'airwallex',
        estimatedFee: amount * 0.008,
        reason: 'Airwallex is highly efficient for Taiwan and SEA corridors.'
      };
    }

    // 4. Israel -> PayBox
    if (region === 'IL' && curr === 'ILS') {
      return {
        provider: 'paybox',
        estimatedFee: 0.0,
        reason: 'PayBox is the preferred local P2P rail in Israel.'
      };
    }

    // 5. Nordics -> Swish, Vipps, MobilePay
    if (region === 'SE' && curr === 'SEK' && amount <= 5000) {
      return {
        provider: 'swish',
        estimatedFee: 2.0, // SEK 2.00 flat fee is common for Swish business
        reason: 'Swish is the standard real-time P2P/B2C rail in Sweden.'
      };
    }
    if (region === 'NO' && curr === 'NOK' && amount <= 5000) {
      return {
        provider: 'vipps',
        estimatedFee: amount * 0.01,
        reason: 'Vipps is the dominant mobile payment rail in Norway.'
      };
    }
    if (region === 'DK' && curr === 'DKK' && amount <= 5000) {
      return {
        provider: 'mobilepay',
        estimatedFee: 1.0, // DKK 1.00 approx
        reason: 'MobilePay is the primary mobile rail for Denmark.'
      };
    }

    // 6. Southeast Asia & South Korea -> GCash, Maya, MoMo, KakaoPay, Naver Pay
    if (['PH', 'VN', 'KR'].includes(region)) {
      if (region === 'PH') {
        return {
          provider: amount < 500 ? 'gcash' : 'maya',
          estimatedFee: 0.0,
          reason: 'GCash and Maya are the dominant mobile wallets in the Philippines.'
        };
      }
      if (region === 'VN') {
        return {
          provider: 'momo',
          estimatedFee: 0.0,
          reason: 'MoMo is the primary e-wallet for Vietnam.'
        };
      }
      if (region === 'KR') {
        return {
          provider: amount < 10000 ? 'kakaopay' : 'naverpay',
          estimatedFee: 0.0,
          reason: 'KakaoPay and Naver Pay are essential for the South Korean market.'
        };
      }
    }

    // 7. Colombia -> Nequi, DaviPlata
    if (region === 'CO') {
      return {
        provider: 'nequi',
        estimatedFee: 0.0,
        reason: 'Nequi is the most used digital wallet in Colombia.'
      };
    }

    // 8. Default to Airwallex for business-heavy or unsupported regions
    if (region === 'NZ') {
      return {
        provider: 'wise',
        estimatedFee: amount * 0.006 + 3,
        reason: 'Wise offers the best rates for NZD corridors.'
      };
    }

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
  static async executePayout(userId: string, amount: number, currency: string, region: string, seekerRegion: string = '', idempotencyKey?: string) {
    // Performer Safety: Enforce strict billing descriptors for high-risk regions
    let descriptor = 'DRAGDEM.com';
    if (['AE', 'SA', 'QA', 'KW'].includes(region)) {
      descriptor = 'DD EVENT SERVICES'; // Neutral descriptor for performer safety in UAE/Saudi Arabia
      console.log(`[PayoutEngine] Using neutral billing descriptor for user in ${region}: ${descriptor}`);
    }

    // Check regional compliance before proceeding
    const compliance = await ComplianceService.checkPayoutCompliance(userId, region);
    if (!compliance.compliant) {
      console.error(`[PayoutEngine] Payout blocked for user ${userId}: ${compliance.reason}`);
      return { success: false, error: compliance.reason };
    }

    // EU Tax & KSK Logic Integration
    if (seekerRegion) {
      const taxResult = await TaxService.calculateGlobalTax({
        amount,
        performerRegion: region,
        seekerRegion,
        performerTaxRegime: compliance.context?.taxRegime,
        hasTNumber: compliance.context?.hasTNumber
      });

      if (taxResult.withholdings.length > 0) {
        console.log(`[PayoutEngine] Tax Calculation for ${userId}:`, JSON.stringify(taxResult.withholdings));
        if (taxResult.isLiabilityToVenue) {
          console.log(`[PayoutEngine] KSK/Domestic Liability detected for Seeker in ${seekerRegion}. Amount to be collected from seeker: ${taxResult.withholdings.map(w => `${w.name}: ${amount * w.percent}`).join(', ')}`);
        }
      }
    }

    const decision = this.getOptimalProvider(region, currency, amount);
    console.log(`[PayoutEngine] Routing payout for user ${userId} to ${decision.provider}. Reason: ${decision.reason} | Idempotency-Key: ${idempotencyKey}`);

    switch (decision.provider) {
      case 'stripe':
        // Call existing Stripe logic
        return { success: true, provider: 'stripe', ref: `st_${idempotencyKey}` };
      case 'dlocal':
        // Call existing dLocal logic
        return { success: true, provider: 'dlocal', ref: `dl_${idempotencyKey}` };
      case 'wise':
        return await this.executeWiseTransfer(userId, amount, currency, idempotencyKey);
      case 'airwallex':
        return await this.executeAirwallexTransfer(userId, amount, currency, idempotencyKey);
      case 'mercadopago':
        return await this.executeMercadoPagoTransfer(userId, amount, currency);
      case 'bizum':
        return await this.executeBizumTransfer(userId, amount, currency);
      case 'interac':
        return await this.executeInteracTransfer(userId, amount, currency);
      case 'paypay':
        return await this.executePayPayTransfer(userId, amount, currency);
      case 'paybox':
        return await this.executePayBoxTransfer(userId, amount, currency);
      case 'swish':
        return await this.executeSwishTransfer(userId, amount, currency);
      case 'vipps':
        return await this.executeVippsTransfer(userId, amount, currency);
      case 'mobilepay':
        return await this.executeMobilePayTransfer(userId, amount, currency);
      case 'gcash':
        return await this.executeGCashTransfer(userId, amount, currency);
      case 'maya':
        return await this.executeMayaTransfer(userId, amount, currency);
      case 'momo':
        return await this.executeMoMoTransfer(userId, amount, currency);
      case 'kakaopay':
        return await this.executeKakaoPayTransfer(userId, amount, currency);
      case 'naverpay':
        return await this.executeNaverPayTransfer(userId, amount, currency);
      case 'nequi':
        return await this.executeNequiTransfer(userId, amount, currency);
      case 'daviplata':
        return await this.executeDaviPlataTransfer(userId, amount, currency);
      case 'promptpay':
        return await this.executePromptPayTransfer(userId, amount, currency, idempotencyKey);
    }
  }

  private static async executePromptPayTransfer(userId: string, amount: number, currency: string, idempotencyKey?: string) {
    /**
     * PromptPay Integration (Thailand):
     * Uses Stripe's Thailand Payout API or dLocal local rails.
     * For Phase 15, we prioritize direct real-time QR settlement.
     */
    console.log(`[PromptPay] Validating Thai PromptPay ID for user ${userId}...`);
    
    // Simulate lookup of user's PromptPay ID (Phone or National ID)
    const promptPayId = `TH_PP_${userId.substring(0, 8)}`;
    
    console.log(`[PromptPay] Initiating real-time QR transfer to ${promptPayId} for ${amount} ${currency} | Idempotency: ${idempotencyKey}`);
    
    const ppRef = `PP-QR-${Date.now()}-${userId.substring(0, 4)}`;
    
    // Simulate successful response from PromptPay gateway
    return { 
      success: true, 
      provider: 'promptpay', 
      reference: ppRef,
      targetId: promptPayId,
      status: 'COMPLETED',
      settlementTime: new Date().toISOString()
    };
  }

  private static async executeWiseTransfer(userId: string, amount: number, currency: string, idempotencyKey?: string) {
    console.log(`[Wise] Initiating transfer of ${amount} ${currency} for ${userId} | Idempotency: ${idempotencyKey}`);
    return { success: true, provider: 'wise', ref: `wise_${idempotencyKey || Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeAirwallexTransfer(userId: string, amount: number, currency: string, idempotencyKey?: string) {
    console.log(`[Airwallex] Initiating transfer of ${amount} ${currency} for ${userId} | Idempotency: ${idempotencyKey}`);
    return { success: true, provider: 'airwallex', ref: `awx_${idempotencyKey || Math.random().toString(36).substr(2, 9)}` };
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

  private static async executePayPayTransfer(userId: string, amount: number, currency: string) {
    /**
     * PayPay Integration (Japan):
     * Uses the PayPay Payout API.
     */
    console.log(`[PayPay] Authenticating with PayPay OAuth2...`);
    // Simulate API call to PayPay
    const receiverId = `pp_user_${userId.substring(0, 8)}`;
    const payoutId = `PAYPAY_${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    console.log(`[PayPay] POST /v1/payouts { receiver: ${receiverId}, amount: ${amount}, currency: ${currency} }`);
    
    // Simulate successful response
    return { 
      success: true, 
      provider: 'paypay', 
      transactionId: payoutId,
      receiverId: receiverId,
      status: 'PROCESSING',
      message: 'Payout request accepted by PayPay.' 
    };
  }

  private static async executePayBoxTransfer(userId: string, amount: number, currency: string) {
    /**
     * PayBox Integration (Israel):
     * Uses the PayBox Business API.
     */
    console.log(`[PayBox] Validating Israeli phone number for user ${userId}...`);
    // Simulate phone lookup
    const phoneNumber = '+97250' + Math.floor(Math.random() * 10000000);
    
    console.log(`[PayBox] Initiating transfer to ${phoneNumber} for ${amount} ${currency}`);
    
    const payboxRef = `PBX-${Date.now()}-${userId.substring(0, 4)}`;
    
    // Simulate successful response
    return { 
      success: true, 
      provider: 'paybox', 
      reference: payboxRef,
      phone: phoneNumber,
      status: 'COMPLETED'
    };
  }

  private static async executeSwishTransfer(userId: string, amount: number, currency: string) {
    console.log(`[Swish] Initiating real-time transfer for user ${userId}: ${amount} ${currency}`);
    // Swish requires a merchant certificate and a POST to /paymentrequests
    return { success: true, provider: 'swish', ref: `swish_${Date.now()}` };
  }

  private static async executeVippsTransfer(userId: string, amount: number, currency: string) {
    console.log(`[Vipps] Initiating transfer for user ${userId}: ${amount} ${currency}`);
    // Vipps eCom/Payout API
    return { success: true, provider: 'vipps', ref: `vipps_${Date.now()}` };
  }

  private static async executeMobilePayTransfer(userId: string, amount: number, currency: string) {
    console.log(`[MobilePay] Initiating transfer for user ${userId}: ${amount} ${currency}`);
    // MobilePay Payout API
    return { success: true, provider: 'mobilepay', ref: `mpay_${Date.now()}` };
  }

  private static async executeGCashTransfer(userId: string, amount: number, currency: string) {
    console.log(`[GCash] Payout to user ${userId}: ${amount} ${currency}`);
    return { success: true, provider: 'gcash', ref: `gc_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeMayaTransfer(userId: string, amount: number, currency: string) {
    console.log(`[Maya] Payout to user ${userId}: ${amount} ${currency}`);
    return { success: true, provider: 'maya', ref: `maya_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeMoMoTransfer(userId: string, amount: number, currency: string) {
    console.log(`[MoMo] Payout to user ${userId}: ${amount} ${currency}`);
    return { success: true, provider: 'momo', ref: `momo_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeKakaoPayTransfer(userId: string, amount: number, currency: string) {
    console.log(`[KakaoPay] Payout to user ${userId}: ${amount} ${currency}`);
    return { success: true, provider: 'kakaopay', ref: `kp_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeNaverPayTransfer(userId: string, amount: number, currency: string) {
    console.log(`[NaverPay] Payout to user ${userId}: ${amount} ${currency}`);
    return { success: true, provider: 'naverpay', ref: `np_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeNequiTransfer(userId: string, amount: number, currency: string) {
    console.log(`[Nequi] Payout to user ${userId}: ${amount} ${currency}`);
    return { success: true, provider: 'nequi', ref: `nequi_${Math.random().toString(36).substr(2, 9)}` };
  }

  private static async executeDaviPlataTransfer(userId: string, amount: number, currency: string) {
    console.log(`[DaviPlata] Payout to user ${userId}: ${amount} ${currency}`);
    return { success: true, provider: 'daviplata', ref: `dp_${Math.random().toString(36).substr(2, 9)}` };
  }
}

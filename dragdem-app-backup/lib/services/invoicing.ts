import { FeeCalculationParams, calculateFees } from '../utils/fees';

export interface InvoiceData {
  invoiceNumber: string;
  performer: {
    name: string;
    taxId: string;
    taxRegime?: string;
    postalCode?: string;
    address?: string;
    vatId?: string;
    abn?: string;      // Australia
    tNumber?: string;  // Japan
    rfc?: string;      // Mexico
    cpf?: string;      // Brazil
    cnpj?: string;     // Brazil
    steuernummer?: string; // Germany
    sin?: string;      // Canada
    dni?: string;      // Spain
    taiwanId?: string; // Taiwan
    cuil?: string;     // Argentina
  };
  seeker: {
    name: string;
    taxId?: string;
    isBusiness: boolean;
    address?: string;
    vatId?: string;
    abn?: string;      // Australia
    rfc?: string;      // Mexico
    cuil?: string;     // Argentina
  };
  booking: {
    id: string;
    date: string;
    description: string;
  };
  fees: ReturnType<typeof calculateFees>;
  currency: string;
  issuedAt: string;
  disclaimer?: string;
}

/**
 * Generates the structured data required for a compliant invoice.
 */
export function generateInvoiceData(
  booking: any,
  performer: any,
  seeker: any,
  options: {
    isB2B?: boolean;
    performerTaxRegime?: string;
    isResident?: boolean;
    performerVatRate?: number;
    totalRevenueYTD?: number;
    hasVerifiedABN?: boolean;
    isLaborOnly?: boolean;
    hasTNumber?: boolean;
  } = {}
): InvoiceData {
  const fees = calculateFees({
    amount: booking.total_fee,
    performerRegion: performer.region,
    seekerRegion: seeker.region,
    isB2B: options.isB2B,
    performerTaxRegime: options.performerTaxRegime || performer.tax_regime,
    performerVatRate: options.performerVatRate ?? performer.vat_rate,
    totalRevenueYTD: options.totalRevenueYTD,
    hasVerifiedABN: options.hasVerifiedABN,
    isLaborOnly: options.isLaborOnly,
    hasTNumber: options.hasTNumber,
  });

  const performerTaxId = performer.national_id;
  
  const invoiceData: InvoiceData = {
    invoiceNumber: `INV-${booking.id.substring(0, 8).toUpperCase()}`,
    performer: {
      name: performer.display_name || performer.full_name || 'Artist',
      taxId: performerTaxId,
      taxRegime: performer.tax_regime,
      postalCode: performer.postal_code,
      address: performer.address,
      vatId: performer.region === 'GB' ? performerTaxId : undefined,
      abn: performer.region === 'AU' ? performerTaxId : undefined,
      tNumber: performer.region === 'JP' ? performerTaxId : undefined,
      rfc: performer.region === 'MX' ? performerTaxId : undefined,
      cpf: (performer.region === 'BR' && performerTaxId.length === 11) ? performerTaxId : undefined,
      cnpj: (performer.region === 'BR' && performerTaxId.length === 14) ? performerTaxId : undefined,
      steuernummer: performer.region === 'DE' ? performerTaxId : undefined,
      sin: performer.region === 'CA' ? performerTaxId : undefined,
      dni: performer.region === 'ES' ? performerTaxId : undefined,
      taiwanId: performer.region === 'TW' ? performerTaxId : undefined,
      cuil: performer.region === 'AR' ? performerTaxId : undefined,
    },
    seeker: {
      name: seeker.business_name || seeker.full_name || 'Client',
      taxId: seeker.tax_id,
      isBusiness: seeker.verification_tier === 'corporate',
      address: seeker.address,
      vatId: seeker.region === 'GB' ? seeker.tax_id : undefined,
      abn: seeker.region === 'AU' ? seeker.tax_id : undefined,
      rfc: seeker.region === 'MX' ? seeker.tax_id : undefined,
      cuil: seeker.region === 'AR' ? seeker.tax_id : undefined,
    },
    booking: {
      id: booking.id,
      date: booking.event_date,
      description: `Performance by ${performer.display_name || 'Artist'}`,
    },
    fees,
    currency: booking.currency || 'USD',
    issuedAt: new Date().toISOString(),
  };

  // 4. Regional Disclaimers
  if (performer.region === 'DE') {
    // Kleinunternehmer status disclaimer
    if (options.totalRevenueYTD !== undefined && options.totalRevenueYTD < 22000) {
      invoiceData.disclaimer = 'Umsatzsteuerbefreit gemäß Kleinunternehmerregelung (§ 19 UStG).';
    }
    
    // KSK Liability disclaimer for venues
    if (fees.kskLiabilityAmount > 0) {
      const kskDisclaimer = 'Hinweis: Künstlersozialabgabe (KSK) ist vom Veranstalter zu tragen.';
      invoiceData.disclaimer = invoiceData.disclaimer 
        ? `${invoiceData.disclaimer} ${kskDisclaimer}` 
        : kskDisclaimer;
    }
  }

  if (performer.region === 'MX') {
    // Mexico CFDI 4.0 Placeholder
    invoiceData.disclaimer = 'Este comprobante es un borrador pro-forma. La factura electrónica CFDI 4.0 oficial será emitida tras la validación del SAT.';
  }

  if (performer.region === 'AR') {
    // Argentina Factura C Placeholder
    invoiceData.disclaimer = 'Comprobante provisorio. La Factura C electrónica oficial (AFIP) será generada al momento de la liquidación.';
  }

  return invoiceData;
}

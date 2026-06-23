import { FeeCalculationParams, calculateFees } from '../utils/fees';
import { XMLInvoicingService, SDIInvoiceData } from './xml-invoicing';
import { StealthService } from './stealth-service';

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
    orgNr?: string;    // SE, NO
    personnummer?: string; // SE
    cvr?: string;      // DK
    cpr?: string;      // DK
    ird?: string;      // NZ
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
    orgNr?: string;    // SE, NO
    cvr?: string;      // DK
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
    stealthMode?: boolean;
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
      name: options.stealthMode ? `Artist_${performer.id.substring(0, 5)}` : (performer.display_name || performer.full_name || 'Artist'),
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
      orgNr: ['SE', 'NO'].includes(performer.region) && performerTaxId.length === 10 ? performerTaxId : undefined,
      personnummer: performer.region === 'SE' && performerTaxId.length === 12 ? performerTaxId : undefined,
      cvr: performer.region === 'DK' && performerTaxId.length === 8 ? performerTaxId : undefined,
      cpr: performer.region === 'DK' && performerTaxId.length === 10 ? performerTaxId : undefined,
      ird: performer.region === 'NZ' ? performerTaxId : undefined,
    },
    seeker: {
      name: options.stealthMode ? 'Client (Private)' : (seeker.business_name || seeker.full_name || 'Client'),
      taxId: seeker.tax_id,
      isBusiness: seeker.verification_tier === 'corporate',
      address: seeker.address,
      vatId: seeker.region === 'GB' ? seeker.tax_id : undefined,
      abn: seeker.region === 'AU' ? seeker.tax_id : undefined,
      rfc: seeker.region === 'MX' ? seeker.tax_id : undefined,
      cuil: seeker.region === 'AR' ? seeker.tax_id : undefined,
      orgNr: ['SE', 'NO'].includes(seeker.region) && seeker.tax_id?.length === 10 ? seeker.tax_id : undefined,
      cvr: seeker.region === 'DK' && seeker.tax_id?.length === 8 ? seeker.tax_id : undefined,
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

  if (performer.region === 'FR') {
    // France Bill 96 Disclaimer
    const bill96Disclaimer = 'Conformément à la Loi 96, la version française de cette facture est la version officielle.';
    invoiceData.disclaimer = invoiceData.disclaimer 
      ? `${invoiceData.disclaimer} ${bill96Disclaimer}` 
      : bill96Disclaimer;

    if (options.performerTaxRegime === 'GUSO') {
      const gusoDisclaimer = 'Cette prestation est déclarée via le dispositif GUSO. Les cotisations sociales sont à la charge de l\'employeur.';
      invoiceData.disclaimer = `${invoiceData.disclaimer} ${gusoDisclaimer}`;
    }
  }

  if (performer.region === 'ES') {
    // Spain RETA Disclaimer
    const retaDisclaimer = 'Sujeto a retención de IRPF conforme a la normativa vigente en España.';
    invoiceData.disclaimer = invoiceData.disclaimer 
      ? `${invoiceData.disclaimer} ${retaDisclaimer}` 
      : retaDisclaimer;
  }

  if (performer.region === 'IT') {
    // Italy SDI Disclaimer
    const sdiDisclaimer = 'Questo è un pro-forma. La fattura elettronica ufficiale sarà trasmessa tramite il Sistema di Interscambio (SdI).';
    invoiceData.disclaimer = invoiceData.disclaimer 
      ? `${invoiceData.disclaimer} ${sdiDisclaimer}` 
      : sdiDisclaimer;
  }

  if (performer.region === 'IL') {
    // Israel Electronic Signature Disclaimer
    const ilDisclaimer = 'חשבונית מס/קבלה - מסมך ממוחשב חתום דיגיטלית (Electronic Invoice).';
    invoiceData.disclaimer = invoiceData.disclaimer 
      ? `${invoiceData.disclaimer} ${ilDisclaimer}` 
      : ilDisclaimer;
  }

  if (performer.region === 'JP') {
    // Japan JCT Qualified Invoice Disclaimer
    if (options.hasTNumber) {
      const jpDisclaimer = '適格請求書発行事業者登録番号: ' + performer.national_id + '。この請求書は日本の適格請求書等保存方式（インボイス制度）に対応しています。';
      invoiceData.disclaimer = invoiceData.disclaimer 
        ? `${invoiceData.disclaimer} ${jpDisclaimer}` 
        : jpDisclaimer;
    } else {
      const jpDisclaimer = 'この請求書は適格請求書ではありません。';
      invoiceData.disclaimer = invoiceData.disclaimer 
        ? `${invoiceData.disclaimer} ${jpDisclaimer}` 
        : jpDisclaimer;
    }
  }

  return invoiceData;
}

/**
 * Generates an Italian SDI compliant XML invoice if applicable.
 */
export function generateSDIInvoice(invoiceData: InvoiceData): string | null {
  if (invoiceData.performer.taxId && invoiceData.performer.taxId.length >= 11 && invoiceData.performer.address) {
    // Basic heuristic to check if it's an Italian performer (could be refined)
    // In a real app, we'd check the region property
    
    // We need the city, zip and country which might be parsed from the address or added to InvoiceData
    // For this implementation, we'll assume a standard format or extract what we can.
    
    const sdiData: SDIInvoiceData = {
      invoiceNumber: invoiceData.invoiceNumber,
      date: invoiceData.issuedAt,
      seller: {
        name: invoiceData.performer.name,
        taxId: invoiceData.performer.taxId,
        address: invoiceData.performer.address || 'Via Roma 1',
        city: 'Roma', // Placeholder if not parsed
        zip: invoiceData.performer.postalCode || '00100',
        country: 'IT'
      },
      buyer: {
        name: invoiceData.seeker.name,
        taxId: invoiceData.seeker.taxId || '00000000000',
        address: invoiceData.seeker.address || 'Address unknown',
        city: 'City',
        zip: '00000',
        country: 'IT' // Assume IT for SDI or use seeker region
      },
      items: [
        {
          description: invoiceData.booking.description,
          quantity: 1,
          unitPrice: invoiceData.fees.subtotal,
          vatRate: invoiceData.fees.appliedVatRate
        }
      ]
    };

    return XMLInvoicingService.generateSDIXML(sdiData);
  }
  return null;
}

/**
 * Generates a Polish KSeF compliant XML invoice if applicable.
 */
export function generateKSeFInvoice(invoiceData: InvoiceData): string | null {
  if (invoiceData.performer.taxId && invoiceData.performer.address) {
    // Basic heuristic or explicit region check
    // We'll assume the caller filtered by region === 'PL'
    
    const ksefData: SDIInvoiceData = {
      invoiceNumber: invoiceData.invoiceNumber,
      date: invoiceData.issuedAt,
      seller: {
        name: invoiceData.performer.name,
        taxId: invoiceData.performer.taxId,
        address: invoiceData.performer.address || 'Address unknown',
        city: 'Warszawa',
        zip: invoiceData.performer.postalCode || '00-001',
        country: 'PL'
      },
      buyer: {
        name: invoiceData.seeker.name,
        taxId: invoiceData.seeker.taxId || '0000000000',
        address: invoiceData.seeker.address || 'Address unknown',
        city: 'City',
        zip: '00-000',
        country: 'PL'
      },
      items: [
        {
          description: invoiceData.booking.description,
          quantity: 1,
          unitPrice: invoiceData.fees.subtotal,
          vatRate: invoiceData.fees.appliedVatRate
        }
      ]
    };

    return XMLInvoicingService.generateKSeFXML(ksefData);
  }
  return null;
}

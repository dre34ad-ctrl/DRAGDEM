
import { PayoutEngine } from '../lib/services/payout-engine';
import { XMLInvoicingService } from '../lib/services/xml-invoicing';

async function verifyLaunch() {
  console.log('--- GLOBAL PRODUCTION LAUNCH VERIFICATION ---');

  // 1. Verify Payout Routing
  const regions = ['SE', 'JP', 'PH', 'KR', 'AE', 'IT', 'PL', 'CO', 'VN'];
  console.log('\n[1] Verifying Payout Routing:');
  for (const region of regions) {
    const currency = region === 'SE' ? 'SEK' : region === 'JP' ? 'JPY' : region === 'PH' ? 'PHP' : region === 'KR' ? 'KRW' : region === 'AE' ? 'AED' : region === 'CO' ? 'COP' : region === 'VN' ? 'VND' : 'EUR';
    const decision = PayoutEngine.getOptimalProvider(region, currency, 100);
    console.log(`Region: ${region}, Provider: ${decision.provider}, Reason: ${decision.reason}`);
  }

  // 2. Verify XML Generation
  console.log('\n[2] Verifying XML Invoicing Integrity:');
  const mockData = {
    invoiceNumber: 'INV-2024-001',
    date: '2024-05-26',
    seller: { name: 'Artist Pro', taxId: 'IT12345678901', address: 'Via Roma 1', city: 'Rome', zip: '00100', country: 'IT' },
    buyer: { name: 'Venue Italy', taxId: 'IT98765432109', address: 'Via Milano 2', city: 'Milan', zip: '20100', country: 'IT', sdiCode: '1234567' },
    items: [{ description: 'Performance', quantity: 1, unitPrice: 500, vatRate: 0.22 }]
  };

  const sdiXml = XMLInvoicingService.generateSDIXML(mockData);
  console.log('\nItalian SdI XML (Snippet):');
  console.log(sdiXml.substring(0, 300) + '...');
  if (!sdiXml.includes('<CodiceDestinatario>1234567</CodiceDestinatario>')) {
      throw new Error('Italian SDI XML generation failed validation.');
  }

  const ksefXml = XMLInvoicingService.generateKSeFXML({
    ...mockData,
    seller: { ...mockData.seller, country: 'PL', taxId: 'PL1234567890' },
    buyer: { ...mockData.buyer, country: 'PL', taxId: 'PL0987654321' }
  });
  console.log('\nPolish KSeF XML (Snippet):');
  console.log(ksefXml.substring(0, 300) + '...');
  if (!ksefXml.includes('<KodKraju>PL</KodKraju>')) {
      throw new Error('Polish KSeF XML generation failed validation (Typo not fixed?).');
  }

  console.log('\n--- VERIFICATION COMPLETE ---');
}

verifyLaunch().catch(console.error);

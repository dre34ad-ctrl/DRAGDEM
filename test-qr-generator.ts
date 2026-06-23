import { PromptPayQR } from './lib/utils/promptpay-qr';

function testPromptPayQR() {
  console.log('--- Testing PromptPay QR Generator ---');
  
  const testCases = [
    {
      id: '0812345678',
      idType: 'PHONE' as const,
      amount: 100.50,
      description: 'Phone number with amount'
    },
    {
      id: '1234567890123',
      idType: 'ID' as const,
      description: 'National ID (Static)'
    }
  ];

  testCases.forEach((tc, i) => {
    console.log(`\nTest Case ${i + 1}: ${tc.description}`);
    const payload = PromptPayQR.generatePayload(tc);
    console.log('ID:', tc.id);
    console.log('Payload:', payload);
    
    // Basic structural checks
    if (!payload.startsWith('000201')) {
      console.error('FAIL: Payload should start with 000201');
    }
    if (tc.amount && !payload.includes('54')) {
      console.error('FAIL: Payload with amount should contain tag 54');
    }
    if (!payload.includes('5303764')) {
      console.error('FAIL: Payload should contain currency 764 (THB)');
    }
    if (!payload.includes('5802TH')) {
      console.error('FAIL: Payload should contain country code TH');
    }
    
    const imageUrl = PromptPayQR.getImageUrl(tc);
    console.log('Image URL:', imageUrl);
  });
}

testPromptPayQR();

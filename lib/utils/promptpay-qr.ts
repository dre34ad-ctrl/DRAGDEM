/**
 * PromptPay QR Code Generator Utility (EMVCo Standard)
 * Based on Thailand's PromptPay specification.
 */

export type PromptPayIDType = 'PHONE' | 'ID' | 'BILLER';

export interface PromptPayQRParams {
  id: string; // Phone number (08x...), National ID, or Biller ID
  idType: PromptPayIDType;
  amount?: number;
}

export class PromptPayQR {
  /**
   * Generates the raw PromptPay payload string.
   */
  static generatePayload(params: PromptPayQRParams): string {
    const { id, idType, amount } = params;

    // 1. Format ID
    let formattedId = id.replace(/[^0-9]/g, '');
    if (idType === 'PHONE') {
      // Must be 13 digits: 0066 + phone without leading 0
      if (formattedId.startsWith('0')) {
        formattedId = '0066' + formattedId.substring(1);
      } else if (formattedId.startsWith('66')) {
        formattedId = '00' + formattedId;
      }
      formattedId = formattedId.padStart(13, '0');
    }

    // 2. Merchant Account Information (Tag 29)
    const aid = 'A000000677010111';
    const merchantAccountInfo = 
      this.f('00', aid) + 
      this.f('01', formattedId);
    
    // 3. Assemble Payload
    let payload = 
      this.f('00', '01') +                          // Payload Format Indicator
      this.f('01', amount ? '12' : '11') +           // Point of Initiation (11=Static, 12=Dynamic)
      this.f('29', merchantAccountInfo) +           // Merchant Account Info
      this.f('53', '764') +                         // Currency (THB)
      this.f('58', 'TH');                           // Country Code

    if (amount) {
      payload += this.f('54', amount.toFixed(2));    // Transaction Amount
    }

    payload += '6304'; // CRC Tag

    // 4. Calculate CRC
    const crc = this.crc16(payload);
    return payload + crc;
  }

  /**
   * Helper to format EMVCo fields (Tag + Length + Value)
   */
  private static f(tag: string, value: string): string {
    const length = value.length.toString().padStart(2, '0');
    return tag + length + value;
  }

  /**
   * CRC16-CCITT (0x1021, init 0xFFFF)
   */
  private static crc16(data: string): string {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
      let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xFF;
      x ^= x >> 4;
      crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  /**
   * Returns a URL for the QR code image using a public API.
   * Useful for the pilot until a local generator is added.
   */
  static getImageUrl(params: PromptPayQRParams): string {
    const payload = this.generatePayload(params);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
  }
}

import { teamDb } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface FXRate {
  rate: number;
  finalRate: number;
  fee: number;
  expiresIn: number;
}

export class FXService {
  /**
   * Mock FX service with expanded regional coverage
   */
  static async getRate(from: string, to: string): Promise<FXRate> {
    const mockRates: Record<string, number> = {
      'USD_BRL': 5.20,
      'USD_THB': 35.50,
      'USD_MXN': 17.50,
      'USD_JPY': 155.0,
      'USD_EUR': 0.92,
      'USD_AUD': 1.50,
      'USD_CAD': 1.36,
    };
    
    const pair = `${from.toUpperCase()}_${to.toUpperCase()}`;
    const rate = mockRates[pair] || 1.0;
    const corridorFee = 0.015; // 1.5% for international corridors
    
    return {
      rate,
      fee: corridorFee,
      finalRate: rate * (1 - corridorFee),
      expiresIn: 3600, // 1 hour for generic rates
    };
  }

  /**
   * Locks the rate for a specific user for 15 minutes (Volatility Protection)
   */
  static async lockRate(userId: string, from: string, to: string): Promise<{ lockId: string; rate: number; expiresAt: string }> {
    const { finalRate } = await this.getRate(from, to);
    const lockId = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await teamDb(`INSERT INTO payout_rate_locks (id, user_id, from_currency, to_currency, rate, expires_at) 
      VALUES ('${lockId}', '${userId}', '${from}', '${to}', ${finalRate}, '${expiresAt}')`);

    return {
      lockId,
      rate: finalRate,
      expiresAt,
    };
  }

  /**
   * Retrieves a locked rate if it's still valid
   */
  static async getLockedRate(lockId: string, userId: string): Promise<number | null> {
    const locks = await teamDb(`SELECT rate FROM payout_rate_locks 
      WHERE id = '${lockId}' AND user_id = '${userId}' AND expires_at > CURRENT_TIMESTAMP`);
    
    if (locks.length === 0) return null;
    return locks[0].rate;
  }
}

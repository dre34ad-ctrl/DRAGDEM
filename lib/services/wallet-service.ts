import { teamDb } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface WalletBalances {
  [currency: string]: number;
}

export interface Wallet {
  id: string;
  user_id: string;
  balances: WalletBalances;
  last_updated: string;
}

export class WalletService {
  /**
   * Retrieves a user's wallet. Creates one if it doesn't exist.
   */
  static async getWallet(userId: string): Promise<Wallet> {
    const results = await teamDb(`SELECT * FROM wallets WHERE user_id = '${userId}'`);
    
    if (results.length > 0) {
      const wallet = results[0];
      return {
        ...wallet,
        balances: JSON.parse(wallet.balances)
      };
    }

    // Create new wallet
    const id = uuidv4();
    const balances = {};
    await teamDb(`INSERT INTO wallets (id, user_id, balances) VALUES ('${id}', '${userId}', '{}')`);
    
    return {
      id,
      user_id: userId,
      balances,
      last_updated: new Date().toISOString()
    };
  }

  /**
   * Adds funds to a user's wallet for a specific currency.
   */
  static async addFunds(userId: string, amount: number, currency: string): Promise<WalletBalances> {
    const wallet = await this.getWallet(userId);
    const balances = wallet.balances;
    
    const curr = currency.toUpperCase();
    balances[curr] = (balances[curr] || 0) + amount;
    
    await teamDb(`UPDATE wallets SET balances = '${JSON.stringify(balances)}', last_updated = CURRENT_TIMESTAMP WHERE user_id = '${userId}'`);
    
    return balances;
  }

  /**
   * Deducts funds from a user's wallet. Throws if insufficient balance.
   */
  static async deductFunds(userId: string, amount: number, currency: string): Promise<WalletBalances> {
    const wallet = await this.getWallet(userId);
    const balances = wallet.balances;
    
    const curr = currency.toUpperCase();
    const currentBalance = balances[curr] || 0;
    
    if (currentBalance < amount) {
      throw new Error(`Insufficient balance in ${curr}. Required: ${amount}, Available: ${currentBalance}`);
    }
    
    balances[curr] = currentBalance - amount;
    
    await teamDb(`UPDATE wallets SET balances = '${JSON.stringify(balances)}', last_updated = CURRENT_TIMESTAMP WHERE user_id = '${userId}'`);
    
    return balances;
  }
}

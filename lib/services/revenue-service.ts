import { teamDb } from '../db';

export type FeeType = 'platform_fee' | 'subscription';

export interface LedgerEntry {
  transactionId: string;
  revenueAmount: number;
  currency: string;
  feeType: FeeType;
  customerId: string;
  customerRegion?: string;
  customerTaxStatus?: string;
}

export class RevenueService {
  /**
   * Records a revenue event in the platform ledger.
   * This is used for fiscal monitoring and audit trails.
   */
  static async recordRevenue(entry: LedgerEntry) {
    // Basic sanitization for SQL string literals
    const transactionId = entry.transactionId.replace(/'/g, "''");
    const currency = entry.currency.toUpperCase();
    const feeType = entry.feeType;
    const customerId = entry.customerId.replace(/'/g, "''");
    const customerRegion = (entry.customerRegion || '').replace(/'/g, "''");
    const customerTaxStatus = (entry.customerTaxStatus || 'non-VAT').replace(/'/g, "''");

    console.log(`[RevenueService] Recording ${entry.revenueAmount} ${currency} (${feeType}) for customer ${customerId}`);

    const sql = `
      INSERT INTO platform_revenue_ledger 
      (transaction_id, revenue_amount, currency, fee_type, customer_id, customer_region, customer_tax_status)
      VALUES 
      ('${transactionId}', ${entry.revenueAmount}, '${currency}', '${feeType}', '${customerId}', '${customerRegion}', '${customerTaxStatus}')
    `;
    
    return await teamDb(sql);
  }
}

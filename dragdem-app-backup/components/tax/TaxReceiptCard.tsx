'use client';

interface TaxReceiptProps {
  bookingId: string;
  type: 'NFSE' | 'WHT';
  amount: number;
  currency: string;
  issuer: string;
  taxWithheld?: number;
}

export const TaxReceiptCard = ({ bookingId, type, amount, currency, issuer, taxWithheld }: TaxReceiptProps) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            {type === 'NFSE' ? 'Brazil: NFS-e' : 'Thailand: WHT (50 TAWI)'}
          </h4>
          <p className="text-white font-mono text-sm">Booking #{bookingId}</p>
        </div>
        <div className="bg-gray-900 px-2 py-1 rounded text-[10px] font-bold text-gray-500 border border-gray-800">
          DIGITAL RECEIPT
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Issuer</p>
          <p className="text-sm font-bold text-gray-200">{issuer}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">
            {type === 'NFSE' ? 'Document Type' : 'Certificate'}
          </p>
          <p className="text-xs text-gray-300">
            {type === 'NFSE' ? 'Nota Fiscal de Serviços Eletrônica' : 'Withholding Tax Certificate (Ph.D.50 Tawi)'}
          </p>
        </div>
        {taxWithheld && (
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Tax Withheld (3%)</p>
            <p className="text-sm font-bold text-pink-500">{currency} {taxWithheld.toLocaleString()}</p>
          </div>
        )}
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Total Value</p>
          <p className="text-lg font-bold text-white">{currency} {amount.toLocaleString()}</p>
        </div>
      </div>

      <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-lg text-sm transition shadow-lg">
        Download PDF
      </button>
    </div>
  );
};

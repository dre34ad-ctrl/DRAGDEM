'use client';

import React, { useState } from 'react';

interface PayoutMetadata {
  region: 'BR' | 'TH' | 'EU' | 'ROW';
  method: string;
  pixKeyType?: 'email' | 'phone' | 'CPF' | 'random_key';
  pixKeyValue?: string;
  recipientCpf?: string;
  promptPayIdType?: 'phone' | 'NationalID';
  promptPayIdValue?: string;
  bankAccount?: string;
  bankName?: string;
}

export const PayoutMetadataEditor: React.FC<{ initialData?: PayoutMetadata; onSave: (data: PayoutMetadata) => void }> = ({ initialData, onSave }) => {
  const [region, setRegion] = useState(initialData?.region || 'BR');
  const [pixKeyType, setPixKeyType] = useState(initialData?.pixKeyType || 'email');
  const [pixKeyValue, setPixKeyValue] = useState(initialData?.pixKeyValue || '');
  const [recipientCpf, setRecipientCpf] = useState(initialData?.recipientCpf || '');
  const [promptPayIdType, setPromptPayIdType] = useState(initialData?.promptPayIdType || 'phone');
  const [promptPayIdValue, setPromptPayIdValue] = useState(initialData?.promptPayIdValue || '');

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl border border-pink-500/30">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>🏦</span> Payout Information
      </h2>

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Primary Region</label>
        <div className="flex gap-2">
          {['BR', 'TH', 'EU', 'ROW'].map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${
                region === r ? 'bg-pink-600 border-pink-500' : 'bg-gray-800 border-gray-700 hover:border-gray-500'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {region === 'BR' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-sm text-gray-400 mb-1">PIX Key Type</label>
            <select 
              value={pixKeyType} 
              onChange={(e) => setPixKeyType(e.target.value as any)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-pink-500 outline-none"
            >
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
              <option value="CPF">CPF (Tax ID)</option>
              <option value="random_key">Random Key</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">PIX Key Value</label>
            <input 
              type="text" 
              value={pixKeyValue}
              onChange={(e) => setPixKeyValue(e.target.value)}
              placeholder="Enter your PIX key..."
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Recipient CPF (Mandatory for FX)</label>
            <input 
              type="text" 
              value={recipientCpf}
              onChange={(e) => setRecipientCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-pink-500 outline-none"
            />
          </div>
        </div>
      )}

      {region === 'TH' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-sm text-gray-400 mb-1">PromptPay ID Type</label>
            <select 
              value={promptPayIdType} 
              onChange={(e) => setPromptPayIdType(e.target.value as any)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-pink-500 outline-none"
            >
              <option value="phone">Phone Number</option>
              <option value="NationalID">National ID</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">PromptPay ID Value</label>
            <input 
              type="text" 
              value={promptPayIdValue}
              onChange={(e) => setPromptPayIdValue(e.target.value)}
              placeholder="Enter your PromptPay ID..."
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-pink-500 outline-none"
            />
          </div>
        </div>
      )}

      {(region === 'EU' || region === 'ROW') && (
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400">
          Standard Stripe Connect onboarding will be used for this region.
        </div>
      )}

      <button 
        onClick={() => onSave({ region, method: region === 'BR' ? 'PIX' : region === 'TH' ? 'PromptPay' : 'Stripe', pixKeyType, pixKeyValue, recipientCpf, promptPayIdType, promptPayIdValue })}
        className="w-full mt-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 py-3 rounded-lg font-bold transition shadow-lg"
      >
        Save Payout Method
      </button>
    </div>
  );
};

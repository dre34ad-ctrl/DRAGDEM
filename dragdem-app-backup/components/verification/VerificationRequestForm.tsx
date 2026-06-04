'use client';

import React, { useState } from 'react';
import { submitVerificationRequest, VERIFICATION_TIERS } from '../../lib/supabase/verification';
import { SupabaseMediaUpload } from '../upload/SupabaseMediaUpload';

export const VerificationRequestForm = ({ seekerId }: { seekerId: string }) => {
  const [tier, setTier] = useState<keyof typeof VERIFICATION_TIERS>('VERIFIED');
  const [businessEmail, setBusinessEmail] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [documents, setDocuments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.length === 0) {
      alert('Please upload at least one supporting document.');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitVerificationRequest({
        seekerId,
        tier,
        documents,
        businessEmail: tier === 'CORPORATE' ? businessEmail : undefined,
        linkedinProfile: tier === 'CORPORATE' ? linkedinProfile : undefined,
      });
      alert('Verification request submitted successfully!');
    } catch (error) {
      alert('Error submitting request: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadComplete = (url: string) => {
    setDocuments((prev) => [...prev, url]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl border border-pink-500/20 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Upgrade Verification Tier</h2>
      
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Target Tier</label>
        <div className="flex gap-4">
          {Object.keys(VERIFICATION_TIERS).filter(k => k !== 'STANDARD').map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTier(k as any)}
              className={`flex-1 py-3 rounded-xl font-bold border transition ${
                tier === k ? 'bg-pink-600 border-pink-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
            >
              {k.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {tier === 'CORPORATE' && (
        <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Business Email</label>
            <input 
              type="email" 
              value={businessEmail} 
              onChange={(e) => setBusinessEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">LinkedIn Company Profile</label>
            <input 
              type="url" 
              value={linkedinProfile} 
              onChange={(e) => setLinkedinProfile(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
              placeholder="https://linkedin.com/company/..."
              required
            />
          </div>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-sm text-gray-400 mb-2">Supporting Documents (PDF/Images)</label>
        <SupabaseMediaUpload 
          bucket="verification-docs" 
          onUploadComplete={handleUploadComplete}
          allowedTypes={['application/pdf', 'image/jpeg', 'image/png']}
        />
        {documents.length > 0 && (
          <ul className="mt-4 space-y-1">
            {documents.map((doc, i) => (
              <li key={i} className="text-xs text-gray-400 truncate">
                📄 {doc}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/20 disabled:opacity-50 transition"
      >
        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  );
};

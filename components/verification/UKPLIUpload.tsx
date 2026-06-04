'use client';

import React, { useState } from 'react';
import { Shield, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface UKPLIUploadProps {
  initialStatus?: 'unverified' | 'pending' | 'verified';
  onUpload: (file: File) => void;
}

export const UKPLIUpload: React.FC<UKPLIUploadProps> = ({ initialStatus = 'unverified', onUpload }) => {
  const [status, setStatus] = useState(initialStatus);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setStatus('pending');
      onUpload(file);
    }
  };

  return (
    <div className="bg-surface border border-gray-800 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${status === 'verified' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
            <Shield size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Public Liability Insurance (UK)</h3>
            <p className="text-xs text-gray-500 font-inter">Required for most UK venues (£5M+ cover recommended).</p>
          </div>
        </div>
        
        {status === 'verified' ? (
          <div className="flex items-center gap-1 px-3 py-1 bg-accent/20 border border-accent/30 rounded-full">
            <CheckCircle2 size={12} className="text-accent" />
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Verified Badge</span>
          </div>
        ) : status === 'pending' ? (
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
            <AlertCircle size={12} className="text-yellow-500" />
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Pending Review</span>
          </div>
        ) : null}
      </div>

      {status === 'unverified' && (
        <div className="relative group">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
          />
          <div className="border-2 border-dashed border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center gap-3 group-hover:border-primary/50 transition-all bg-deep/50">
            <Upload size={24} className="text-gray-600 group-hover:text-primary transition-colors" />
            <p className="text-xs font-bold text-gray-500 group-hover:text-gray-300">Upload PLI Certificate (PDF/JPG)</p>
          </div>
        </div>
      )}

      {(status === 'pending' || status === 'verified') && fileName && (
        <div className="flex items-center justify-between p-4 bg-deep rounded-xl border border-gray-800">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-primary" />
            <span className="text-xs font-medium text-gray-300">{fileName}</span>
          </div>
          <button 
            onClick={() => { setStatus('unverified'); setFileName(null); }}
            className="text-[10px] font-bold text-gray-500 uppercase hover:text-red-500 transition-colors"
          >
            Replace
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
        <p className="text-[10px] text-gray-500 leading-relaxed italic">
          * UK venues often require proof of PLI before arrival. Verified status allows seekers to download your certificate directly with their booking confirmation.
        </p>
      </div>
    </div>
  );
};

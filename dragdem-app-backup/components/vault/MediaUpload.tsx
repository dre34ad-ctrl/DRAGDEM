
'use client';

import { useState, useRef } from 'react';
import { uploadVaultAsset } from '@/lib/actions/vault';
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface MediaUploadProps {
  onUploadComplete: (url: string) => void;
  category: 'vault' | 'profile' | 'reel';
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export const MediaUpload = ({
  onUploadComplete,
  category,
  allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg'],
  maxSizeMB = 100
}: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert(`File type ${file.type} not allowed.`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File too large. Max size is ${maxSizeMB}MB.`);
      return;
    }

    setIsUploading(true);
    setStatus('uploading');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      
      const asset = await uploadVaultAsset(formData);

      setStatus('success');
      onUploadComplete(asset.url);
      
      setTimeout(() => {
        setStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleUpload}
        accept={allowedTypes.join(',')}
      />
      
      <div 
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-500
          ${status === 'uploading' ? 'border-yellow-500/50 bg-yellow-500/5' : 
            status === 'success' ? 'border-green-500/50 bg-green-500/5' :
            status === 'error' ? 'border-red-500/50 bg-red-500/5' :
            'border-white/10 bg-white/5 hover:border-yellow-500/30 hover:bg-white/10'}
        `}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full py-12 px-6 flex flex-col items-center justify-center space-y-4"
        >
          {status === 'uploading' ? (
            <>
              <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest text-yellow-500">Uploading...</p>
                <p className="text-xs text-white/40 mt-1">Processing your media...</p>
              </div>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest text-green-500">Upload Complete</p>
                <p className="text-xs text-white/40 mt-1">Ready for the stage.</p>
              </div>
            </>
          ) : status === 'error' ? (
            <>
              <AlertCircle className="w-10 h-10 text-red-500" />
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest text-red-500">Upload Failed</p>
                <p className="text-xs text-white/40 mt-1">Please try again.</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-full bg-yellow-500/10 text-yellow-500 group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest text-white">Add to Vault</p>
                <p className="text-xs text-white/40 mt-1">Images, Video (MP4), or Audio (MP3)</p>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

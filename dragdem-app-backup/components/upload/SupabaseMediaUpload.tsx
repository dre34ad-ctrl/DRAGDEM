'use client';

import { useState, useRef } from 'react';
import { createClient } from '../../lib/supabase/client';

interface MediaUploadProps {
  onUploadComplete: (url: string) => void;
  bucket: 'vault-media' | 'vault-assets' | 'press-photos' | 'act-clips' | 'verification-docs';
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export const SupabaseMediaUpload = ({ 
  onUploadComplete, 
  bucket, 
  allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'], 
  maxSizeMB = 50 
}: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

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

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // For public buckets, we can get a public URL
      // For private buckets, we'll store the path and the admin will generate a signed URL
      let finalUrl = filePath;
      if (bucket === 'press-photos' || bucket === 'act-clips') {
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        finalUrl = publicUrl;
      }

      onUploadComplete(finalUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleUpload}
        accept={allowedTypes.join(',')}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
      >
        {isUploading ? `Uploading...` : 'Select File'}
      </button>
    </div>
  );
};

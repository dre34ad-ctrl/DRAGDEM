'use client';

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';

interface MediaUploadProps {
  onUploadComplete: (url: string) => void;
  category: 'vault' | 'profile' | 'reel';
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export const MediaUpload = ({ 
  onUploadComplete, 
  category, 
  allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'], 
  maxSizeMB = 50 
}: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload', // We'll draft the server side too
        clientPayload: JSON.stringify({ category }),
        onUploadProgress: (progressEvent) => {
          setProgress(progressEvent.percentage);
        },
      });

      onUploadComplete(newBlob.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setProgress(0);
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
        {isUploading ? `Uploading ${progress}%...` : 'Select File'}
      </button>
    </div>
  );
};

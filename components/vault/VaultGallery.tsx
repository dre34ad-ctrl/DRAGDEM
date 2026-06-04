
'use client';

import { useState } from 'react';
import { VaultAsset, deleteVaultAsset } from '@/lib/actions/vault';
import { Play, Music, Image as ImageIcon, Trash2, ExternalLink, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VaultGalleryProps {
  assets: VaultAsset[];
  isOwner?: boolean;
  onSelect?: (asset: VaultAsset) => void;
  selectedAssetId?: string;
}

export const VaultGallery = ({ assets, isOwner, onSelect, selectedAssetId }: VaultGalleryProps) => {
  const [filter, setStatus] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const filteredAssets = assets.filter(asset => filter === 'all' || asset.type === filter);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this from your vault?')) return;
    setIsDeleting(id);
    try {
      await deleteVaultAsset(id);
      router.refresh();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete asset.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {['all', 'image', 'video', 'audio'].map((type) => (
          <button
            key={type}
            onClick={() => setStatus(type as any)}
            className={`
              px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
              ${filter === type 
                ? 'bg-yellow-600 text-black shadow-[0_0_15px_rgba(202,138,4,0.4)]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <div 
            key={asset.id}
            className={`
              group relative aspect-square rounded-2xl overflow-hidden border transition-all duration-500
              ${selectedAssetId === asset.id ? 'border-yellow-500 ring-2 ring-yellow-500/50' : 'border-white/10 hover:border-yellow-500/30'}
              bg-charcoal-900
            `}
          >
            {/* Asset Content */}
            <div className="absolute inset-0">
              {asset.type === 'image' ? (
                <img src={asset.url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              ) : asset.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <Play className="w-12 h-12 text-yellow-500/50 group-hover:scale-110 transition-transform" />
                  <video src={asset.url} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-charcoal-800 to-black">
                  <Music className="w-12 h-12 text-yellow-500/50 group-hover:scale-110 transition-transform" />
                </div>
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="flex gap-2">
                  {onSelect ? (
                    <button
                      onClick={() => onSelect(asset)}
                      className={`
                        p-2 rounded-full transition-colors
                        ${selectedAssetId === asset.id ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white hover:bg-yellow-500 hover:text-black'}
                      `}
                    >
                      {selectedAssetId === asset.id ? <Check className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    </button>
                  ) : (
                    <a 
                      href={asset.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 text-white hover:bg-yellow-500 hover:text-black transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {isOwner && (
                  <button
                    onClick={() => handleDelete(asset.id)}
                    disabled={isDeleting === asset.id}
                    className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isDeleting === asset.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Type Icon Tag */}
            <div className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
              {asset.type === 'image' ? <ImageIcon className="w-3 h-3 text-white/70" /> : 
               asset.type === 'video' ? <Play className="w-3 h-3 text-white/70" /> : 
               <Music className="w-3 h-3 text-white/70" />}
            </div>
          </div>
        ))}

        {filteredAssets.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-gray-500 uppercase tracking-widest text-xs font-black">No assets found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Camera, Video, Image, Link as LinkIcon, MapPin, Sparkles, Loader2, CheckCircle2, X } from 'lucide-react';
import { createPulsePost } from '@/lib/actions/pulse';
import { MediaUpload } from '../vault/MediaUpload';
import { VaultGallery } from '../vault/VaultGallery';
import { getMyVaultAssets, VaultAsset } from '@/lib/actions/vault';

interface BackstageComposerProps {
  performerName: string;
  initialGlowLevel?: number;
}

export const BackstageComposer: React.FC<BackstageComposerProps> = ({ performerName, initialGlowLevel = 5 }) => {
  const [content, setContent] = useState('');
  const [glowLevel, setGlowLevel] = useState(initialGlowLevel);
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [showVault, setShowVault] = useState(false);
  const [vaultAssets, setVaultAssets] = useState<VaultAsset[]>([]);
  const [linkedAssetId, setLinkedAssetId] = useState<string | null>(null);

  useEffect(() => {
    if (showVault) {
      getMyVaultAssets().then(setVaultAssets).catch(console.error);
    }
  }, [showVault]);

  const handlePublish = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        await createPulsePost({ 
          content,
          category: 'backstage',
          media_url: mediaUrl || undefined,
          linked_asset_id: linkedAssetId || undefined
        });
        setContent('');
        setMediaUrl(null);
        setLinkedAssetId(null);
        setGlowLevel(prev => Math.min(10, prev + 1));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error('Failed to publish post:', error);
        alert('Failed to publish post. Please try again.');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface border-2 border-secondary/30 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(112,0,255,0.15)] transition-all hover:border-secondary/50">
      {/* Header with Glow Meter */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-playfair italic text-2xl text-primary">Share Your Pulse</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20">
          <Sparkles size={14} className="text-secondary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-secondary">
            Ranking Boost: +{glowLevel * 10}%
          </span>
        </div>
      </div>

      {/* Text Area */}
      <div className="mb-6 group relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening backstage?"
          disabled={isPending}
          className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-hidden focus:border-primary/50 transition-all resize-none font-inter leading-relaxed disabled:opacity-50"
        />
        {mediaUrl && (
          <div className="mt-4 relative inline-block">
            <img src={mediaUrl} alt="Upload preview" className="h-32 rounded-lg object-cover" />
            <button 
              onClick={() => { setMediaUrl(null); setLinkedAssetId(null); }}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {showSuccess && (
          <div className="absolute inset-0 bg-deep/80 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="text-accent" size={32} />
              <span className="text-accent font-black uppercase tracking-widest text-xs">Pulse Published!</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick-Capture & Vault Bar */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <MediaUpload 
          category="vault"
          onUploadComplete={(url) => setMediaUrl(url)}
        />
        
        <button 
          onClick={() => setShowVault(!showVault)}
          className={`flex flex-col items-center justify-center gap-2 h-full rounded-xl transition-all group ${showVault ? 'bg-luxury-gold/20 border-luxury-gold' : 'bg-luxury-gold/5 border-luxury-gold/30'} border`}
        >
          <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">💎</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold/80">Link Vault Asset</span>
        </button>
      </div>

      {/* Vault Selection UI */}
      {showVault && (
        <div className="mb-6 p-6 bg-black/60 backdrop-blur-md border border-luxury-gold/20 rounded-2xl shadow-2xl animate-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-luxury-gold flex items-center gap-2">
              <Sparkles size={14} className="animate-pulse" />
              Your Vault Library
            </h4>
            <button onClick={() => setShowVault(false)} className="text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            <VaultGallery 
              assets={vaultAssets} 
              onSelect={(asset) => {
                setMediaUrl(asset.url);
                setLinkedAssetId(asset.id);
                setShowVault(false);
              }}
              selectedAssetId={linkedAssetId || undefined}
            />
          </div>
        </div>
      )}

      {/* Tags Placeholder */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['#Backstage', '#Costumes', '#Rehearsals'].map(tag => (
          <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 cursor-pointer hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition-all">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-accent">
          <MapPin size={16} />
          <span className="text-xs font-medium">Add Location</span>
        </div>
        <button 
          className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
          onClick={handlePublish}
          disabled={isPending || !content.trim()}
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Publish to Pulse'}
        </button>
      </div>
    </div>
  );
};

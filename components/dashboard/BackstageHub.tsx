'use client';

import React, { useState } from 'react';
import { 
  Rocket, 
  Sparkles, 
  Plus, 
  Layout, 
  ChevronRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { updateSearchPriority, applyForSpotlight } from '@/lib/actions/pro-dashboard';

interface BackstageHubProps {
  visibility: {
    searchPriority: number;
    spotlightStatus: 'none' | 'applied' | 'active';
  };
  content: {
    backstagePosts: number;
    vaultAssets: number;
  };
  onNewPost?: () => void;
}

export const BackstageHub: React.FC<BackstageHubProps> = ({ visibility, content, onNewPost }) => {
  const [isBoosting, setIsBoosting] = useState(false);
  const [priority, setPriority] = useState(visibility.searchPriority);
  const [spotlightStatus, setSpotlightStatus] = useState(visibility.spotlightStatus);
  const [isApplying, setIsApplying] = useState(false);

  const handleBoost = async () => {
    setIsBoosting(true);
    try {
      const newPriority = priority === 10 ? 0 : 10;
      await updateSearchPriority(newPriority);
      setPriority(newPriority);
    } catch (error) {
      console.error('Boost failed', error);
    } finally {
      setIsBoosting(false);
    }
  };

  const handleApplySpotlight = async () => {
    if (spotlightStatus !== 'none') return;
    setIsApplying(true);
    try {
      await applyForSpotlight();
      setSpotlightStatus('applied');
    } catch (error) {
      console.error('Spotlight application failed', error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl h-full">
      <h2 className="text-xl font-montserrat font-bold uppercase tracking-wider flex items-center gap-3 mb-8">
        <Rocket className="text-primary" size={24} />
        Backstage Hub
      </h2>

      <div className="space-y-6">
        {/* Visibility Boost Control */}
        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-white mb-1">Search Visibility Boost</h3>
              <p className="text-xs text-gray-400">Increase your profile priority in local searches.</p>
            </div>
            <button 
              onClick={handleBoost}
              disabled={isBoosting}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${priority > 0 ? 'bg-primary' : 'bg-gray-700'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${priority > 0 ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-1.5 flex-1 rounded-full overflow-hidden bg-gray-800`}>
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${(priority / 10) * 100}%` }} 
              />
            </div>
            <span className="text-[10px] font-black text-primary uppercase">{priority > 0 ? 'ACTIVE' : 'INACTIVE'}</span>
          </div>
        </div>

        {/* Spotlight Status */}
        <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-secondary" size={20} />
              <h3 className="font-bold text-white">Editorial Spotlight</h3>
            </div>
            {spotlightStatus === 'active' ? (
              <span className="text-[10px] font-black text-secondary bg-secondary/20 px-2 py-1 rounded-md uppercase tracking-widest animate-pulse">LIVE NOW</span>
            ) : spotlightStatus === 'applied' ? (
              <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md uppercase tracking-widest">IN REVIEW</span>
            ) : null}
          </div>
          
          {spotlightStatus === 'none' ? (
            <>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Apply for a premium editorial feature on our homepage and Pulse magazine.
              </p>
              <button 
                onClick={handleApplySpotlight}
                disabled={isApplying}
                className="w-full py-3 bg-secondary hover:bg-secondary/90 disabled:bg-gray-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isApplying ? <Loader2 size={14} className="animate-spin" /> : 'APPLY FOR SPOTLIGHT'}
              </button>
            </>
          ) : spotlightStatus === 'applied' ? (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
              <p className="text-[10px] text-gray-400 font-medium italic">
                Our curation team is reviewing your media kit. Expect a response in 3-5 days.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-xl border border-secondary/20">
              <Sparkles className="text-secondary shrink-0" size={18} />
              <p className="text-[10px] text-white font-bold uppercase tracking-wider">
                Currently featured: "The Neon-Noir Collection"
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onNewPost}
            className="flex flex-col items-center justify-center p-6 bg-deep/50 border border-white/5 rounded-2xl hover:border-primary/50 transition-all group"
          >
            <div className="p-3 bg-primary/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Plus className="text-primary" size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Post</span>
            <span className="text-[10px] text-gray-600 mt-1">{content.backstagePosts} Posts</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-6 bg-deep/50 border border-white/5 rounded-2xl hover:border-luxury-gold/50 transition-all group">
            <div className="p-3 bg-luxury-gold/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Layout className="text-luxury-gold" size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manage Vault</span>
            <span className="text-[10px] text-gray-600 mt-1">{content.vaultAssets} Assets</span>
          </button>
        </div>
      </div>
    </div>
  );
};

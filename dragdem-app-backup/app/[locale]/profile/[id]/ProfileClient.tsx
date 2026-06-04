'use client';

import React, { useState } from 'react';
import { Star, Play, Music, Film, Lock } from "lucide-react";
import { BackstagePost } from "@/components/pulse/BackstagePost";
import { VaultGallery } from "@/components/vault/VaultGallery";
import { MediaUpload } from "@/components/vault/MediaUpload";
import { VaultAsset } from '@/lib/actions/vault';

interface ProfileClientProps {
  profile: any;
  backstagePosts: any[];
  vaultAssets: VaultAsset[];
  isOwner: boolean;
}

export default function ProfileClient({ profile, backstagePosts, vaultAssets, isOwner }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState('media');

  const tabs = [
    { id: 'media', label: 'Media' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'backstage', label: 'Backstage' },
    { id: 'vault', label: 'The Vault' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Tab Navigation */}
      <div className="flex gap-8 mb-12 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full shadow-[0_0_10px_#FF00FF]" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="md:col-span-2">
          {activeTab === 'media' && (
            <div className="space-y-16">
              <section>
                <h2 className="glamour-heading text-3xl mb-6 text-primary border-b border-gray-800 pb-2 font-serif italic">Biography</h2>
                <div className="text-gray-300 text-lg leading-relaxed font-inter whitespace-pre-wrap">
                  {profile.bio}
                </div>
              </section>

              <section>
                <h2 className="glamour-heading text-3xl mb-8 text-secondary border-b border-gray-800 pb-2 flex items-center gap-3 font-serif italic">
                  <Play className="text-secondary" /> Performance Reels & Acts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video bg-surface rounded-xl border border-gray-800 flex items-center justify-center group cursor-pointer relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center z-10">
                        <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center pl-1 shadow-lg shadow-primary/20">
                          <Play size={24} fill="white" className="text-white" />
                        </div>
                      </div>
                      <div className="text-[10px] absolute bottom-3 left-3 z-20 bg-black/80 px-2 py-1 rounded text-white font-black uppercase tracking-widest border border-white/10">Hero Reel 2026</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-video bg-surface rounded-xl border border-gray-800 flex items-center justify-center group cursor-pointer relative overflow-hidden">
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center z-10">
                          <Play size={24} className="text-white opacity-50 group-hover:opacity-100" />
                       </div>
                       <div className="text-[10px] absolute bottom-3 left-3 z-20 bg-black/80 px-2 py-1 rounded text-white font-black uppercase tracking-widest border border-white/10">Full Act: "Vogue"</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="glamour-heading text-3xl mb-8 text-accent border-b border-gray-800 pb-2 flex items-center gap-3 font-serif italic">
                  <Music className="text-accent" /> Audio Highlights
                </h2>
                <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-800 flex items-center justify-between hover:bg-gray-800/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent border border-accent/20">
                        <Music size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white uppercase text-sm tracking-wide">Signature Entrance Mix</p>
                        <p className="text-xs text-gray-500 font-bold">0:45 • High-Energy Pop</p>
                      </div>
                    </div>
                    <Play size={18} className="text-gray-600 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'backstage' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {backstagePosts.map((post) => (
                <BackstagePost 
                  key={post.id} 
                  id={post.id}
                  category={post.category}
                  content={post.content}
                  date={new Date(post.created_at).toLocaleDateString()}
                  imageUrl={post.media_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                  initialSnaps={42} // placeholder until we have real snaps
                  vaultLink={post.asset ? { id: post.asset.id, name: post.asset.name } : undefined}
                />
              ))}
              {backstagePosts.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-gray-500 uppercase tracking-widest text-xs font-black">No backstage updates yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-dashed border-gray-800">
              <Star className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 font-bold uppercase tracking-widest">No reviews yet for this performer.</p>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-12">
              {isOwner && (
                <div className="bg-white/5 border border-yellow-600/30 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center text-yellow-600">
                      <Star size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-widest text-white">Vault Management</h3>
                      <p className="text-sm text-gray-500">Add new assets to your professional repertoire.</p>
                    </div>
                  </div>
                  <MediaUpload 
                    category="vault" 
                    onUploadComplete={() => {
                      // refresh handled by server action revalidate or manual refresh
                      window.location.reload();
                    }} 
                  />
                </div>
              )}

              {isOwner ? (
                <VaultGallery assets={vaultAssets} isOwner={true} />
              ) : (
                <div className="bg-gray-900/40 p-12 rounded-3xl border border-yellow-600/20 text-center">
                  <div className="w-20 h-20 bg-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 border border-yellow-600/30 shadow-[0_0_20px_rgba(202,138,4,0.1)]">
                    <Lock size={32} />
                  </div>
                  <h3 className="text-2xl font-serif italic text-white mb-4">The Drag Vault</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-8">
                    Premium assets, high-fidelity tracks, and exclusive content are available for Verified Seekers only.
                  </p>
                  <button className="bg-yellow-600 text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition shadow-lg shadow-yellow-600/20">
                    Unlock Access
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-12">
          <section className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-800 shadow-2xl">
            <h3 className="font-montserrat font-black text-xs mb-8 text-gray-500 uppercase tracking-[0.3em] border-l-4 border-primary pl-4">Measurements</h3>
            <div className="space-y-6">
              {[
                { label: 'Height', value: "6'1\" (in heels)" },
                { label: 'Chest', value: '40\"' },
                { label: 'Waist', value: '32\"' },
                { label: 'Shoe', value: '11 (Women\'s)' },
              ].map((m) => (
                <div key={m.label} className="flex justify-between border-b border-gray-800/50 pb-3">
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                  <span className="font-bold text-white text-sm">{m.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-montserrat font-black text-xs mb-8 text-gray-500 uppercase tracking-[0.3em] border-l-4 border-secondary pl-4">Technical Rider</h3>
            <div className="space-y-4">
              <div className="bg-surface/40 p-6 rounded-2xl border border-gray-800 hover:border-accent/40 transition-colors">
                <h4 className="font-black text-cyan-400 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <Star size={14} /> Audio & Visual
                </h4>
                <ul className="space-y-3 text-gray-400 text-xs font-bold leading-relaxed">
                  {profile.tech_audio.map((item: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 shadow-xl">
             <h3 className="font-montserrat font-black text-xs mb-8 text-gray-500 uppercase tracking-[0.3em] border-l-4 border-accent pl-4 flex items-center gap-2">
               <Film size={16} /> Media Credits
             </h3>
             <div className="space-y-6">
               {[
                 { title: 'Global Drag Showdown', desc: 'Season 4 Finalist | Network TV' },
                 { title: 'Lip Sync Legends', desc: 'Winner | Web Series' },
               ].map((c, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_8px_#22D3EE]" />
                    <div>
                      <p className="font-bold text-white text-xs uppercase tracking-tight">{c.title}</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-1">{c.desc}</p>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}

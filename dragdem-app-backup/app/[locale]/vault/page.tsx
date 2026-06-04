'use client';

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Plus, Search, Filter, Sparkles, Star, ShieldCheck, History } from "lucide-react";
import { VaultGallery } from "@/components/vault/VaultGallery";
import { MediaUpload } from "@/components/vault/MediaUpload";
import { getMyVaultAssets, VaultAsset } from "@/lib/actions/vault";

export default function VaultPage() {
  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const data = await getMyVaultAssets();
      setAssets(data);
    } catch (error) {
      console.error("Failed to fetch vault assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: "Total Assets", value: assets.length, icon: <Star size={16} />, color: "text-primary" },
    { label: "Media Files", value: assets.filter(a => a.type !== 'document').length, icon: <Sparkles size={16} />, color: "text-accent" },
    { label: "Verified", value: assets.length, icon: <ShieldCheck size={16} />, color: "text-green-500" },
    { label: "Last Updated", value: "Today", icon: <History size={16} />, color: "text-gray-500" },
  ];

  return (
    <main className="min-h-screen bg-black pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white">The Drag Vault</h1>
              <span className="bg-luxury-gold text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Pro</span>
            </div>
            <p className="text-gray-500 font-medium">Secure, high-fidelity storage for your professional portfolio.</p>
          </div>
          
          <button 
            onClick={() => setShowUpload(!showUpload)}
            className="bg-primary hover:bg-primary/90 text-white font-black py-4 px-8 rounded-2xl shadow-[0_0_30px_rgba(255,0,255,0.3)] transition-all flex items-center gap-3 text-sm uppercase tracking-widest group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            {showUpload ? 'Close Upload' : 'Add New Asset'}
          </button>
        </div>

        {/* Upload Zone */}
        {showUpload && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white/5 border border-primary/30 rounded-3xl p-8 backdrop-blur-xl">
              <MediaUpload 
                category="vault"
                onUploadComplete={() => {
                  fetchAssets();
                  setShowUpload(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-surface/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm group hover:border-white/10 transition-colors">
              <div className={`mb-4 ${stat.color} bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search your library..." 
              className="w-full bg-surface/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-gray-600 focus:outline-hidden focus:border-primary/50 focus:bg-surface transition-all font-medium"
            />
          </div>
          <div className="flex gap-3">
             <button className="bg-surface/60 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-3 hover:border-white/20 transition-all text-xs font-black uppercase tracking-widest text-gray-400">
               <Filter size={18} />
               <span>Filter</span>
             </button>
          </div>
        </div>

        {/* Asset Grid */}
        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full shadow-[0_0_20px_rgba(255,0,255,0.2)]" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Loading Vault...</p>
          </div>
        ) : (
          <VaultGallery assets={assets} isOwner={true} />
        )}
      </div>
    </main>
  );
}

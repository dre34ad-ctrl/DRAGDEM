'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Search, 
  Plus, 
  Zap,
  X,
  Loader2
} from 'lucide-react';
import { getFestivalData, getMasterRiderAction, searchPerformersForInvite } from '@/lib/actions/festival';

export default function FestivalRosterManager() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerformers, setSelectedPerformers] = useState<string[]>([]);
  const [festivalData, setFestivalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [masterRider, setMasterRider] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [proOnly, setProOnly] = useState(false);

  const festivalId = 'FEST-2026-BERLIN'; // In a real app, this comes from props or URL

  useEffect(() => {
    async function fetchFestival() {
      try {
        const res = await getFestivalData(festivalId);
        setFestivalData(res);
      } catch (err) {
        console.error('Failed to fetch festival data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFestival();
  }, [festivalId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery) {
        const results = await searchPerformersForInvite(searchQuery, proOnly);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, proOnly]);

  const handleViewMasterRider = async () => {
    if (festivalData?.stages?.[0]) {
      const rider = await getMasterRiderAction(festivalData.stages[0].id, '2026-06-15');
      setMasterRider(rider);
      setIsModalOpen(true);
    }
  };

  const togglePerformer = (id: string) => {
    setSelectedPerformers(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const stages = festivalData?.stages || [];
  const slots = festivalData?.slots || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-secondary shadow-glow-cyan animate-pulse" />
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Institutional Logistics</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-playfair flex items-center gap-4 text-white italic tracking-tighter">
            {festivalData?.festival?.name.toUpperCase() || 'FESTIVAL SCHEDULER'}
          </h2>
          <p className="text-gray-500 font-bold mt-2 uppercase tracking-[0.2em] text-xs">
            {festivalData?.festival?.location || 'Berlin'} <span className="text-luxury-gold mx-2">|</span> June 15 - 17, 2026
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleViewMasterRider}
            className="px-8 py-3 border border-secondary/30 text-secondary rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary/10 hover:border-secondary transition-all shadow-glow-cyan/5"
          >
            Master Tech Rider
          </button>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-glow-magenta/20 hover:scale-105 transition-all"
          >
            Bulk Invite
          </button>
        </div>
      </div>

      {/* Scheduler Grid */}
      <div className="glass-panel rounded-[2rem] overflow-hidden border-white/5 shadow-2xl">
        <div className="grid grid-cols-[200px_1fr] border-b border-white/5">
          <div className="bg-deep-charcoal p-4 font-bold text-[10px] uppercase tracking-[0.3em] text-gray-500">Stage Arena</div>
          <div className="p-4 flex justify-between text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
            <span>18:00</span>
            <span>20:00</span>
            <span>22:00</span>
            <span>00:00</span>
            <span>02:00</span>
            <span>04:00</span>
          </div>
        </div>

        {stages.map((stage: any) => (
          <div key={stage.id} className="grid grid-cols-[200px_1fr] border-b border-white/5 last:border-0">
            <div className="bg-deep-charcoal p-6 font-black flex items-center border-r border-white/5 text-white uppercase text-[10px] tracking-[0.3em]">
              {stage.name}
            </div>
            <div className="relative h-28 bg-black/20 backdrop-blur-sm">
              <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-20">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="border-r border-luxury-gold/20 h-full" />
                ))}
              </div>
              
              {slots.filter((s: any) => s.stage_id === stage.id).map((slot: any) => {
                const hour = new Date(slot.start_time).getHours();
                const left = ((hour >= 18 ? hour - 18 : hour + 6) / 12) * 100;
                
                return (
                  <div 
                    key={slot.id}
                    className={`absolute top-4 bottom-4 glass-panel border-l-4 rounded-xl p-4 shadow-2xl hover:scale-[1.02] cursor-pointer transition-all ${
                      slot.is_pro ? 'border-secondary shadow-glow-cyan/10' : 'border-primary shadow-glow-magenta/10'
                    }`}
                    style={{ left: `${left}%`, width: '16%' }}
                  >
                    <div className="font-black text-white truncate text-[10px] tracking-wider mb-1">{slot.performer_name.toUpperCase()}</div>
                    <div className="text-gray-500 font-bold text-[9px] uppercase tracking-widest">{new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Invite Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-md bg-surface border-l border-gray-800 z-50 p-8 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold font-montserrat text-white tracking-widest">BULK INVITE</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Search Performers</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input 
                    type="text" 
                    placeholder="e.g. Circus, Aerial, Comedy..." 
                    className="w-full bg-deep border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary transition-colors text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Certification Level</label>
                <select 
                  className="w-full bg-deep border border-gray-800 rounded-xl py-3 px-4 text-sm focus:border-primary transition-colors appearance-none text-white"
                  onChange={(e) => setProOnly(e.target.value === 'pro')}
                >
                  <option value="all">All Certifications</option>
                  <option value="pro">Institutional Pro Only</option>
                </select>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {(searchQuery ? searchResults : []).map((p: any) => (
                  <div 
                    key={p.id}
                    onClick={() => togglePerformer(p.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPerformers.includes(p.id) 
                        ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' 
                        : 'bg-deep border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-luxury-gold">
                      {p.stage_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-white">{p.stage_name}</div>
                      <div className={`text-[10px] font-bold uppercase tracking-tight ${
                        p.institutional_badge ? 'text-accent' : 'text-gray-500'
                      }`}>
                        {p.institutional_badge ? 'Institutional Pro' : 'Standard Member'}
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      selectedPerformers.includes(p.id) ? 'bg-primary border-primary' : 'border-gray-700'
                    }`}>
                      {selectedPerformers.includes(p.id) && <Zap size={12} className="text-white fill-current" />}
                    </div>
                  </div>
                ))}

                {searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-10 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    No matching performers found
                  </div>
                )}
              </div>

              <button 
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
                  selectedPerformers.length > 0 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02]' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
                disabled={selectedPerformers.length === 0}
              >
                Send Invitations ({selectedPerformers.length} selected)
              </button>
            </div>
          </div>
        </>
      )}

      {/* Tech Aggregator Modal */}
      {isModalOpen && masterRider && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-surface border border-accent/30 rounded-3xl p-10 shadow-3xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold font-montserrat mb-2 text-white">MASTER TECHNICAL RIDER</h3>
            <p className="text-accent font-bold text-xs uppercase tracking-widest mb-10">Stage: {masterRider.stage_id} | Date: {masterRider.date}</p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-deep p-6 rounded-2xl border-b-4 border-primary">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Audio Channels</div>
                <div className="font-bold text-white mb-1">{masterRider.aggregated_needs.audio_channels}x Total</div>
                <div className="text-[10px] text-gray-400">Aggregated for all acts</div>
              </div>
              <div className="bg-deep p-6 rounded-2xl border-b-4 border-accent">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Hospitality</div>
                <div className="font-bold text-white mb-1">{masterRider.performer_summaries.length}x Riders</div>
                <div className="text-[10px] text-gray-400">Individual needs below</div>
              </div>
              <div className="bg-deep p-6 rounded-2xl border-b-4 border-primary">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Production</div>
                <div className="font-bold text-white mb-1">Standard Wash</div>
                <div className="text-[10px] text-gray-400">DMX Center Spotlight</div>
              </div>
            </div>

            <div className="bg-black/50 p-8 rounded-2xl border border-gray-800 mb-10 max-h-64 overflow-y-auto">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                <Users size={16} className="text-primary" />
                Performer Summary
              </h4>
              <div className="space-y-4">
                {masterRider.performer_summaries.map((p: any) => (
                  <div key={p.performer_id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <p className="text-sm text-gray-300">
                      <span className="font-bold text-white">{p.stage_name}:</span> {p.rider?.technical_notes || 'Standard setup.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-accent text-black font-bold rounded-xl uppercase tracking-widest text-xs hover:scale-[1.02] transition-all">
                Download Master Rider PDF
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 border border-gray-700 text-gray-400 font-bold rounded-xl uppercase tracking-widest text-xs hover:border-white hover:text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

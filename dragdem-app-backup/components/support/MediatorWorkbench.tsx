'use client';

import { useState } from 'react';
import { 
  ShieldAlert, 
  Scale, 
  MessageSquare, 
  FileText, 
  Lock, 
  Unlock,
  AlertTriangle,
  ChevronRight,
  Download,
  Info,
  Loader2
} from 'lucide-react';
import { resolveDisputeAction } from '@/lib/actions/dispute-resolution';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface DisputeData {
  id: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  escrowTotal: number;
  currency: string;
  performerName: string;
  seekerName: string;
  bookingDate: string;
  eventContext: string;
  technicalRider: string;
  cueSheet: string;
  seekerStatement: string;
  performerStatement: string;
  seekerEvidence: { type: 'image' | 'video' | 'document'; url: string; timestamp: string }[];
  performerEvidence: { type: 'image' | 'video' | 'document'; url: string; timestamp: string }[];
  chatLogs: { role: 'seeker' | 'performer' | 'system'; text: string; timestamp: string }[];
  bookingId: string;
}

export const MediatorWorkbench = ({ disputeData }: { disputeData: DisputeData }) => {
  const router = useRouter();
  const t = useTranslations('support');
  
  const [resolution, setResolution] = useState<'release' | 'refund' | 'partial'>('partial');
  const [percentage, setPercentage] = useState(50);
  const [internalNotes, setInternalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorityColors = {
    low: 'text-blue-400 bg-blue-900/20 border-blue-900/50',
    medium: 'text-yellow-400 bg-yellow-900/20 border-yellow-900/50',
    high: 'text-orange-400 bg-orange-900/20 border-orange-900/50',
    critical: 'text-red-400 bg-red-900/20 border-red-900/50 animate-pulse',
  };

  const handleExecuteResolution = async () => {
    if (!confirm('Are you sure you want to finalize this resolution? This action is irreversible.')) return;
    
    setIsSubmitting(true);
    try {
      await resolveDisputeAction({
        disputeId: disputeData.id,
        bookingId: disputeData.bookingId,
        resolution,
        percentage,
        internalNotes
      });
      alert('Resolution executed successfully.');
      router.refresh();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-pink-500/30">
      {/* 1. Header: Persistent Case Intelligence */}
      <header className="h-20 border-b border-white/5 bg-[#0d0d10] flex items-center justify-between px-8 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500/60">{t('mediator_workbench')}</span>
              <span className="h-1 w-1 rounded-full bg-white/20"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('case_id')} #DD-{disputeData.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              {t('mediator_workbench')}
              <span className={`px-2 py-0.5 rounded text-[10px] border uppercase tracking-wider font-black ${priorityColors[disputeData.priority]}`}>
                {disputeData.priority} {t('priority')}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('escrow_vault')}</span>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <Lock className="w-4 h-4 text-pink-500" />
              <span className="text-2xl font-black font-mono text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: disputeData.currency }).format(disputeData.escrowTotal)}
              </span>
              <span className="text-[10px] font-black text-pink-500 bg-pink-500/10 px-1.5 py-0.5 rounded">{t('locked')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Sidebar: Agreed Terms & Contract */}
        <aside className="w-[320px] border-r border-white/5 bg-[#0d0d10]/50 overflow-y-auto flex flex-col custom-scrollbar">
          <div className="p-6 space-y-8">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                <FileText className="w-3 h-3 text-pink-500" /> {t('binding_agreement')}
              </h3>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-white/30 uppercase block mb-1">Booking Date</label>
                  <p className="text-sm font-medium">{disputeData.bookingDate}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/30 uppercase block mb-1">Event Context</label>
                  <p className="text-sm leading-relaxed">{disputeData.eventContext}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-3 h-3 text-cyan-500" /> {t('technical_rider')}
              </h3>
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <p className="text-xs text-cyan-200/70 leading-relaxed whitespace-pre-wrap text-wrap">
                  {disputeData.technicalRider}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">{t('cue_sheet_highlights')}</h3>
              <div className="space-y-2">
                {disputeData.cueSheet.split('\n').map((cue, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="w-1 h-1 rounded-full bg-pink-500"></span>
                    <span className="text-xs">{cue}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* 3. Center Pane: Evidence Comparison Grid */}
        <main className="flex-1 bg-black/40 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="grid grid-cols-2 gap-8">
              {/* Seeker Evidence */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-pink-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span> {t('seeker_claim')}
                  </h2>
                  <span className="text-[10px] font-bold text-white/40">{disputeData.seekerName}</span>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 ring-1 ring-pink-500/20">
                  <p className="text-sm italic leading-relaxed text-slate-300">
                    "{disputeData.seekerStatement}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {disputeData.seekerEvidence.map((item, i) => (
                    <div key={i} className="group relative aspect-video bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-pink-500/50 transition-all cursor-zoom-in">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-[10px] font-bold text-white uppercase">{item.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-center h-full relative">
                        {item.type === 'image' ? (
                          <img src={item.url} alt="Evidence" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <Download className="w-6 h-6 text-white/10 group-hover:text-pink-500 transition-colors" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performer Evidence */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span> {t('performer_rebuttal')}
                  </h2>
                  <span className="text-[10px] font-bold text-white/40">{disputeData.performerName}</span>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 ring-1 ring-cyan-500/20">
                  <p className="text-sm italic leading-relaxed text-slate-300">
                    "{disputeData.performerStatement}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {disputeData.performerEvidence.map((item, i) => (
                    <div key={i} className="group relative aspect-video bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-cyan-500/50 transition-all cursor-zoom-in">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-[10px] font-bold text-white uppercase">{item.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-center h-full relative">
                        {item.type === 'image' ? (
                          <img src={item.url} alt="Evidence" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <Download className="w-6 h-6 text-white/10 group-hover:text-cyan-500 transition-colors" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Interaction Log */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <MessageSquare className="w-4 h-4 text-white/40" />
                <h2 className="text-sm font-black uppercase tracking-widest text-white/60">{t('external_chat')}</h2>
                <div className="flex-1 h-px bg-white/5"></div>
                <span className="text-[10px] font-bold text-white/20 uppercase">{t('immutable_log')}</span>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {disputeData.chatLogs.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'seeker' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'seeker' 
                        ? 'bg-white/5 border border-white/10 rounded-tl-none' 
                        : msg.role === 'performer' 
                        ? 'bg-pink-500/10 border border-pink-500/20 text-pink-100 rounded-tr-none'
                        : 'bg-white/10 border border-white/20 text-white/60 italic w-full text-center rounded-none'
                    }`}>
                      <div className="flex items-center gap-2 mb-2 opacity-40 text-[10px] font-black uppercase tracking-tighter">
                        <span>{msg.role}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* 4. Right Sidebar: Resolution & Action Matrix */}
        <aside className="w-[400px] border-l border-white/5 bg-[#0d0d10] overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-12">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
                <Scale className="w-4 h-4 text-pink-500" /> {t('action_matrix')}
              </h3>
              
              <div className="grid gap-3">
                <button 
                  disabled={isSubmitting}
                  onClick={() => setResolution('release')}
                  className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    resolution === 'release' 
                      ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${resolution === 'release' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/40'}`}>
                    <Unlock className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold">{t('release_funds')}</div>
                    <div className="text-[10px] text-white/40 uppercase font-black">100% to Performer</div>
                  </div>
                </button>

                <button 
                  disabled={isSubmitting}
                  onClick={() => setResolution('refund')}
                  className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    resolution === 'refund' 
                      ? 'bg-red-500/10 border-red-500/50 ring-1 ring-red-500/50' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${resolution === 'refund' ? 'bg-red-500 text-white' : 'bg-white/5 text-white/40'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold">{t('full_refund')}</div>
                    <div className="text-[10px] text-white/40 uppercase font-black">100% Return to Seeker</div>
                  </div>
                </button>

                <div className={`p-6 rounded-xl border space-y-6 transition-all ${
                  resolution === 'partial' 
                    ? 'bg-pink-500/10 border-pink-500/50 ring-1 ring-pink-500/50' 
                    : 'bg-white/5 border-white/10'
                }`}>
                  <button disabled={isSubmitting} onClick={() => setResolution('partial')} className="flex items-center gap-4 w-full">
                    <div className={`p-2 rounded-lg ${resolution === 'partial' ? 'bg-pink-500 text-white' : 'bg-white/5 text-white/40'}`}>
                      <Scale className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">{t('partial_refund')}</div>
                      <div className="text-[10px] text-white/40 uppercase font-black">Custom Split Ratio</div>
                    </div>
                  </button>

                  {resolution === 'partial' && (
                    <div className="space-y-6 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-end">
                        <div className="text-center">
                          <div className="text-2xl font-black text-white">{percentage}%</div>
                          <div className="text-[10px] font-black uppercase text-white/40">Seeker</div>
                        </div>
                        <div className="h-px flex-1 bg-white/10 mx-4 mb-3"></div>
                        <div className="text-center">
                          <div className="text-2xl font-black text-pink-500">{100-percentage}%</div>
                          <div className="text-[10px] font-black uppercase text-pink-500/40">Performer</div>
                        </div>
                      </div>
                      <input 
                        disabled={isSubmitting}
                        type="range" min="0" max="100" value={percentage} 
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        className="w-full accent-pink-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                  <Info className="w-3 h-3" /> {t('internal_notes')}
                </h3>
                <span className="text-[10px] font-bold text-pink-500 bg-pink-500/10 px-1.5 py-0.5 rounded">{t('private')}</span>
              </div>
              <textarea 
                disabled={isSubmitting}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Document your reasoning for the resolution..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm h-40 focus:border-pink-500/50 outline-none transition-all placeholder:text-white/20 leading-relaxed"
              ></textarea>
            </section>

            <button 
              disabled={isSubmitting}
              onClick={handleExecuteResolution}
              className="w-full bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(219,39,119,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {t('finalize_resolution')}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

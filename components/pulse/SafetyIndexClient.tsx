'use client';

import React from 'react';
import { ShieldAlert, Star, MapPin, MessageSquare, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface VenueSafetyReport {
  venue_name: string;
  location: string;
  avg_rating: string;
  report_count: number;
  descriptions: string[];
  dates: string[];
}

interface SafetyIndexClientProps {
  reports: VenueSafetyReport[];
}

export const SafetyIndexClient = ({ reports }: SafetyIndexClientProps) => {
  const { locale } = useParams();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-7xl font-serif italic text-white leading-tight">
            Safety <br/><span className="text-[#FF00FF] drop-shadow-[0_0_15px_rgba(255,0,255,0.4)]">Index</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl leading-relaxed uppercase tracking-widest font-light">
            Community-Driven Venue Intelligence
          </p>
        </div>
        
        <Link 
          href={`/${locale}/community/safety/report`}
          className="inline-flex items-center justify-center px-10 py-5 bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(255,0,255,0.3)] self-start md:self-center"
        >
          Submit Safety Report
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {reports.length === 0 ? (
          <div className="col-span-full py-20 bg-zinc-900/30 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white/5 rounded-full">
              <ShieldAlert className="text-gray-600" size={32} />
            </div>
            <p className="text-gray-500 text-sm font-medium">No reports filed yet. Be the first to contribute.</p>
          </div>
        ) : (
          reports.map((venue, idx) => {
            const isElite = parseFloat(venue.avg_rating) >= 4.5;
            return (
              <div 
                key={idx}
                className={`bg-zinc-900/50 border ${isElite ? 'border-[#D4AF37]/30' : 'border-white/5'} rounded-[2.5rem] p-8 backdrop-blur-2xl hover:border-[#00FFFF]/30 transition-all group overflow-hidden relative`}
              >
                {/* Safety Seal for Elite Venues */}
                {isElite && (
                  <div className="absolute top-6 right-8 flex flex-col items-center gap-1 group-hover:scale-110 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] via-[#F7EF8A] to-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                      <ShieldCheck className="text-black" size={32} />
                    </div>
                    <span className="text-[8px] font-black text-[#D4AF37] tracking-tighter">VERIFIED SAFE</span>
                  </div>
                )}
                
                {/* Background Glow */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 ${isElite ? 'bg-[#D4AF37]/5' : 'bg-[#FF00FF]/5'} blur-[80px] rounded-full group-hover:bg-[#00FFFF]/5 transition-all`} />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start pr-20">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#00FFFF] mb-1">
                        <MapPin size={12} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{venue.location}</span>
                      </div>
                      <h3 className="text-3xl font-black text-white group-hover:text-[#00FFFF] transition-colors leading-none">
                        {venue.venue_name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37] font-black text-2xl">{venue.avg_rating}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={14} 
                            className={`${
                              parseFloat(venue.avg_rating) >= star 
                                ? 'fill-[#D4AF37] text-[#D4AF37]' 
                                : 'text-gray-800'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
                      BASED ON {venue.report_count} {venue.report_count === 1 ? 'REPORT' : 'REPORTS'}
                    </span>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MessageSquare size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Community Feedback</span>
                    </div>
                    <div className="space-y-3">
                      {venue.descriptions.slice(0, 2).map((desc, i) => (
                        <div key={i} className="bg-black/40 p-5 rounded-2xl border border-white/5 relative">
                          <p className="text-[12px] text-gray-300 leading-relaxed italic">
                            "{desc}"
                          </p>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="text-[#00FFFF]" size={10} />
                              <span className="text-[8px] text-[#00FFFF]/70 font-black uppercase tracking-widest italic">Verified Performer</span>
                            </div>
                            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">
                              {new Date(venue.dates[i]).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#00FFFF] transition-all">
                      View full report →
                    </button>
                    <button className="px-5 py-4 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl transition-all group/btn">
                      <AlertTriangle size={16} className="text-gray-600 group-hover/btn:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

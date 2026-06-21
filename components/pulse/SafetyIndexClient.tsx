'use client';

import React from 'react';
import { ShieldAlert, Star, MapPin, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
          <h1 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
            Community <br/><span className="text-pink-600">Safety Index</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
            A real-time, decentralized safety database for performers. Verified ratings and reviews on venue environments, labor safety, and payment reliability.
          </p>
        </div>
        
        <Link 
          href={`/${locale}/community/safety/report`}
          className="inline-flex items-center justify-center px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all shadow-glow-pink/30 self-start md:self-center"
        >
          Submit New Report
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
          reports.map((venue, idx) => (
            <div 
              key={idx}
              className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-2xl hover:border-pink-500/20 transition-all group overflow-hidden relative"
            >
              {/* Background Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-600/5 blur-[80px] rounded-full group-hover:bg-pink-600/10 transition-all" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                      <MapPin size={12} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{venue.location}</span>
                    </div>
                    <h3 className="text-2xl font-serif italic text-white group-hover:text-pink-500 transition-colors">
                      {venue.venue_name}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <Star className="text-yellow-500 fill-yellow-500" size={14} />
                      <span className="text-white font-mono font-bold">{venue.avg_rating}</span>
                    </div>
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mt-2">
                      {venue.report_count} {venue.report_count === 1 ? 'Report' : 'Reports'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageSquare size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Latest Feedback</span>
                  </div>
                  <div className="space-y-3">
                    {venue.descriptions.slice(0, 2).map((desc, i) => (
                      <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5">
                        <p className="text-[11px] text-gray-400 leading-relaxed italic line-clamp-3">
                          "{desc}"
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="text-cyan-500" size={10} />
                            <span className="text-[8px] text-cyan-500/70 font-black uppercase tracking-widest italic">Verified Artist</span>
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
                  <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all">
                    Full Venue Dossier
                  </button>
                  <button className="px-4 py-3 bg-white/5 hover:bg-pink-600/10 border border-white/5 hover:border-pink-500/30 rounded-xl transition-all group/btn">
                    <AlertTriangle size={14} className="text-gray-600 group-hover/btn:text-pink-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

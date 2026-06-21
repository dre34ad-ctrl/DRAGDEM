'use client';

import React from 'react';
import { 
  Play, 
  Music, 
  Film, 
  Star, 
  MapPin, 
  Verified, 
  ShieldCheck, 
  Calendar,
  Share2,
  Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ArtistProfileSignatureProps {
  profile: any;
}

export default function ArtistProfileSignature({ profile }: ArtistProfileSignatureProps) {
  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Cinematic Hero Header */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image / Video Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${profile.image_url || 'https://images.unsplash.com/photo-1560131750-ad400ba77807?auto=format&fit=crop&q=80&w=2000'})` }}
        />
        
        {/* Dramatic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent md:via-black/20" />
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-24 relative z-10">
          <div className="max-w-4xl animate-slide-up">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-primary text-white px-4 py-1.5 font-black uppercase tracking-widest text-[10px] shadow-glow-magenta animate-neon-pulse">
                Institutional Pro
              </Badge>
              <div className="flex items-center gap-2 text-luxury-gold font-bold uppercase tracking-widest text-xs">
                <MapPin size={14} />
                {profile.location || 'Berlin'}
              </div>
              <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-xs">
                <ShieldCheck size={14} />
                Safe-City Certified
              </div>
            </div>

            <h1 className="text-7xl md:text-9xl font-black font-playfair italic leading-none mb-8 tracking-tighter drop-shadow-2xl">
              {profile.name || 'Signature Performer'}
            </h1>
            
            <div className="flex flex-wrap gap-8 items-center mb-12">
               <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center text-black">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Identity Verified</p>
                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Auth Node: 0x92f...4a9c</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-glow-magenta/40">
                     <Star size={20} className="fill-white" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Top 1% Global</p>
                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Ranking: Elite Pro</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <Button className="btn-prestige btn-prestige-primary px-12 py-8 text-lg group">
                Book Artist <Calendar className="ml-3 group-hover:rotate-12 transition-transform" />
              </Button>
              <div className="flex gap-4">
                <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all text-white/60 hover:text-primary shadow-lg">
                  <Heart size={24} />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary/20 hover:border-secondary/40 transition-all text-white/60 hover:text-secondary shadow-lg">
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Light Effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-crimson-velvet/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      </div>

      {/* Profile Navigation */}
      <div className="sticky top-[72px] z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex gap-10">
            {['Overview', 'Media Vault', 'Experience', 'Technical Rider', 'Reviews'].map((tab) => (
              <button 
                key={tab} 
                className="py-6 text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors relative group"
              >
                {tab}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full shadow-glow-magenta" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-32">
            {/* Biography Section */}
            <section>
              <h2 className="glamour-heading text-5xl mb-12 italic">The Artist Soul</h2>
              <div className="text-gray-400 text-2xl leading-relaxed font-light italic max-w-3xl whitespace-pre-wrap">
                {profile.bio || "A trailblazing force in the international cabaret scene, combining high-concept couture with avant-garde performance art. Dedicated to the evolution of drag as a high-trust, professional institution."}
              </div>
            </section>

            {/* Multimedia Showcase */}
            <section>
              <div className="flex justify-between items-end mb-12">
                <h2 className="glamour-heading text-5xl italic">Performance Vault</h2>
                <button className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-primary/30 pb-1 hover:text-white hover:border-white transition-all">
                  View Full Archive
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group cursor-pointer">
                  <div className="aspect-[4/5] glass-panel rounded-[2rem] border-white/5 overflow-hidden mb-6 relative">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all flex items-center justify-center">
                       <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all shadow-2xl">
                          <Play size={32} fill="white" className="translate-x-1" />
                       </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-playfair italic">Paris Fashion Week Gala</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">2026 • Performance Film</p>
                </div>
                <div className="space-y-10">
                  <div className="group cursor-pointer">
                    <div className="aspect-video glass-panel rounded-[2rem] border-white/5 overflow-hidden mb-6 relative">
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all flex items-center justify-center">
                         <Play size={24} fill="white" />
                       </div>
                    </div>
                    <h3 className="text-lg font-bold">Midnight Ritual</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Full Act Reel</p>
                  </div>
                  <div className="glass-panel p-8 rounded-[2rem] border-white/5 border-l-4 border-luxury-gold flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold border border-luxury-gold/20 shadow-glow-gold/10 group-hover:scale-110 transition-transform">
                        <Music size={24} />
                      </div>
                      <div>
                        <p className="font-black text-white uppercase text-sm tracking-[0.2em]">Signature Mix 2.0</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Studio Master • 2026</p>
                      </div>
                    </div>
                    <Play size={20} className="text-gray-600 group-hover:text-luxury-gold" />
                  </div>
                </div>
              </div>
            </section>

            {/* Performance History */}
            <section>
              <h2 className="glamour-heading text-5xl mb-12 italic">Global Resume</h2>
              <div className="space-y-12">
                {[
                  { year: '2026', title: 'Berlin Cabaret Festival', role: 'Headliner' },
                  { year: '2025', title: 'London Pride Mainstage', role: 'Featured Act' },
                  { year: '2025', title: 'CDMX Underground Drag Revue', role: 'Co-Producer' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-12 items-start border-b border-white/5 pb-12 group">
                    <div className="text-3xl font-black font-playfair italic text-gray-700 group-hover:text-primary transition-colors">{item.year}</div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            {/* Stats / Measurements */}
            <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-10 border-l-2 border-primary pl-4">Institutional Stats</h3>
              <div className="space-y-8">
                {[
                  { label: 'Completion Rate', value: '100%' },
                  { label: 'Booking Rank', value: 'Elite Pro' },
                  { label: 'Avg Rating', value: '4.95 / 5.0' },
                  { label: 'Languages', value: 'EN, DE, FR' },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                    <span className="text-xl font-bold font-playfair italic">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Rider Hook */}
            <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-secondary/5 to-transparent">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 border-l-2 border-secondary pl-4">Technical Specs</h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-glow-cyan/20">
                  <Film size={28} />
                </div>
                <div>
                  <p className="font-bold text-sm">Rider v2.4 Attached</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mt-1">Verified Stage Ready</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border-white/10 text-[10px] font-black uppercase tracking-widest py-6 hover:bg-secondary hover:text-black transition-all">
                Download Technical Rider
              </Button>
            </div>

            {/* Social Proof Mini */}
            <div className="p-10 rounded-[2.5rem] bg-crimson-velvet/5 border border-crimson-velvet/20">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-crimson-velvet/60 mb-6">Recent Review</h3>
               <div className="flex gap-2 mb-4">
                 {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-luxury-gold text-luxury-gold" />)}
               </div>
               <p className="text-sm italic text-gray-400 leading-relaxed mb-6">
                 "An absolute professional. The performance was breathtaking and the administrative compliance was flawless."
               </p>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/10" />
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-tight">SchwuZ Berlin</p>
                   <p className="text-[8px] text-gray-600 uppercase font-bold">Venue Partner</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  FileText, 
  ArrowUpRight, 
  MapPin,
  PieChart as PieChartIcon,
  Search,
  Loader2,
  Lock,
  Download,
  Activity,
  CheckCircle2,
  BarChart3,
  Award,
  Zap,
  Info,
  Network
} from 'lucide-react';
import { getEconomicPulse } from '@/lib/actions/gov';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

export default function EconomicPulseDashboard() {
  const [city, setCity] = useState('Berlin');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getEconomicPulse(city);
        setData(res);
      } catch (err) {
        console.error('Failed to fetch pulse data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [city]);

  if (loading || !data) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center bg-black/40 rounded-[3rem] border border-white/5 backdrop-blur-xl">
        <Loader2 className="animate-spin text-primary mb-6" size={64} />
        <p className="text-gray-500 font-montserrat font-black tracking-[0.3em] uppercase animate-pulse">Decrypting Economic Stream</p>
      </div>
    );
  }

  const ldiData = [
    { name: 'Formalized', value: data.ldi?.formalized || 68.5, color: '#FF00FF' },
    { name: 'Transitioning', value: data.ldi?.transitioning || 21.5, color: '#7000FF' },
    { name: 'Informal', value: data.ldi?.informal || 10.0, color: '#333333' },
  ];

  const funnelData = [
    { name: 'Unverified Venues', value: data.safe_city_funnel?.unverified_venues || 1200 },
    { name: 'Protocol Adopters', value: data.safe_city_funnel?.protocol_adopters || 850 },
    { name: 'Safe-City Certified', value: data.safe_city_funnel?.certified_safe || 412 },
  ].reverse();

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      {/* Dashboard Header Expansion */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/20 rounded-lg">
                <Activity className="text-primary shadow-glow-magenta" size={20} />
             </div>
             <h2 className="text-4xl md:text-5xl font-black font-montserrat tracking-tighter">
               ECONOMIC <span className="text-primary">PULSE</span> <span className="text-[0.4em] align-top bg-luxury-gold text-black px-2 py-0.5 rounded-md ml-2 font-bold tracking-normal uppercase">2.0</span>
             </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]">Institutional Intelligence • Terminal 4.2</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                <Zap size={10} className="fill-cyan-400" /> Live Verification Active
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-[9px] font-black text-luxury-gold uppercase tracking-widest">
                <ShieldCheck size={10} /> Escrow-Secured
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-luxury-gold" />
              <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Sector:</span>
            </div>
            <select 
              className="bg-transparent text-sm font-black text-white focus:outline-none cursor-pointer border-none"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="Berlin">Berlin (Pride Hub)</option>
              <option value="Bangkok">Bangkok (Lotus District)</option>
              <option value="New York City">NYC (Neon Corridor)</option>
              <option value="London">London (Underground)</option>
              <option value="CDMX">CDMX (Tenochtitlan)</option>
              <option value="Rio">Rio (Samba State)</option>
              <option value="Paris">Paris (Belle Époque)</option>
              <option value="Madrid">Madrid (Movida)</option>
              <option value="Sydney">Sydney (Harbour Hub)</option>
              <option value="Toronto">Toronto (The Village)</option>
              <option value="Buenos Aires">Buenos Aires (Tango District)</option>
            </select>
          </div>
          
          <button className="p-4 bg-primary text-white rounded-2xl hover:scale-110 hover:rotate-3 transition-all shadow-glow-magenta active:scale-95">
            <Search size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Summary Stats 2.0 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-primary/20 transition-all group">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex justify-between">
            Total GMV (Orange Economy) <span className="text-primary">{data.ldi?.benchmark?.currency === 'EUR' ? '€' : '$'}</span>
          </div>
          <div className="text-4xl font-black font-montserrat text-white tracking-tighter mb-2">
            {data.ldi?.benchmark?.currency === 'EUR' ? '€' : '$'}{(data.total_gmv / 1000000).toFixed(1)}M
          </div>
          <div className="text-[10px] font-black text-green-400 uppercase tracking-tighter">
            +12.4% vs prev. quarter
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-royal-purple/20 transition-all">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex justify-between">
            Formalization Rate (LDI) <CheckCircle2 size={12} className="text-primary" />
          </div>
          <div className="text-4xl font-black font-montserrat text-white tracking-tighter mb-2">
            {data.ldi?.formalized || 68.5}%
          </div>
          <div className="text-[10px] font-black text-primary uppercase tracking-tighter">
             Benchmark: {data.ldi?.benchmark?.dignity_standard} {data.ldi?.benchmark?.currency} Net
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-cyan-500/20 transition-all">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex justify-between">
            Active Cultural Venues <MapPin size={12} className="text-cyan-400" />
          </div>
          <div className="text-4xl font-black font-montserrat text-white tracking-tighter mb-2">
            {data.safe_city_funnel?.certified_safe || 412}
          </div>
          <div className="text-[10px] font-black text-cyan-400 uppercase tracking-tighter">
            {data.safe_city_funnel?.active_protocol}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-luxury-gold/20 transition-all">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex justify-between">
            Tourism Multiplier <Award size={12} className="text-luxury-gold" />
          </div>
          <div className="text-4xl font-black font-montserrat text-white tracking-tighter mb-2">
            {data.tourism_multiplier || 3.4}x
          </div>
          <div className="text-[10px] font-black text-luxury-gold uppercase tracking-tighter">
            Spend vs traditional nightlife
          </div>
        </div>
      </div>

      {/* Regulatory Bridge 2.0 (New Phase 13 Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-1 glass-panel rounded-[3rem] p-12 border-cyan-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-cyan-400 group-hover:scale-110 transition-transform">
               <Network size={120} />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-cyan-500/20 rounded-xl">
                     <Zap className="text-cyan-400" size={24} />
                  </div>
                  <h3 className="text-xl font-black font-montserrat uppercase tracking-tight">Regulatory Bridge</h3>
               </div>
               
               <div className="space-y-8">
                  <div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Active Protocol</div>
                     <div className="text-2xl font-black text-white">{data.regulatory_bridge?.bridge_name}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Tokens Issued</div>
                        <div className="text-lg font-black text-cyan-400">{data.regulatory_bridge?.active_tokens}</div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Tax Remitted</div>
                        <div className="text-lg font-black text-luxury-gold">{data.regulatory_bridge?.total_tax_collected}</div>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4">
                     {data.regulatory_bridge?.highlights.map((h: any, i: number) => (
                        <div key={i} className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-gray-400 uppercase">{h.label}</span>
                           <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-black text-white uppercase">{h.value}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Metric 2: Labor Dignity Index (LDI) */}
         <div className="glass-panel rounded-[3rem] p-12 hover:border-secondary/30 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] -ml-32 -mb-32" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="p-5 bg-black rounded-3xl border border-white/5 shadow-2xl group-hover:scale-110 transition-transform">
                <PieChartIcon className="text-secondary" size={32} />
              </div>
              <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-400">AUDITED LOG</div>
           </div>

           <div className="mb-8 relative z-10">
             <h3 className="text-2xl font-black font-montserrat tracking-tight uppercase mb-2">Labor Dignity Index</h3>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
               Percentage of creative labor protected by Digital Contracts and Escrow.
             </p>
           </div>
           
           <div className="relative h-64 flex items-center justify-center relative z-10 mb-8">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={ldiData}
                   cx="50%"
                   cy="50%"
                   innerRadius={70}
                   outerRadius={90}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {ldiData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <RechartsTooltip 
                   contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                   itemStyle={{ color: '#fff' }}
                 />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                 <div className="text-4xl font-black text-white tracking-tighter">{data.ldi?.formalized || 68.5}%</div>
                 <div className="text-[8px] text-gray-500 font-black tracking-widest uppercase">Formalized</div>
               </div>
             </div>
           </div>

           <div className="space-y-4 relative z-10 mb-8">
             {ldiData.map((item, i) => (
               <div key={i} className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</span>
                 </div>
                 <span className="text-xs font-black text-white">{item.value}%</span>
               </div>
             ))}
           </div>

           <div className="pt-6 border-t border-white/5 relative z-10">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Regional Requirements</div>
              <div className="flex flex-wrap gap-2">
                 {data.ldi?.benchmark?.compliance_requirements.map((req: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-secondary/10 border border-secondary/20 rounded text-[8px] font-black text-secondary uppercase">
                       {req}
                    </span>
                 ))}
              </div>
           </div>
         </div>

         {/* Metric 3: Safe-City Compliance Funnel */}
         <div className="lg:col-span-1 glass-panel rounded-[3rem] p-12 hover:border-cyan-500/30 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-[120px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-black font-montserrat tracking-tight uppercase">Safe-City Compliance</h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Venue Regulatory Monitor</p>
              </div>
              <div className="p-5 bg-black rounded-3xl border border-white/5 shadow-2xl group-hover:scale-110 transition-transform">
                <BarChart3 className="text-cyan-400" size={32} />
              </div>
           </div>

           <div className="h-64 relative z-10 mb-8">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart
                 layout="vertical"
                 data={funnelData}
                 margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
               >
                 <XAxis type="number" hide />
                 <YAxis 
                   dataKey="name" 
                   type="category" 
                   axisLine={false} 
                   tickLine={false}
                   tick={false}
                   width={1}
                 />
                 <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                 />
                 <Bar 
                   dataKey="value" 
                   radius={[0, 10, 10, 0]}
                   barSize={40}
                 >
                   {funnelData.map((entry, index) => (
                     <Cell 
                       key={`cell-${index}`} 
                       fill={index === 2 ? '#00FFFF' : index === 1 ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 0.2)'} 
                     />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>

           <div className="space-y-4 relative z-10">
             {funnelData.map((item, i) => (
               <div key={i} className="flex justify-between items-center">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</div>
                  <div className="text-xl font-black text-white">{item.value}</div>
               </div>
             ))}
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-panel rounded-[3rem] p-12 border-luxury-gold/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-[100px] -mr-32 -mt-32" />
           <div className="flex justify-between items-start mb-8 relative z-10">
             <div className="space-y-1">
               <h3 className="text-2xl font-black font-montserrat tracking-tight uppercase">Multimedia Asset Integrity</h3>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Digital Asset Vault & Verification</p>
             </div>
             <div className="p-4 bg-black rounded-2xl border border-white/5 shadow-2xl group-hover:rotate-6 transition-transform">
               <FileText className="text-luxury-gold" size={28} />
             </div>
           </div>
           
           <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-8 shadow-2xl">
              <img 
                src="/design_mockups/artist_vault_v2.png" 
                alt="Artist Vault Showcase" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                 <div className="px-3 py-1 bg-luxury-gold/20 border border-luxury-gold/40 rounded-full text-[9px] font-black text-luxury-gold uppercase tracking-widest">
                    4K Media Verified
                 </div>
                 <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                    Rights Cleared
                 </div>
              </div>
           </div>
           
           <p className="text-sm text-gray-400 leading-relaxed font-light font-inter italic border-l-2 border-luxury-gold/30 pl-6">
             "Our automated media auditing engine ensures every asset in the performer's vault meets institutional broadcast standards and legal rights verification."
           </p>
        </div>

        <div className="glass-panel rounded-[3rem] p-12 border-primary/20 relative overflow-hidden group">
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] -ml-32 -mb-32" />
           <div className="flex justify-between items-start mb-8 relative z-10">
             <div className="space-y-1">
               <h3 className="text-2xl font-black font-montserrat tracking-tight uppercase">Escrow-Secured Flow</h3>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Transaction Security & Dispute Mitigation</p>
             </div>
             <div className="p-4 bg-black rounded-2xl border border-white/5 shadow-2xl group-hover:-rotate-6 transition-transform">
               <ShieldCheck className="text-primary" size={28} />
             </div>
           </div>
           
           <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-8 shadow-2xl">
              <img 
                src="/design_mockups/secure_booking_v2.png" 
                alt="Secure Booking Flow Showcase" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                 <div className="px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-[9px] font-black text-primary uppercase tracking-widest">
                    Funds Locked
                 </div>
                 <div className="px-3 py-1 bg-luxury-gold/20 border border-luxury-gold/40 rounded-full text-[9px] font-black text-luxury-gold uppercase tracking-widest">
                    Milestone-Based Release
                 </div>
              </div>
           </div>
           
           <p className="text-sm text-gray-400 leading-relaxed font-light font-inter italic border-l-2 border-primary/30 pl-6">
             "The DRAGDEM Escrow system eliminates payment friction by locking performance fees upon booking, releasing them only after successful GPS-verified check-in."
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Metric 1: Activity Heatmap Placeholder */}
        <div className="lg:col-span-2 glass-panel rounded-[3rem] p-12 hover:border-primary/30 transition-all group relative overflow-hidden min-h-[500px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
             <div className="space-y-1">
               <h3 className="text-2xl font-black font-montserrat tracking-tight uppercase">Economic Activity Heatmap</h3>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Regional Density Monitor: {city}</p>
             </div>
             <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2 text-primary font-black text-xs tracking-tighter">
               LIVE SIGNAL
               <ArrowUpRight size={14} strokeWidth={3} />
             </div>
          </div>

          <div className="w-full h-80 bg-zinc-950 rounded-3xl border border-white/5 relative overflow-hidden group-hover:border-primary/20 transition-all">
             {/* Mock Heatmap Visualization */}
             <div className="absolute inset-0 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 bg-[url('/design_mockups/economic_pulse_v2.png')] bg-cover bg-center" />
             <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
             
             {/* Pulse Points */}
             <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-primary/40 blur-3xl animate-pulse" />
             <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-secondary/30 blur-3xl animate-pulse delay-700" />
             <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-cyan-500/30 blur-3xl animate-pulse delay-1000" />

             <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="p-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-1">
                      <Zap size={8} className="text-cyan-400 animate-pulse" />
                   </div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">High Density Districts</div>
                   <div className="flex gap-3">
                      <span className="px-2 py-1 bg-primary/20 text-primary text-[9px] font-black rounded">Hub Alpha</span>
                      <span className="px-2 py-1 bg-primary/20 text-primary text-[9px] font-black rounded">District Beta</span>
                      <span className="px-2 py-1 bg-secondary/20 text-secondary text-[9px] font-black rounded">Zone Gamma</span>
                   </div>
                </div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                   Spatial resolution: 50m
                </div>
             </div>
          </div>
          
          <div className="mt-8 flex justify-between items-center px-4">
             <div className="flex gap-8">
                <div>
                   <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Peak Velocity</div>
                   <div className="text-xl font-black text-white">4.2 Gigs/hr</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tourism Flow</div>
                   <div className="text-xl font-black text-white">+28%</div>
                </div>
             </div>
             <button className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:underline underline-offset-4">
                View Full Geospatial Data
             </button>
          </div>
        </div>

        {/* Institutional Pro Roster 2.0 */}
        <div className="glass-panel rounded-[3rem] p-12 hover:border-luxury-gold/30 transition-all group relative overflow-hidden">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Certification Progress</div>
            
            <div className="space-y-6 mb-12">
               {[
                 { region: 'Berlin', code: 'DE', count: 142, color: 'primary' },
                 { region: 'CDMX', code: 'MX', count: 89, color: 'secondary' },
                 { region: 'Rio', code: 'BR', count: 115, color: 'cyan' },
                 { region: 'Paris', code: 'FR', count: 76, color: 'primary' },
                 { region: 'Madrid', code: 'ES', count: 64, color: 'secondary' },
                 { region: 'Global', code: 'INT', count: '650+', color: 'luxury-gold' }
               ].map((reg, i) => (
                 <div key={i} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-[8px] font-black text-gray-400 group-hover/item:border-primary/50 transition-all">
                          {reg.code}
                       </div>
                       <div>
                          <div className="text-[9px] font-black text-white uppercase tracking-widest">{reg.region} Academy</div>
                          <div className="text-[8px] font-black text-gray-500 uppercase">Pro Standard</div>
                       </div>
                    </div>
                    <div className="text-xs font-black text-white">{reg.count} <span className="text-[7px] text-gray-600 ml-1">CERTIFIED</span></div>
                 </div>
               ))}
            </div>

            <div className="pt-8 border-t border-white/5 text-center">
               <div className="inline-block p-4 bg-luxury-gold/10 rounded-full mb-4 animate-pulse">
                  <Award className="text-luxury-gold" size={40} />
               </div>
               <div className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.3em] mb-2">Institutional Pro Badge</div>
               <p className="text-[9px] font-black text-gray-500 uppercase leading-relaxed max-w-[200px] mx-auto">
                  Global standard for professional drag excellence.
               </p>
            </div>
        </div>

        {/* Adoption Progress Bar (Full Width) */}
        <div className="lg:col-span-3 glass-panel rounded-[4rem] p-16 shadow-2xl relative overflow-hidden border-luxury-gold/10">
          <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none text-luxury-gold">
            <ShieldCheck size={300} />
          </div>
          
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 relative z-10">
            <div className="space-y-6 flex-1">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full text-luxury-gold text-[10px] font-black uppercase tracking-[0.3em]">
                <Lock size={12} />
                Compliance Standard ISO-9002
              </div>
              <h3 className="text-5xl md:text-7xl font-black font-montserrat tracking-tight leading-none italic">
                INSTITUTIONAL <span className="glamour-heading">PRO</span> ADOPTION
              </h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
                <div className="text-8xl md:text-[10rem] font-black text-primary drop-shadow-glow-magenta tracking-tighter">
                  {data.pro_adoption}%
                </div>
                <div className="text-lg text-gray-400 max-w-xl leading-relaxed font-light font-inter">
                  of performers on the <span className="text-white font-bold">{city}</span> municipal roster have completed the 
                  <span className="text-white font-bold underline decoration-luxury-gold underline-offset-8"> Institutional Pro Certification</span>. 
                  This ensures every booking meets global safety, tax transparency, and DEI benchmarks.
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-6 w-full xl:w-auto min-w-[350px]">
              <button className="btn-prestige btn-prestige-gold py-6 group flex items-center justify-center gap-4">
                <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                Export Tourism Report (PDF)
              </button>
              <button className="px-10 py-6 border-2 border-white/5 bg-white/2 hover:bg-white/5 text-gray-400 font-black rounded-full text-sm uppercase tracking-[0.3em] hover:text-white transition-all text-center backdrop-blur-md">
                View Competitive Hubs
              </button>
            </div>
          </div>
          
          <div className="mt-20 h-4 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-linear-to-r from-primary via-royal-purple to-secondary shadow-[0_0_30px_var(--primary)] transition-all duration-[2000ms] ease-out" 
              style={{ width: `${data.pro_adoption}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Audit Log Footer */}
      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 group-hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <Activity size={14} />
            Data Stream Encryption: AES-256
         </div>
         <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
            Verified by DRAGDEM Global Regulatory Team • 2026
         </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CityData {
  city: string;
  country: string;
  rating: string;
  rating_description: string;
  legal_framework: any;
  safety_and_protections: any;
  festivals_events?: string[];
}

interface SafeCityIndexProps {
  data: CityData[];
}

export const SafeCityIndex = ({ data }: SafeCityIndexProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-serif italic text-white">Safe-City Index</h2>
        <p className="text-gray-400 text-sm max-w-2xl">
          A community-contributed database of venues and cities, featuring professional safety ratings and verified artist reviews to mitigate risk in the global drag industry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((city, index) => (
          <Card key={index} className="bg-zinc-900/50 border-white/5 backdrop-blur-xl hover:border-cyan-500/30 transition-all group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge className={`${
                  city.rating === 'Elite' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                  city.rating.includes('Emerging') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                } uppercase text-[10px] font-black tracking-widest`}>
                  {city.rating}
                </Badge>
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin size={12} />
                  <span className="text-[10px] font-bold uppercase">{city.country}</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-serif italic text-white group-hover:text-cyan-400 transition-colors">
                {city.city}
              </CardTitle>
              <CardDescription className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                {city.rating_description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Shield size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Legal Framework</span>
                </div>
                <div className="text-[11px] text-gray-400 space-y-1">
                  {Object.keys(city.legal_framework).slice(0, 2).map((key, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-cyan-500/50">•</span>
                      <span>{city.legal_framework[key][0]?.name || city.legal_framework[key][0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-pink-500">
                  <AlertTriangle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Risks & Safety</span>
                </div>
                <div className="text-[11px] text-gray-400 space-y-1">
                  {city.safety_and_protections.risks?.slice(0, 2).map((risk: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-pink-500/50">•</span>
                      <span className="line-clamp-1">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all">
                Full City Audit
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

'use client';
import React, { useState, useEffect } from 'react';
import { getEconomicPulse } from '@/lib/actions/gov';

interface CityTickerProps {
  city: string;
}

export default function CityTicker({ city }: CityTickerProps) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getEconomicPulse(city);
        setData(res);
      } catch (err) {
        console.error('Failed to fetch city pulse:', err);
      }
    }
    fetchData();
  }, [city]);

  if (!data || !data.regulatory_bridge) return null;

  const highlights = data.regulatory_bridge.highlights || [];

  return (
    <div className="bg-black/50 backdrop-blur-md border-b border-white/5 py-4 overflow-hidden relative z-50">
      <div className="flex animate-scroll whitespace-nowrap">
        {[1, 2, 3].map((group) => (
          <div key={group} className="flex shrink-0 items-center">
            <span className="mx-8 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
              {city} Live Protocol: {data.regulatory_bridge.bridge_name}
            </span>
            <span className="mx-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
              Status: {data.regulatory_bridge.compliance_status} Verified
            </span>
            {highlights.map((h: any, i: number) => (
              <span key={i} className="mx-8 text-[10px] font-black text-luxury-gold uppercase tracking-[0.4em]">
                {h.label}: {h.value}
              </span>
            ))}
            <span className="mx-8 text-[10px] font-black text-secondary uppercase tracking-[0.4em]">
              Total Tax Remitted: {data.regulatory_bridge.total_tax_collected}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

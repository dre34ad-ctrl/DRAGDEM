'use client';

import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Camera, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface MetricsPulseProps {
  metrics: {
    viewCount: number;
    bookingCount: number;
    conversionRate: number;
    totalSnaps: number;
  };
  glowLevel: number;
}

// Mock historical data for charts
const mockTrendData = [
  { day: 'Mon', views: 40, bookings: 2, snaps: 12 },
  { day: 'Tue', views: 35, bookings: 1, snaps: 18 },
  { day: 'Wed', views: 52, bookings: 3, snaps: 25 },
  { day: 'Thu', views: 48, bookings: 2, snaps: 20 },
  { day: 'Fri', views: 70, bookings: 5, snaps: 35 },
  { day: 'Sat', views: 95, bookings: 8, snaps: 50 },
  { day: 'Sun', views: 80, bookings: 4, snaps: 42 },
];

export const MetricsPulse: React.FC<MetricsPulseProps> = ({ metrics, glowLevel }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {/* Profile Views Card */}
      <div className="glass-panel rounded-[2rem] p-8 group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Activity size={80} className="text-secondary" />
        </div>
        <div className="flex justify-between items-start mb-6">
          <div className="p-4 bg-secondary/10 rounded-2xl border border-secondary/20 shadow-glow-cyan/10 group-hover:scale-110 transition-transform">
            <Users className="text-secondary" size={24} />
          </div>
          <div className="flex items-center gap-1 text-secondary font-black text-xs tracking-tighter">
            <ArrowUpRight size={14} strokeWidth={3} />
            +12.5%
          </div>
        </div>
        <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Profile Views</h3>
        <p className="text-4xl font-montserrat font-black text-white mb-6 drop-shadow-sm">{metrics.viewCount.toLocaleString()}</p>
        
        <div className="h-20 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="var(--color-secondary)" 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Conversion Card */}
      <div className="glass-panel rounded-[2rem] p-8 group relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="p-4 bg-royal-purple/10 rounded-2xl border border-royal-purple/20 shadow-glow-purple/10 group-hover:scale-110 transition-transform">
            <Calendar className="text-royal-purple" size={24} />
          </div>
          <div className="flex items-center gap-1 text-secondary font-black text-xs tracking-tighter">
            <ArrowUpRight size={14} strokeWidth={3} />
            +2.1%
          </div>
        </div>
        <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Conversion Rate</h3>
        <p className="text-4xl font-montserrat font-black text-white mb-6">{(metrics.conversionRate * 100).toFixed(1)}%</p>
        
        <div className="h-20 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTrendData}>
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="var(--color-royal-purple)" 
                strokeWidth={3} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Snap Engagement Card */}
      <div className="glass-panel rounded-[2rem] p-8 group relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-glow-magenta/10 group-hover:scale-110 transition-transform">
            <Camera className="text-primary" size={24} />
          </div>
          <div className="flex items-center gap-1 text-primary font-black text-xs tracking-tighter">
            <ArrowUpRight size={14} strokeWidth={3} />
            +45%
          </div>
        </div>
        <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Backstage Snaps</h3>
        <p className="text-4xl font-montserrat font-black text-white mb-6">{metrics.totalSnaps.toLocaleString()}</p>
        
        <div className="h-20 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData}>
              <Area 
                type="stepAfter" 
                dataKey="snaps" 
                stroke="var(--color-primary)" 
                fill="var(--color-primary)" 
                fillOpacity={0.1} 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Glow Meter Card */}
      <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group border-luxury-gold/10 hover:border-luxury-gold/30">
        <div className="relative w-32 h-32 mb-4 group-hover:scale-105 transition-transform duration-500">
          {/* Enhanced Circular Glow Meter */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={364.4}
              strokeDashoffset={364.4 - (364.4 * (glowLevel / 100))}
              strokeLinecap="round"
              className="text-luxury-gold drop-shadow-glow-gold transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-luxury-gold animate-neon-pulse" size={32} />
          </div>
        </div>
        <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black mb-1">Current Glow</h3>
        <p className="text-2xl font-montserrat font-black text-luxury-gold drop-shadow-glow-gold">+{glowLevel}%</p>
      </div>
    </div>
  );
};

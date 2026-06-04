'use client';

import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Camera, 
  Zap,
  ArrowUpRight,
  ArrowDownRight
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Profile Views Card */}
      <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl">
            <Users className="text-cyan-400" size={24} />
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <ArrowUpRight size={14} />
            +12.5%
          </div>
        </div>
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-black mb-1">Profile Views</h3>
        <p className="text-3xl font-montserrat font-bold text-white mb-4">{metrics.viewCount.toLocaleString()}</p>
        
        <div className="h-16 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#22d3ee" 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Conversion Card */}
      <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <Calendar className="text-purple-400" size={24} />
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <ArrowUpRight size={14} />
            +2.1%
          </div>
        </div>
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-black mb-1">Conversion Rate</h3>
        <p className="text-3xl font-montserrat font-bold text-white mb-4">{(metrics.conversionRate * 100).toFixed(1)}%</p>
        
        <div className="h-16 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTrendData}>
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#a855f7" 
                strokeWidth={2} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Snap Engagement Card */}
      <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-pink-500/10 rounded-xl">
            <Camera className="text-pink-400" size={24} />
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <ArrowUpRight size={14} />
            +45%
          </div>
        </div>
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-black mb-1">Backstage Snaps</h3>
        <p className="text-3xl font-montserrat font-bold text-white mb-4">{metrics.totalSnaps.toLocaleString()}</p>
        
        <div className="h-16 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData}>
              <Area 
                type="stepAfter" 
                dataKey="snaps" 
                stroke="#ec4899" 
                fill="#ec4899" 
                fillOpacity={0.1} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Glow Meter Card */}
      <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-xl relative flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 mb-2">
          {/* Simple Circular Glow Meter */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * (glowLevel / 100))}
              strokeLinecap="round"
              className="text-luxury-gold"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-luxury-gold animate-pulse" size={24} />
          </div>
        </div>
        <h3 className="text-gray-400 text-[10px] uppercase tracking-widest font-black mb-1">Current Glow</h3>
        <p className="text-xl font-montserrat font-bold text-luxury-gold">+{glowLevel}% Visibility</p>
      </div>
    </div>
  );
};

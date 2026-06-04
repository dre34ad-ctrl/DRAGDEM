'use client';

import React from 'react';
import Navbar from "@/components/Navbar";
import { BackstageComposer } from "@/components/pulse/BackstageComposer";
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal,
  ShieldCheck,
  ArrowRightLeft,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function BaseDashboard({ userName }: { userName: string }) {
  return (
    <main className="min-h-screen pb-20 bg-deep text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-montserrat font-bold text-white">
              Welcome back, <br />
              <span className="glamour-heading text-5xl md:text-7xl">{userName}!</span>
            </h1>
            <p className="text-gray-400 mt-4 font-inter text-sm uppercase tracking-[0.3em]">Institutional Grade Performance Tracking</p>
          </div>
          <Link href="/settings/rates" className="group relative px-8 py-4 bg-deep-charcoal border border-luxury-gold/30 hover:border-luxury-gold transition-all rounded-2xl font-bold text-xs tracking-widest text-luxury-gold shadow-glow-gold/10">
             <div className="flex items-center gap-3 relative z-10">
               <Settings size={18} />
               RATE & BILLING SETTINGS
             </div>
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Monthly Revenue" 
            value="$3,450.00" 
            trend="+12.5%" 
            icon={<DollarSign className="text-accent" />} 
            trendUp={true} 
          />
          <StatCard 
            title="Profile Views" 
            value="1,284" 
            trend="+24%" 
            icon={<TrendingUp className="text-primary" />} 
            trendUp={true} 
          />
          <StatCard 
            title="Active Bookings" 
            value="8" 
            trend="Stable" 
            icon={<CalendarIcon className="text-secondary" />} 
            trendUp={true} 
          />
          <StatCard 
            title="Escrow Balance" 
            value="$2,100.00" 
            trend="Pending" 
            icon={<ShieldCheck className="text-accent" />} 
            trendUp={true} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Backstage Content Composer */}
            <BackstageComposer performerName={userName} />

            <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-montserrat font-bold text-xl uppercase tracking-wider">Performance Calendar</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors">MONTH</button>
                  <button className="px-4 py-2 bg-primary rounded-lg text-sm font-bold shadow-lg shadow-primary/20">WEEK</button>
                </div>
              </div>
              
              <div className="aspect-video bg-deep/50 rounded-xl border border-gray-800 flex items-center justify-center border-dashed">
                <div className="text-center">
                   <CalendarIcon size={48} className="mx-auto text-gray-700 mb-4" />
                   <p className="text-gray-500 font-medium">Interactive Calendar Component</p>
                   <p className="text-gray-600 text-sm mt-1">Showing 3 upcoming gigs this week</p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-montserrat font-bold text-xl uppercase tracking-wider">Financial Overview</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                   <ShieldCheck size={14} className="text-accent" />
                   STRIPE CONNECT SECURED
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                 <div className="p-5 bg-deep rounded-2xl border border-gray-800">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Held in Escrow</p>
                    <p className="text-2xl font-bold font-montserrat">$1,400.00</p>
                    <p className="text-[10px] text-accent mt-2 flex items-center gap-1 font-bold">
                       <Clock size={10} /> RELEASING SOON
                    </p>
                 </div>
                 <div className="p-5 bg-deep rounded-2xl border border-gray-800">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Available for Payout</p>
                    <p className="text-2xl font-bold font-montserrat">$700.00</p>
                    <button className="text-[10px] bg-accent/20 text-accent px-2 py-1 rounded mt-2 font-bold uppercase hover:bg-accent hover:text-deep transition-colors">
                       Instant Payout
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Recent Transactions</p>
                <PaymentRow name="The Oasis Nightclub" date="Oct 24, 2026" amount="$450.00" status="Paid" />
                <PaymentRow name="Corporate Gala (NYC)" date="Oct 22, 2026" amount="$1,200.00" status="Escrow" />
                <PaymentRow name="Sunday Brunch" date="Oct 20, 2026" amount="$200.00" status="Paid" />
              </div>
              <button className="w-full mt-6 py-3 text-sm font-bold text-primary hover:text-white transition-colors">VIEW ALL TRANSACTIONS &rarr;</button>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="font-montserrat font-bold text-xl uppercase tracking-wider mb-6 flex justify-between items-center">
                Pending Inquiries
                <span className="bg-primary text-[10px] px-2 py-1 rounded-full text-white">3 NEW</span>
              </h3>
              <div className="space-y-6">
                <InquiryItem 
                  title="Pride Mainstage" 
                  details="June 22, 2027 | San Francisco" 
                  budget="$5,000" 
                />
                <InquiryItem 
                  title="The Ritz (Brunch)" 
                  details="Every Sun | Los Angeles" 
                  budget="$250 / show" 
                />
                <InquiryItem 
                  title="Private Birthday Party" 
                  details="Dec 12, 2026 | New York" 
                  budget="$400" 
                />
              </div>
              <button className="w-full mt-8 py-4 bg-linear-to-r from-primary to-secondary rounded-xl font-bold text-white shadow-lg transform hover:scale-[1.02] transition-all">
                REVIEW ALL INQUIRIES
              </button>
            </div>

            <div className="bg-linear-to-br from-secondary/20 to-primary/20 border border-secondary/30 rounded-2xl p-6 shadow-xl text-white">
               <h4 className="font-bold mb-2 flex items-center gap-2">
                 <ArrowRightLeft size={18} className="text-secondary" />
                 Currency Exchange
               </h4>
               <p className="text-gray-300 text-sm font-inter leading-relaxed">
                 You have **3 inquiries** in foreign currencies (EUR, GBP). Rates are estimated based on today&apos;s mid-market.
               </p>
               <button className="mt-4 text-xs font-bold text-secondary uppercase tracking-widest hover:text-white transition-colors">
                 UPDATE CONVERSION PREFERENCES
               </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, trend, icon, trendUp }: any) {
  return (
    <div className="glass-panel p-6 rounded-[2rem] hover:shadow-glow-magenta/10 transition-all duration-500 group border-white/5 hover:border-primary/20">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-deep-charcoal rounded-2xl border border-white/5 group-hover:border-primary/30 transition-colors shadow-inner">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black tracking-widest uppercase ${trendUp ? 'neon-magenta-text' : 'text-red-500'}`}>
          {trend}
          <ArrowUpRight size={14} />
        </div>
      </div>
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-2 font-montserrat">{title}</p>
      <p className="text-3xl font-bold font-montserrat tracking-tighter">{value}</p>
    </div>
  );
}

function PaymentRow({ name, date, amount, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-deep/30 rounded-xl border border-gray-800 hover:bg-deep/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface border border-gray-700 flex items-center justify-center">
          {status === "Escrow" ? <ShieldCheck size={18} className="text-accent" /> : <DollarSign size={18} className="text-gray-400" />}
        </div>
        <div>
          <p className="font-bold text-sm">{name}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-sm">{amount}</p>
        <div className="flex items-center gap-1 justify-end">
           {status === "Paid" ? (
             <CheckCircle2 size={12} className="text-accent" />
           ) : status === "Escrow" ? (
             <Clock size={12} className="text-accent animate-pulse" />
           ) : (
             <Clock size={12} className="text-orange-500" />
           )}
           <p className={`text-[10px] font-bold uppercase ${status === "Paid" || status === "Escrow" ? 'text-accent' : 'text-orange-500'}`}>{status}</p>
        </div>
      </div>
    </div>
  );
}

function InquiryItem({ title, details, budget }: any) {
  return (
    <div className="group cursor-pointer">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold group-hover:text-primary transition-colors text-sm">{title}</h4>
        <MoreHorizontal size={16} className="text-gray-600" />
      </div>
      <p className="text-xs text-gray-500 mb-2 font-inter">{details}</p>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-accent px-2 py-1 bg-accent/10 rounded-md">Budget: {budget}</span>
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest group-hover:text-white transition-colors">Details &rarr;</span>
      </div>
    </div>
  );
}

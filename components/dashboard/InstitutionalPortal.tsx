'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  ChevronRight, 
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Euro,
  CreditCard
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const complianceReports = [
  { id: 1, name: 'Berlin KSK Q2 2026', type: 'KSK-Abgabe', date: '2026-06-01', status: 'Ready' },
  { id: 2, name: 'Paris GUSO June 2026', type: 'GUSO Social', date: '2026-06-05', status: 'Processing' },
  { id: 3, name: 'London VAT Statement Q1', type: 'VAT Report', date: '2026-04-15', status: 'Ready' },
  { id: 4, name: 'CDMX RESICO Withholding', type: 'Fiscal Report', date: '2026-05-20', status: 'Ready' },
];

const rosterLDI = [
  { id: 1, name: 'Sasha Sparkle', status: 'Verified', seal: 'Institutional Pro', location: 'NYC' },
  { id: 2, name: 'Pandora Nox', status: 'Verified', seal: 'Institutional Pro', location: 'Berlin' },
  { id: 3, name: 'Anita Cocktail', status: 'Pending', seal: 'Pro', location: 'London' },
  { id: 4, name: 'Silvetty Montilla', status: 'Verified', seal: 'Institutional Pro', location: 'São Paulo' },
  { id: 5, name: 'Bambi Mercury', status: 'Awaiting Audit', seal: 'Pro', location: 'Berlin' },
];

export default function InstitutionalPortal() {
  const [activeTab, setActiveTab] = useState<'billing' | 'compliance' | 'roster'>('billing');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/10">
        {[
          { id: 'billing', label: 'Unified Billing', icon: CreditCard },
          { id: 'compliance', label: 'Compliance Reports', icon: FileText },
          { id: 'roster', label: 'LDI Verification', icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'billing' && (
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 bg-white/5 border-white/10 p-8">
            <CardHeader className="px-0 pt-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <CardTitle className="text-2xl font-bold">Monthly Institutional Statement</CardTitle>
                  <CardDescription className="text-white/40">June 2026 • Aggregate for 12 Bookings</CardDescription>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary uppercase text-[10px]">Active Period</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Net Talent Fees</p>
                  <p className="text-3xl font-playfair italic font-bold">€42,500.00</p>
                </div>
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Institutional Fee (0.3%)</p>
                  <p className="text-3xl font-playfair italic font-bold text-primary">€127.50</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Berlin Hub (KSK Liabilities)</span>
                  <span className="font-mono">€2,125.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Paris Hub (GUSO Charges)</span>
                  <span className="font-mono">€1,840.00</span>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Payable</span>
                  <span className="text-luxury-gold font-mono">€46,592.50</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="flex-1 bg-primary py-6 text-xs font-bold uppercase tracking-widest">
                  Pay Unified Statement
                </Button>
                <Button variant="outline" className="flex-1 border-white/10 py-6 text-xs font-bold uppercase tracking-widest flex gap-2">
                  <Download size={14} /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 p-8 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Audit Readiness</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-bold">Tax Compliance</p>
                  <p className="text-[10px] text-white/40">100% of acts fiscalized</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-bold">Insurance Status</p>
                  <p className="text-[10px] text-white/40">PLI verified for all performers</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold">Safe-City Audit</p>
                  <p className="text-[10px] text-white/40">Scheduled for July 15</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 mt-auto">
              <div className="bg-luxury-gold/10 border border-luxury-gold/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-luxury-gold">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">LDI Certified Venue</span>
                </div>
                <p className="text-[10px] text-luxury-gold/80 leading-relaxed font-medium">
                  Your venue meets the high-trust Labor Dignity Standard for the 2026 season.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'compliance' && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Compliance & Regulatory Reports</CardTitle>
            <CardDescription className="text-white/40">Automated document generation for municipal and tax authorities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {complianceReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <FileText size={18} className="text-white/40 group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{report.name}</p>
                      <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase font-bold tracking-tight">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={`${
                      report.status === 'Ready' ? 'border-green-500/30 text-green-500' : 'border-primary/30 text-primary'
                    } text-[10px] uppercase`}>
                      {report.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-white/20 hover:text-white" disabled={report.status !== 'Ready'}>
                      <Download size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'roster' && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Labor Dignity Seal Tracking</CardTitle>
            <CardDescription className="text-white/40">Real-time verification status for your active performer roster.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-white/40 px-4">Performer</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-white/40 px-4">Location</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-white/40 px-4">Certification</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-white/40 px-4">Status</th>
                    <th className="pb-4 px-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rosterLDI.map((artist) => (
                    <tr key={artist.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-luxury-gold/10">
                            {artist.name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold">{artist.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-white/60">{artist.location}</td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={`${
                          artist.seal === 'Institutional Pro' ? 'border-luxury-gold/30 text-luxury-gold' : 'border-primary/30 text-primary'
                        } text-[9px] uppercase tracking-tighter`}>
                          {artist.seal}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            artist.status === 'Verified' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-primary animate-pulse'
                          }`} />
                          <span className="text-[10px] font-bold uppercase tracking-tight text-white/60">{artist.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm" className="text-white/20 hover:text-white group-hover:text-primary">
                          <ChevronRight size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

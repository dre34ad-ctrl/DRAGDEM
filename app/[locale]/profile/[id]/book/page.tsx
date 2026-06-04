"use client";

import Navbar from "@/components/Navbar";
import { 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Globe, 
  Info, 
  ShieldCheck, 
  ArrowRight,
  DollarSign
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { calculateFees } from "@/lib/utils/fees";
import { MexicoPayoutBreakdown } from "@/components/tax/MexicoPayoutBreakdown";
import { GermanyKSKWarning } from "@/components/tax/GermanyKSKWarning";
import { FranceGUSOForm } from "@/components/tax/FranceGUSOForm";
import { AustraliaGSTInfo } from "@/components/tax/AustraliaGSTInfo";
import { JapanInvoiceInfo } from "@/components/tax/JapanInvoiceInfo";
import { SpainRETAInfo } from "@/components/tax/SpainRETAInfo";

const CURRENCIES: Record<string, { symbol: string, rate: number, name: string, region: string }> = {
  USD: { symbol: "$", rate: 1.0, name: "US Dollar", region: "US" },
  EUR: { symbol: "€", rate: 0.92, name: "Euro", region: "DE" },
  GBP: { symbol: "£", rate: 0.79, name: "British Pound", region: "GB" },
  BRL: { symbol: "R$", rate: 5.05, name: "Brazilian Real", region: "BR" },
  THB: { symbol: "฿", rate: 36.4, name: "Thai Baht", region: "TH" },
  MXN: { symbol: "$", rate: 17.1, name: "Mexican Peso", region: "MX" },
  AUD: { symbol: "A$", rate: 1.52, name: "Australian Dollar", region: "AU" },
  JPY: { symbol: "¥", rate: 151.2, name: "Japanese Yen", region: "JP" },
};

const REGIONS = [
  { id: "US", label: "North America (USA/Canada)" },
  { id: "DE", label: "Germany" },
  { id: "FR", label: "France" },
  { id: "GB", label: "United Kingdom" },
  { id: "MX", label: "Mexico" },
  { id: "ES", label: "Spain" },
  { id: "BR", label: "Brazil" },
  { id: "TH", label: "Thailand" },
  { id: "AU", label: "Australia" },
  { id: "JP", label: "Japan" },
];

export default function BookingPage() {
  const [currency, setCurrency] = useState("USD");
  const [selectedRegion, setSelectedRegion] = useState("US");
  const [isB2B, setIsB2B] = useState(false);
  const [step, setStep] = useState(1);
  const [kskAcknowledged, setKskAcknowledged] = useState(false);
  const [gusoData, setGusoData] = useState({ siret: "", accountNum: "" });
  const baseRate = 1200; // Sasha's base fee in USD

  // Mock Performer Data (Ideally fetched)
  const performer = {
    region: "ES",
    taxRegime: "RETA",
    vatRate: 0.21,
    nationalId: "ES12345678X", 
  };

  const fees = useMemo(() => {
    const selected = CURRENCIES[currency];
    const amount = baseRate * selected.rate;
    
    const performerRegime = (selectedRegion === 'FR' && !isB2B) ? 'GUSO' : performer.taxRegime;

    return calculateFees({
      amount,
      performerRegion: performer.region,
      seekerRegion: selectedRegion,
      isB2B,
      performerTaxRegime: performerRegime,
      performerVatRate: performer.vatRate,
      hasVerifiedABN: !!performer.nationalId && performer.region === 'AU',
      hasTNumber: !!performer.nationalId && performer.region === 'JP',
    });
  }, [currency, selectedRegion, isB2B]);

  const convertedRate = useMemo(() => {
    return fees.subtotal.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }, [fees.subtotal]);

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    if (regionId === 'GB') setCurrency('GBP');
    else if (regionId === 'AU') setCurrency('AUD');
    else if (regionId === 'JP') setCurrency('JPY');
    else if (regionId === 'DE' || regionId === 'FR' || regionId === 'ES') setCurrency('EUR');
    else if (regionId === 'MX') setCurrency('MXN');
    else if (regionId === 'BR') setCurrency('BRL');
    else if (regionId === 'TH') setCurrency('THB');
    else setCurrency('USD');
  };

  return (
    <main className="min-h-screen pb-20 bg-deep">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-2 text-gray-500 mb-8 text-sm uppercase tracking-widest font-bold">
          <Link href="/profile/sasha-sparkle" className="hover:text-primary transition-colors">Profile</Link>
          <ChevronRight size={14} />
          <span className="text-white border-b-2 border-primary">Booking Sasha Sparkle</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-surface border border-gray-800 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-montserrat font-bold mb-8 flex items-center gap-3">
                <Globe className="text-primary" /> International Booking
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Event Location / Region</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select 
                      value={selectedRegion}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      className="w-full bg-deep border border-gray-700 rounded-xl py-4 pl-12 pr-4 focus:outline-hidden focus:border-primary appearance-none text-white"
                    >
                      {REGIONS.map(reg => (
                        <option key={reg.id} value={reg.id}>{reg.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Local Currency</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {Object.keys(CURRENCIES).map((curr) => (
                      <button 
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`py-3 rounded-lg border font-bold text-sm transition-all ${
                          currency === curr 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-deep border-gray-700 text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Booking Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setIsB2B(false)}
                      className={`py-3 rounded-lg border font-bold text-sm transition-all ${
                        !isB2B 
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                          : "bg-deep border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      Individual / Private
                    </button>
                    <button 
                      onClick={() => setIsB2B(true)}
                      className={`py-3 rounded-lg border font-bold text-sm transition-all ${
                        isB2B 
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                          : "bg-deep border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      Business / Venue
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="date" 
                      className="w-full bg-deep border border-gray-700 rounded-xl py-4 pl-12 pr-4 focus:outline-hidden focus:border-primary"
                    />
                  </div>
                </div>

                {/* Regional Compliance Components */}
                <div className="space-y-4">
                  {selectedRegion === 'DE' && isB2B && (
                    <GermanyKSKWarning 
                      netFee={fees.subtotal}
                      currency={currency}
                      estimatedContribution={fees.kskLiabilityAmount}
                      acknowledged={kskAcknowledged}
                      onAcknowledge={setKskAcknowledged}
                    />
                  )}

                  {selectedRegion === 'FR' && (
                    <FranceGUSOForm 
                      onValidated={(data) => setGusoData(data)}
                    />
                  )}

                  {selectedRegion === 'AU' && (
                    <AustraliaGSTInfo 
                      amount={fees.subtotal}
                      currency={currency}
                      hasABN={performer.region === 'AU' && !!performer.nationalId}
                      isB2B={isB2B}
                    />
                  )}

                  {selectedRegion === 'JP' && (
                    <JapanInvoiceInfo 
                      amount={fees.subtotal}
                      currency={currency}
                      hasTNumber={performer.region === 'JP' && !!performer.nationalId}
                      isB2B={isB2B}
                    />
                  )}

                  {selectedRegion === 'ES' && performer.region === 'ES' && (
                    <SpainRETAInfo 
                      amount={fees.subtotal}
                      currency={currency}
                      irpfWithholding={fees.withholdings.find(w => w.name.includes('IRPF'))?.amount || 0}
                      isB2B={isB2B}
                      isNewAutonomo={performer.taxRegime === 'RETA_NEW'}
                    />
                  )}

                  {performer.region === 'MX' && performer.taxRegime === 'RESICO' && isB2B && selectedRegion === 'MX' && (
                    <MexicoPayoutBreakdown 
                      grossFee={fees.subtotal}
                      currency={currency}
                      isrWithholding={fees.withholdings.find(w => w.name.includes('ISR'))?.amount || 0}
                      ivaWithholding={fees.withholdings.find(w => w.name.includes('IVA'))?.amount || 0}
                      serviceFee={fees.platformFee}
                      netPayout={fees.netPayout}
                    />
                  )}
                </div>
              </div>
            </section>

            <section className="bg-surface border border-gray-800 rounded-2xl p-8 shadow-2xl">
               <h3 className="text-xl font-bold mb-6">Event Details & Requirements</h3>
               <textarea 
                 placeholder="Tell Sasha about your event, venue size, and specific act requests..."
                 className="w-full bg-deep border border-gray-700 rounded-xl p-4 min-h-[150px] focus:outline-hidden focus:border-primary text-gray-300"
               ></textarea>
               <div className="mt-6 flex items-start gap-3 p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
                 <Info className="text-secondary shrink-0" size={18} />
                 <p className="text-xs text-gray-400 leading-relaxed">
                   By proceeding, you agree to provide the technical requirements listed in Sasha&apos;s 
                   Technical Rider (XLR output, private dressing area, etc.).
                 </p>
               </div>
            </section>
          </div>

          {/* Checkout / Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-linear-to-b from-surface to-deep border border-gray-800 rounded-3xl p-8 shadow-2xl sticky top-24">
              <h3 className="text-lg font-bold mb-6 text-center border-b border-gray-800 pb-4 uppercase tracking-widest">Booking Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-medium">Standard Appearance</span>
                  <span className="font-bold">{CURRENCIES[currency].symbol}{fees.subtotal.toFixed(2)}</span>
                </div>
                
                {fees.vatAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-medium">VAT ({((fees.vatAmount / fees.subtotal) * 100).toFixed(0)}%)</span>
                    <span className="font-bold">{CURRENCIES[currency].symbol}{fees.vatAmount.toFixed(2)}</span>
                  </div>
                )}

                {fees.kskLiabilityAmount > 0 && (
                  <div className="flex justify-between items-center text-accent">
                    <span className="text-sm font-medium flex items-center gap-1">
                      KSK Social Contribution (5%) <Info size={12} title="Mandatory for German venues hiring artists" />
                    </span>
                    <span className="font-bold">{CURRENCIES[currency].symbol}{fees.kskLiabilityAmount.toFixed(2)}</span>
                  </div>
                )}

                {fees.gusoLiabilityAmount > 0 && (
                  <div className="flex justify-between items-center text-accent">
                    <span className="text-sm font-medium flex items-center gap-1">
                      GUSO Social Contributions (~35%) <Info size={12} title="Mandatory for one-off bookings in France" />
                    </span>
                    <span className="font-bold">{CURRENCIES[currency].symbol}{fees.gusoLiabilityAmount.toFixed(2)}</span>
                  </div>
                )}

                {fees.seekerPlatformFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-medium">Platform Service Fee ({(fees.seekerPlatformFee / fees.subtotal * 100).toFixed(1)}%)</span>
                    <span className="font-bold">{CURRENCIES[currency].symbol}{fees.seekerPlatformFee.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-800 pt-4 mt-4 flex justify-between items-center">
                  <span className="font-bold text-white uppercase text-xs tracking-widest">Total to Pay</span>
                  <span className="text-2xl font-montserrat font-bold text-accent">
                    {CURRENCIES[currency].symbol}{(fees.subtotal + fees.vatAmount + fees.kskLiabilityAmount + fees.gusoLiabilityAmount + (fees.seekerPlatformFee || 0)).toFixed(2)}
                  </span>
                </div>

                {fees.totalWithholdings > 0 && (
                   <div className="pt-2">
                     <p className="text-[10px] text-gray-500 italic">
                       * Includes {CURRENCIES[currency].symbol}{fees.totalWithholdings.toFixed(2)} in regional tax withholdings as required by local regulations.
                     </p>
                   </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                   <ShieldCheck size={14} className="text-accent" />
                   Secure Escrow Payment
                 </div>
                 <p className="text-[10px] text-gray-600 leading-tight">
                   Funds are held in escrow and released only 48 hours before the event to ensure protection for both parties.
                 </p>
              </div>

              <button className="w-full py-5 bg-linear-to-r from-primary to-secondary rounded-2xl font-extrabold text-white shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all flex items-center justify-center gap-2 group">
                CONFIRM & PAY DEPOSIT
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-center mt-6 text-[10px] text-gray-500">
                Processed via <span className="text-gray-300 font-bold">Stripe Connect</span> Global Infrastructure.
              </p>
            </div>
            
            <div className="p-6 border border-gray-800 border-dashed rounded-2xl">
               <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                 <DollarSign size={14} className="text-primary" /> Multi-Currency Info
               </h4>
               <p className="text-[10px] text-gray-500 leading-relaxed">
                 The rate is converted using mid-market exchange rates. The artist will receive their payout in their home currency ({performer.region === 'MX' ? 'MXN' : 'USD'}).
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

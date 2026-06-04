"use client";

import Navbar from "@/components/Navbar";
import { 
  Save, 
  Plus, 
  Trash2, 
  DollarSign, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ChevronLeft,
  ShieldCheck,
  User,
  Globe
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { UKPLIUpload } from "@/components/verification/UKPLIUpload";
import { AustraliaABNVerify } from "@/components/verification/AustraliaABNVerify";
import { JapanTNumberField } from "@/components/verification/JapanTNumberField";
import { InstitutionalProVerification } from "@/components/onboarding/InstitutionalProVerification";

const SERVICE_TYPES = [
  { id: "flat", label: "Flat Fee (Appearance)", desc: "Standard for lip-sync numbers + hosting" },
  { id: "hourly", label: "Hourly Rate", desc: "Meet & greets, red carpet, or atmosphere" },
  { id: "act", label: "Per Act / Number", desc: "Specialized solo performances" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "BRL", "THB", "AUD", "MXN", "JPY"];

export default function RateSettingPage() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [taxRegime, setTaxRegime] = useState("Standard");
  const [vatRate, setVatRate] = useState(0);
  const [taxId, setTaxId] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [region, setRegion] = useState("US");
  const [tNumber, setTNumber] = useState("");
  const [abnVerified, setAbnVerified] = useState(false);
  const [pliStatus, setPliStatus] = useState<"unverified" | "pending" | "verified">("unverified");
  const [primaryCategory, setPrimaryCategory] = useState("Drag Queen");
  const [additionalIdentities, setAdditionalIdentities] = useState<string[]>([]);
  const [rates, setRates] = useState([
    { type: "flat", amount: 1200, enabled: true },
    { type: "hourly", amount: 250, enabled: true },
    { type: "act", amount: 400, enabled: false },
  ]);

  const toggleRate = (index: number) => {
    const newRates = [...rates];
    newRates[index].enabled = !newRates[index].enabled;
    setRates(newRates);
  };

  const updateAmount = (index: number, val: string) => {
    const newRates = [...rates];
    newRates[index].amount = parseInt(val) || 0;
    setRates(newRates);
  };

  const toggleIdentity = (id: string) => {
    setAdditionalIdentities(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen pb-20 bg-deep text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
           <ChevronLeft size={16} />
           Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="glamour-heading text-4xl text-primary">Rate & Billing Settings</h1>
            <p className="text-gray-400 mt-1 font-inter">Define how much you charge and your payout preferences.</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2">
            <Save size={18} />
            SAVE CHANGES
          </button>
        </div>

        <div className="space-y-8">
          {/* Base Currency Section */}
          <section className="bg-surface border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <DollarSign className="text-accent" /> Base Currency
            </h2>
            <p className="text-sm text-gray-400 mb-6 font-inter leading-relaxed">
              This is the currency you will be paid in. All international bookings will be converted to this amount using live market rates.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CURRENCIES.map((curr) => (
                <button 
                  key={curr}
                  onClick={() => setBaseCurrency(curr)}
                  className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                    baseCurrency === curr 
                      ? "bg-accent border-accent text-deep" 
                      : "bg-deep border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </section>

          {/* Identity & Inclusive Categories */}
          <section className="bg-surface border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <User className="text-primary" /> Identity & Style
            </h2>
            <p className="text-sm text-gray-400 mb-6 font-inter leading-relaxed">
              Help seekers find you by defining your drag identity. We support inclusive, regional, and culturally specific categories.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Primary Identity</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["Drag Queen", "Drag King", "Bio-Queen", "Transformista", "2-Spirit", "Katoey"].map((id) => (
                    <button 
                      key={id}
                      onClick={() => setPrimaryCategory(id)}
                      className={`py-3 px-4 rounded-xl border font-bold text-xs transition-all ${
                        primaryCategory === id 
                          ? "bg-primary border-primary text-white" 
                          : "bg-deep border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Additional Cultural Identifiers (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "afrolatin", label: "Afro-Latine" },
                    { id: "indigenous", label: "Indigenous / First Nations" },
                    { id: "ballroom", label: "Ballroom / House Culture" },
                    { id: "pageant", label: "Pageant" },
                    { id: "camp", label: "Camp / Comedy" },
                  ].map((ident) => (
                    <button 
                      key={ident.id}
                      onClick={() => toggleIdentity(ident.id)}
                      className={`py-2 px-4 rounded-full border text-xs font-bold transition-all ${
                        additionalIdentities.includes(ident.id)
                          ? "bg-secondary border-secondary text-white"
                          : "bg-deep border-gray-800 text-gray-500 hover:border-gray-700"
                      }`}
                    >
                      {ident.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Performance Rates Section */}
          <section className="bg-surface border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-8">Performance Rates</h2>
            
            <div className="space-y-6">
              {rates.map((rate, idx) => {
                const service = SERVICE_TYPES.find(s => s.id === rate.type);
                return (
                  <div key={rate.type} className={`p-6 rounded-2xl border transition-all ${rate.enabled ? 'bg-deep border-gray-700' : 'bg-deep/30 border-gray-800 opacity-60'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-white uppercase text-sm tracking-wider mb-1">{service?.label}</h4>
                        <p className="text-xs text-gray-500 font-inter">{service?.desc}</p>
                      </div>
                      <button 
                        onClick={() => toggleRate(idx)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${rate.enabled ? 'bg-primary' : 'bg-gray-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${rate.enabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-6">
                       <div className="relative flex-1 max-w-[200px]">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">{baseCurrency}</span>
                          <input 
                            type="number" 
                            value={rate.amount}
                            onChange={(e) => updateAmount(idx, e.target.value)}
                            disabled={!rate.enabled}
                            className="w-full bg-surface border border-gray-700 rounded-xl py-3 pl-14 pr-4 focus:outline-hidden focus:border-primary font-bold text-lg"
                          />
                       </div>
                       <span className="text-gray-600 text-sm">/ {rate.type === 'hourly' ? 'hour' : 'appearance'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="w-full mt-8 py-4 border-2 border-dashed border-gray-800 rounded-2xl text-gray-500 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
               <Plus size={18} />
               ADD CUSTOM SERVICE TYPE
            </button>
          </section>

          {/* Institutional Pro Verification */}
          <InstitutionalProVerification />

          {/* International Payout Info */}
          <section className="bg-linear-to-br from-secondary/10 to-primary/10 border border-secondary/20 rounded-2xl p-8">
             <div className="flex gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-white mb-2">Global Payout Verified</h3>
                   <p className="text-sm text-gray-400 font-inter leading-relaxed">
                     Your account is connected to **Stripe Connect**. You are eligible to receive international payments from 135+ countries.
                   </p>
                   <div className="mt-4 flex gap-4">
                      <button className="text-xs font-bold text-secondary uppercase tracking-widest border-b border-secondary pb-1 hover:text-white hover:border-white transition-all">View Stripe Dashboard</button>
                      <button className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-transparent pb-1">Setup Multi-Currency Payouts</button>
                   </div>
                </div>
             </div>
          </section>

          {/* Tax Compliance Section */}
          <section className="bg-surface border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <ShieldCheck className="text-primary" /> Tax & Compliance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Operating Region</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <select 
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-deep border border-gray-700 rounded-xl py-4 pl-12 pr-4 focus:outline-hidden focus:border-primary appearance-none text-white"
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="JP">Japan</option>
                    <option value="MX">Mexico</option>
                    <option value="DE">Germany</option>
                    <option value="BR">Brazil</option>
                    <option value="TH">Thailand</option>
                  </select>
                </div>
              </div>

              {region === 'GB' && (
                <div className="md:col-span-2">
                  <UKPLIUpload 
                    initialStatus={pliStatus}
                    onUpload={(file) => setPliStatus('pending')}
                  />
                </div>
              )}

              {region === 'AU' && (
                <div className="md:col-span-2">
                  <AustraliaABNVerify 
                    initialABN={taxId}
                    onVerified={(abn, name) => {
                      setTaxId(abn);
                      setAbnVerified(true);
                    }}
                  />
                </div>
              )}

              {region === 'JP' && (
                <div className="md:col-span-2">
                  <JapanTNumberField 
                    value={tNumber}
                    onChange={setTNumber}
                  />
                </div>
              )}

              {region === 'MX' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tax Regime (SAT)</label>
                    <select 
                      value={taxRegime}
                      onChange={(e) => setTaxRegime(e.target.value)}
                      className="w-full bg-deep border border-gray-700 rounded-xl py-4 px-4 focus:outline-hidden focus:border-primary appearance-none text-white"
                    >
                      <option value="Standard">Persona Física Actividad Empresarial</option>
                      <option value="RESICO">RESICO (Simplified Regime)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">RFC (Tax ID)</label>
                    <input 
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="ABCD123456XYZ"
                      className="w-full bg-deep border border-gray-700 rounded-xl py-4 px-4 focus:outline-hidden focus:border-primary text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Postal Code (SAT Registered)</label>
                    <input 
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="06000"
                      className="w-full bg-deep border border-gray-700 rounded-xl py-4 px-4 focus:outline-hidden focus:border-primary text-white"
                    />
                  </div>
                </>
              )}

              {region === 'DE' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">VAT Rate (Umsatzsteuer)</label>
                    <select 
                      value={vatRate}
                      onChange={(e) => setVatRate(parseFloat(e.target.value))}
                      className="w-full bg-deep border border-gray-700 rounded-xl py-4 px-4 focus:outline-hidden focus:border-primary appearance-none text-white"
                    >
                      <option value="0.19">Standard (19%)</option>
                      <option value="0.07">Reduced (7% - Artistic)</option>
                      <option value="0">Kleinunternehmer (Exempt)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Steuernummer / VAT ID</label>
                    <input 
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="DE123456789"
                      className="w-full bg-deep border border-gray-700 rounded-xl py-4 px-4 focus:outline-hidden focus:border-primary text-white"
                    />
                  </div>
                </>
              )}
            </div>

            {region === 'MX' && taxRegime === 'RESICO' && (
              <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
                <Info className="text-primary shrink-0" size={18} />
                <p className="text-xs text-gray-400 leading-relaxed">
                  As a RESICO performer, a 1.25% ISR and 10.66% IVA withholding will be applied to B2B invoices automatically for compliant CFDI 4.0 generation.
                </p>
              </div>
            )}
          </section>

          {/* International Tax Forms */}
        </div>
      </div>
    </main>
  );
}

'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';
import { savePerformerRegionInfo } from '@/lib/actions/onboarding';

interface RegionalOnboardingProps {
  initialRegion?: string;
  onComplete?: () => void;
}

export default function RegionalOnboarding({ initialRegion = 'MX', onComplete }: RegionalOnboardingProps) {
  const t = useTranslations('onboarding');
  const [region, setRegion] = useState(initialRegion);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [rfc, setRfc] = useState('');
  const [taxRegime, setTaxRegime] = useState('RESICO');
  const [clabe, setClabe] = useState('');
  
  const [steuernummer, setSteuernummer] = useState('');
  const [vatRegistration, setVatRegistration] = useState('Standard');
  const [isKskMember, setIsKskMember] = useState(false);

  const [docNumber, setDocNumber] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [brDocType, setBrDocType] = useState<'CPF' | 'CNPJ'>('CPF');

  const [promptPayId, setPromptPayId] = useState('');

  // Phase 5 states
  const [sin, setSin] = useState('');
  const [caPayoutMethod, setCaPayoutMethod] = useState<'interac' | 'direct_deposit'>('interac');
  const [dni, setDni] = useState('');
  const [isAutonomo, setIsAutonomo] = useState(false);
  const [nationalId, setNationalId] = useState('');
  const [accountNameChinese, setAccountNameChinese] = useState('');
  const [cuil, setCuil] = useState('');
  const [arTaxRegime, setArTaxRegime] = useState('Monotributista');
  const [isQuebec, setIsQuebec] = useState(false);
  const [stageNameFr, setStageNameFr] = useState('');

  // Phase 6 states
  const [tNumber, setTNumber] = useState('');
  const [hasAsfAgreement, setHasAsfAgreement] = useState(false);
  const [nationalIdIl, setNationalIdIl] = useState('');
  const [isIsraelBusiness, setIsIsraelBusiness] = useState(false);
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [partitaIva, setPartitaIva] = useState('');
  const [siret, setSiret] = useState('');
  const [isIntermittent, setIsIntermittent] = useState(false);

  // Phase 7 states
  const [personalNumberSe, setPersonalNumberSe] = useState('');
  const [swishId, setSwishId] = useState('');
  const [isBankIdVerified, setIsBankIdVerified] = useState(false);
  const [nationalIdNo, setNationalIdNo] = useState('');
  const [vippsId, setVippsId] = useState('');
  const [cprNumberDk, setCprNumberDk] = useState('');
  const [mobilePayId, setMobilePayId] = useState('');
  const [irdNumberNz, setIrdNumberNz] = useState('');
  const [isRealMeVerified, setIsRealMeVerified] = useState(false);

  // Phase 8 states
  const [nipPl, setNipPl] = useState('');
  const [momoIdVn, setMomoIdVn] = useState('');
  const [gcashIdPh, setGcashIdPh] = useState('');
  const [tinPh, setTinPh] = useState('');
  const [duitNowIdMy, setDuitNowIdMy] = useState('');
  const [gopayIdId, setGopayIdId] = useState('');
  const [npwpId, setNpwpId] = useState('');

  // Phase 9 states
  const [rrnKr, setRrnKr] = useState('');
  const [kakaoPayId, setKakaoPayId] = useState('');
  const [taxIdSa, setTaxIdSa] = useState('');
  const [snapScanId, setSnapScanId] = useState('');
  const [taxIdCz, setTaxIdCz] = useState('');
  const [taxIdHu, setTaxIdHu] = useState('');
  const [taxIdRo, setTaxIdRo] = useState('');
  const [nitCo, setNitCo] = useState('');
  const [nequiId, setNequiId] = useState('');
  const [licenseAe, setLicenseAe] = useState('');
  const [careemPayId, setCareemPayId] = useState('');
  const [isStealthMode, setIsStealthMode] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const validateInputs = () => {
    setError(null);
    if (region === 'MX') {
      if (!rfc || rfc.length < 12) {
        setError('Invalid RFC format. Expected 12 or 13 characters.');
        return false;
      }
    } else if (region === 'BR') {
      if (!docNumber || docNumber.length < 11) {
        setError('Invalid Document Number.');
        return false;
      }
    } else if (region === 'DE') {
      if (!steuernummer) {
        setError('Steuernummer is required.');
        return false;
      }
    } else if (region === 'TH') {
      if (!promptPayId) {
        setError('PromptPay ID is required.');
        return false;
      }
    } else if (region === 'CA') {
      if (!sin || sin.length < 9) {
        setError('Invalid SIN format. Expected 9 digits.');
        return false;
      }
    } else if (region === 'ES') {
      if (!dni) {
        setError('DNI/NIE is required.');
        return false;
      }
    } else if (region === 'TW') {
      if (!nationalId) {
        setError('National ID is required.');
        return false;
      }
    } else if (region === 'AR') {
      if (!cuil) {
        setError('CUIL/CUIT is required.');
        return false;
      }
    } else if (region === 'JP') {
      if (!tNumber) {
        setError('T-Number is required for Qualified Invoicing.');
        return false;
      }
      if (!hasAsfAgreement) {
        setError('You must agree to the Anti-Social Forces clause.');
        return false;
      }
    } else if (region === 'IL') {
      if (!nationalIdIl) {
        setError('National ID is required.');
        return false;
      }
    } else if (region === 'IT') {
      if (!codiceFiscale) {
        setError('Codice Fiscale is required.');
        return false;
      }
    } else if (region === 'FR') {
      if (!siret) {
        setError('SIRET number is required.');
        return false;
      }
    } else if (region === 'SE') {
      if (!personalNumberSe) {
        setError('Personal Number is required.');
        return false;
      }
    } else if (region === 'NO') {
      if (!nationalIdNo) {
        setError('National ID is required.');
        return false;
      }
    } else if (region === 'DK') {
      if (!cprNumberDk) {
        setError('CPR Number is required.');
        return false;
      }
    } else if (region === 'NZ') {
      if (!irdNumberNz) {
        setError('IRD Number is required.');
        return false;
      }
    } else if (region === 'PL') {
      if (!nipPl) {
        setError('NIP is required.');
        return false;
      }
    } else if (region === 'VN') {
      if (!momoIdVn) {
        setError('MoMo ID is required.');
        return false;
      }
    } else if (region === 'PH') {
      if (!tinPh) {
        setError('TIN is required.');
        return false;
      }
    } else if (region === 'CZ') {
      if (!taxIdCz) {
        setError('Tax ID is required.');
        return false;
      }
    } else if (region === 'HU') {
      if (!taxIdHu) {
        setError('Tax ID is required.');
        return false;
      }
    } else if (region === 'RO') {
      if (!taxIdRo) {
        setError('Tax ID is required.');
        return false;
      }
    } else if (region === 'MY') {
      if (!duitNowIdMy) {
        setError('DuitNow ID is required.');
        return false;
      }
    } else if (region === 'ID') {
      if (!npwpId) {
        setError('NPWP is required.');
        return false;
      }
    } else if (region === 'KR') {
      if (!rrnKr) {
        setError('Resident Registration Number is required.');
        return false;
      }
    } else if (region === 'CO') {
      if (!nitCo) {
        setError('NIT is required.');
        return false;
      }
    } else if (region === 'SA') {
      if (!taxIdSa) {
        setError('Tax ID is required.');
        return false;
      }
    } else if (region === 'AE') {
      if (!licenseAe) {
        setError('Variety License Number is required.');
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      let taxId = '';
      let regime = '';
      
      if (region === 'MX') {
        taxId = rfc;
        regime = taxRegime;
      } else if (region === 'DE') {
        taxId = steuernummer;
        regime = vatRegistration;
      } else if (region === 'BR') {
        taxId = docNumber;
      } else if (region === 'TH') {
        taxId = promptPayId;
      } else if (region === 'CA') {
        taxId = sin;
        regime = caPayoutMethod;
      } else if (region === 'ES') {
        taxId = dni;
        regime = isAutonomo ? 'Autonomo' : 'Individual';
      } else if (region === 'TW') {
        taxId = nationalId;
        regime = accountNameChinese;
      } else if (region === 'AR') {
        taxId = cuil;
        regime = arTaxRegime;
      } else if (region === 'JP') {
        taxId = tNumber;
        regime = 'Qualified Issuer';
      } else if (region === 'IL') {
        taxId = nationalIdIl;
        regime = isIsraelBusiness ? 'Business' : 'Individual';
      } else if (region === 'IT') {
        taxId = codiceFiscale;
        regime = partitaIva ? `VAT:${partitaIva}` : 'Individual';
      } else if (region === 'FR') {
        taxId = siret;
        regime = isIntermittent ? 'Intermittent' : 'Auto-entrepreneur';
      } else if (region === 'SE') {
        taxId = personalNumberSe;
        regime = isBankIdVerified ? 'BankID Verified' : 'Standard';
      } else if (region === 'NO') {
        taxId = nationalIdNo;
      } else if (region === 'DK') {
        taxId = cprNumberDk;
      } else if (region === 'NZ') {
        taxId = irdNumberNz;
        regime = isRealMeVerified ? 'RealMe Verified' : 'Standard';
      } else if (region === 'PL') {
        taxId = nipPl;
        regime = 'Iron & Velvet';
      } else if (region === 'CZ') {
        taxId = taxIdCz;
        regime = 'Iron & Velvet';
      } else if (region === 'HU') {
        taxId = taxIdHu;
        regime = 'Iron & Velvet';
      } else if (region === 'RO') {
        taxId = taxIdRo;
        regime = 'Iron & Velvet';
      } else if (region === 'VN') {
        taxId = momoIdVn;
        regime = 'Lotus & Laser';
      } else if (region === 'PH') {
        taxId = tinPh;
        regime = gcashIdPh;
      } else if (region === 'MY') {
        taxId = duitNowIdMy;
        regime = 'Lotus & Laser';
      } else if (region === 'ID') {
        taxId = npwpId;
        regime = gopayIdId;
      } else if (region === 'KR') {
        taxId = rrnKr;
        regime = kakaoPayId;
      } else if (region === 'CO') {
        taxId = nitCo;
        regime = nequiId;
      } else if (region === 'SA') {
        taxId = taxIdSa;
        regime = snapScanId;
      } else if (region === 'AE') {
        taxId = licenseAe;
        regime = isStealthMode ? 'Stealth Mode' : 'Standard';
      }

      await savePerformerRegionInfo({
        region,
        taxId,
        taxRegime: regime,
        payoutProvider: (region === 'DE' || region === 'ES' || region === 'CA' || region === 'JP' || region === 'IT' || region === 'FR' || region === 'SE' || region === 'NO' || region === 'DK' || region === 'NZ' || region === 'PL' || region === 'CZ' || region === 'HU' || region === 'RO' || region === 'KR') ? 'stripe' : 'alternative',
        postalCode: isQuebec ? 'Quebec' : undefined 
      });

      setSuccess(true);
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Failed to save regional info:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPoland = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#7B001C] relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-black">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇵🇱</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-white">{t('poland_title')} (Iron & Velvet)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('nip_pl_label')}</label>
          <input 
            type="text" 
            placeholder="10 digits" 
            value={nipPl}
            onChange={(e) => setNipPl(e.target.value)}
            className="w-full bg-black/50 border border-red-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7B001C] transition-all text-white"
          />
        </div>
        <div className="p-4 bg-red-900/10 border border-red-800/30 rounded-xl">
           <p className="text-xs text-red-200">
             KSeF (Krajowy System e-Faktur) integration ready for Polish performers.
           </p>
        </div>
      </div>
    </div>
  );

  const renderVietnam = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#DA70D6] relative overflow-hidden bg-gradient-to-br from-[#050505] to-[#1a0a2e]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇻🇳</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-white">{t('vietnam_title')} (Lotus & Laser)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('momo_id_vn_label')}</label>
          <input 
            type="text" 
            placeholder="Mobile number" 
            value={momoIdVn}
            onChange={(e) => setMomoIdVn(e.target.value)}
            className="w-full bg-black/50 border border-purple-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#DA70D6] transition-all text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderPhilippines = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#00FFFF] relative overflow-hidden bg-gradient-to-br from-[#050505] to-[#0a1a1a]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇵🇭</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-cyan-400">{t('philippines_title')} (Lotus & Laser)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('tin_ph_label')}</label>
          <input 
            type="text" 
            placeholder="9-12 digits" 
            value={tinPh}
            onChange={(e) => setTinPh(e.target.value)}
            className="w-full bg-black/50 border border-cyan-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#00FFFF] transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('gcash_id_ph_label')}</label>
          <input 
            type="text" 
            placeholder="Mobile number" 
            value={gcashIdPh}
            onChange={(e) => setGcashIdPh(e.target.value)}
            className="w-full bg-black/50 border border-cyan-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#00FFFF]"
          />
        </div>
      </div>
    </div>
  );

  const renderSouthKorea = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#7000FF] relative overflow-hidden bg-gradient-to-br from-[#000000] to-[#1a1a3a]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇰🇷</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-purple-400">{t('south_korea_title')} (Hallyu High-Tech)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('rrn_kr_label')}</label>
          <input 
            type="text" 
            placeholder="YYMMDD-XXXXXXX" 
            value={rrnKr}
            onChange={(e) => setRrnKr(e.target.value)}
            className="w-full bg-black/50 border border-purple-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7000FF] transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('kakao_pay_id_label')}</label>
          <input 
            type="text" 
            placeholder="Kakao ID or Mobile" 
            value={kakaoPayId}
            onChange={(e) => setKakaoPayId(e.target.value)}
            className="w-full bg-black/50 border border-purple-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7000FF]"
          />
        </div>
      </div>
    </div>
  );

  const renderColombia = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#2D5A27] relative overflow-hidden bg-gradient-to-br from-[#0B0B0B] to-[#1a2e1a]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇨🇴</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-green-400">{t('colombia_title')} (Emerald Carnival)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('nit_co_label')}</label>
          <input 
            type="text" 
            placeholder="NIT or CC number" 
            value={nitCo}
            onChange={(e) => setNitCo(e.target.value)}
            className="w-full bg-black/50 border border-green-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#2D5A27] transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('nequi_id_label')}</label>
          <input 
            type="text" 
            placeholder="Mobile number" 
            value={nequiId}
            onChange={(e) => setNequiId(e.target.value)}
            className="w-full bg-black/50 border border-green-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#2D5A27]"
          />
        </div>
      </div>
    </div>
  );

  const renderUAE = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#D4AF37] relative overflow-hidden bg-gradient-to-br from-[#000000] to-[#2a1a00]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇦🇪</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-gold-400">{t('uae_title')} (Oasis Opulence)</h3>
      </div>
      <div className="space-y-6">
        <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl mb-4">
           <p className="text-xs text-yellow-200">
             Critical: Performers in UAE are categorized as "Variety Entertainment" for legal compliance.
           </p>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('license_ae_label')}</label>
          <input 
            type="text" 
            placeholder="Variety Artist License #" 
            value={licenseAe}
            onChange={(e) => setLicenseAe(e.target.value)}
            className="w-full bg-black/50 border border-yellow-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#D4AF37] transition-all text-white"
          />
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
          <input 
            type="checkbox" 
            checked={isStealthMode}
            onChange={(e) => setIsStealthMode(e.target.checked)}
            className="w-5 h-5 accent-[#D4AF37]"
          />
          <div>
            <p className="text-sm font-bold text-white">{t('stealth_mode_label')}</p>
            <p className="text-xs text-gray-400">{t('stealth_mode_description')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSouthAfrica = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#FF00FF] relative overflow-hidden bg-gradient-to-br from-[#000000] to-[#2e0a2e]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇿🇦</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-magenta-400">{t('south_africa_title')} (Rainbow Pulse)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('tax_id_sa_label')}</label>
          <input 
            type="text" 
            placeholder="10 digits" 
            value={taxIdSa}
            onChange={(e) => setTaxIdSa(e.target.value)}
            className="w-full bg-black/50 border border-magenta-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#FF00FF] transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('snapscan_id_label')}</label>
          <input 
            type="text" 
            placeholder="SnapScan/Zapper ID" 
            value={snapScanId}
            onChange={(e) => setSnapScanId(e.target.value)}
            className="w-full bg-black/50 border border-magenta-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#FF00FF]"
          />
        </div>
      </div>
    </div>
  );

  const renderMalaysia = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#DA70D6] relative overflow-hidden bg-gradient-to-br from-[#050505] to-[#1a0a2e]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇲🇾</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-white">{t('malaysia_title')} (Lotus & Laser)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('duitnow_id_label')}</label>
          <input 
            type="text" 
            placeholder="NRIC or Mobile" 
            value={duitNowIdMy}
            onChange={(e) => setDuitNowIdMy(e.target.value)}
            className="w-full bg-black/50 border border-purple-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#DA70D6] transition-all text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderIndonesia = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#DA70D6] relative overflow-hidden bg-gradient-to-br from-[#050505] to-[#1a0a2e]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇮🇩</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-white">{t('indonesia_title')} (Lotus & Laser)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('npwp_id_label')}</label>
          <input 
            type="text" 
            placeholder="15 digits" 
            value={npwpId}
            onChange={(e) => setNpwpId(e.target.value)}
            className="w-full bg-black/50 border border-purple-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#DA70D6] transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('gopay_id_label')}</label>
          <input 
            type="text" 
            placeholder="Mobile number" 
            value={gopayIdId}
            onChange={(e) => setGopayIdId(e.target.value)}
            className="w-full bg-black/50 border border-purple-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#DA70D6]"
          />
        </div>
      </div>
    </div>
  );

  const renderCzech = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#7B001C] relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-black">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇨🇿</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-white">{t('czech_title')} (Iron & Velvet)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('tax_id_cz_label')}</label>
          <input 
            type="text" 
            placeholder="CZ12345678" 
            value={taxIdCz}
            onChange={(e) => setTaxIdCz(e.target.value)}
            className="w-full bg-black/50 border border-red-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7B001C] transition-all text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderHungary = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#7B001C] relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-black">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇭🇺</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-white">{t('hungary_title')} (Iron & Velvet)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('tax_id_hu_label')}</label>
          <input 
            type="text" 
            placeholder="10 digits" 
            value={taxIdHu}
            onChange={(e) => setTaxIdHu(e.target.value)}
            className="w-full bg-black/50 border border-red-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7B001C] transition-all text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderRomania = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#7B001C] relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-black">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇷🇴</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-white">{t('romania_title')} (Iron & Velvet)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('tax_id_ro_label')}</label>
          <input 
            type="text" 
            placeholder="CIF or CNP" 
            value={taxIdRo}
            onChange={(e) => setTaxIdRo(e.target.value)}
            className="w-full bg-black/50 border border-red-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7B001C] transition-all text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderSweden = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#7FFF00] relative overflow-hidden bg-gradient-to-br from-[#191970] to-black">
      <div className="absolute top-0 right-0 p-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${isBankIdVerified ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
          <ShieldCheck size={12} />
          {isBankIdVerified ? 'BANKID VERIFIED' : 'BANKID PENDING'}
        </div>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇸🇪</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-blue-200">{t('sweden_title')} (Nordic Noir)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('personal_number_se_label')}</label>
          <input 
            type="text" 
            placeholder="YYYYMMDD-XXXX" 
            value={personalNumberSe}
            onChange={(e) => setPersonalNumberSe(e.target.value)}
            className="w-full bg-black/50 border border-blue-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7FFF00] focus:shadow-[0_0_10px_#7FFF00] transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('swish_id_label')}</label>
          <input 
            type="text" 
            placeholder="070 123 45 67" 
            value={swishId}
            onChange={(e) => setSwishId(e.target.value)}
            className="w-full bg-black/50 border border-blue-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7FFF00]"
          />
        </div>
        <button 
          onClick={() => setIsBankIdVerified(!isBankIdVerified)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck size={18} />
          {isBankIdVerified ? 'RE-VERIFY WITH BANKID' : 'VERIFY IDENTITY WITH BANKID'}
        </button>
      </div>
    </div>
  );

  const renderNorway = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#F0F8FF] relative overflow-hidden bg-gradient-to-br from-[#191970] to-black">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇳🇴</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-blue-100">{t('norway_title')} (Nordic Noir)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('national_id_no_label')}</label>
          <input 
            type="text" 
            placeholder="11 digits" 
            value={nationalIdNo}
            onChange={(e) => setNationalIdNo(e.target.value)}
            className="w-full bg-black/50 border border-blue-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7FFF00] transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('vipps_id_label')}</label>
          <input 
            type="text" 
            placeholder="Mobile number" 
            value={vippsId}
            onChange={(e) => setVippsId(e.target.value)}
            className="w-full bg-black/50 border border-blue-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7FFF00]"
          />
        </div>
        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
           <p className="text-xs text-blue-200">
             Vipps settlements are processed instantly for Norwegian artists.
           </p>
        </div>
      </div>
    </div>
  );

  const renderDenmark = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#7FFF00] relative overflow-hidden bg-gradient-to-br from-[#191970] to-black">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇩🇰</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-blue-200">{t('denmark_title')} (Nordic Noir)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('cpr_number_dk_label')}</label>
          <input 
            type="text" 
            placeholder="DDMMYY-XXXX" 
            value={cprNumberDk}
            onChange={(e) => setCprNumberDk(e.target.value)}
            className="w-full bg-black/50 border border-blue-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7FFF00] transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('mobilepay_id_label')}</label>
          <input 
            type="text" 
            placeholder="Mobile number" 
            value={mobilePayId}
            onChange={(e) => setMobilePayId(e.target.value)}
            className="w-full bg-black/50 border border-blue-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#7FFF00]"
          />
        </div>
      </div>
    </div>
  );

  const renderNewZealand = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#4F7942] relative overflow-hidden bg-gradient-to-br from-[#0B0B0B] to-[#1a2e1a]">
      <div className="absolute top-0 right-0 p-4">
        <div className={`px-3 py-1 rounded text-[10px] font-bold ${isRealMeVerified ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
          {isRealMeVerified ? 'REALME VERIFIED' : 'REALME PENDING'}
        </div>
      </div>
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <span className="text-3xl">🇳🇿</span>
        <h3 className="text-xl font-black uppercase font-montserrat text-green-400">{t('new_zealand_title')} (Aotearoa Avant-Garde)</h3>
      </div>
      <div className="space-y-6 relative z-10">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('ird_number_nz_label')}</label>
          <input 
            type="text" 
            placeholder="8-9 digits" 
            value={irdNumberNz}
            onChange={(e) => setIrdNumberNz(e.target.value)}
            className="w-full bg-black/50 border border-green-900/50 rounded-lg p-4 font-montserrat focus:outline-none focus:border-green-500 focus:shadow-[0_0_10px_#4F7942] transition-all text-white"
          />
        </div>
        <button 
          onClick={() => setIsRealMeVerified(!isRealMeVerified)}
          className="w-full py-3 bg-gradient-to-r from-[#00ced1] via-[#9400d3] to-[#4169e1] text-white font-bold rounded-lg transition-all shadow-lg uppercase tracking-widest text-xs"
        >
          Verify with RealMe
        </button>
        <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-xl flex items-center gap-3">
          <svg className="w-6 h-6 fill-green-500" viewBox="0 0 100 100">
             <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 40 85 30 80 25"/>
          </svg>
          <p className="text-xs text-green-200">
            Māori performers can apply for the "Māori Excellence" heritage badge.
          </p>
        </div>
      </div>
    </div>
  );

  const renderMexico = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#E07A5F]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇲🇽</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('mexico_title')}</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('rfc_label')}</label>
          <input 
            type="text" 
            placeholder="ABCD123456XYZ" 
            value={rfc}
            onChange={(e) => setRfc(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#E07A5F] focus:shadow-[0_0_10px_#E07A5F] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('tax_regime_label')}</label>
          <select 
            value={taxRegime}
            onChange={(e) => setTaxRegime(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#E07A5F] appearance-none"
          >
            <option value="RESICO">RESICO (Régimen Simplificado de Confianza)</option>
            <option value="PFAE">Persona Física con Actividad Empresarial</option>
            <option value="SYs">Sueldos y Salarios</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('clabe_label')}</label>
          <input 
            type="text" 
            placeholder="18-digit account number" 
            value={clabe}
            onChange={(e) => setClabe(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#E07A5F]"
          />
        </div>
        <div className="p-4 bg-[#2D5A27]/20 rounded-lg border border-[#2D5A27]/30">
          <p className="text-xs text-gray-300">
            <span className="text-[#E07A5F] font-bold">PRO TIP:</span> {t('resico_tip')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderGermany = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#FF0000]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇩🇪</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('germany_title')}</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('steuernummer_label')}</label>
          <input 
            type="text" 
            placeholder="12/345/67890" 
            value={steuernummer}
            onChange={(e) => setSteuernummer(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#FF0000] focus:shadow-[0_0_10px_#FF0000] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('vat_registration_label')}</label>
          <select 
            value={vatRegistration}
            onChange={(e) => setVatRegistration(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#FF0000] appearance-none"
          >
            <option value="Standard">Standard (19%)</option>
            <option value="Reduced">Reduced (7% - Cultural/Theatre)</option>
            <option value="Small">Small Business (Kleinunternehmer - No VAT)</option>
          </select>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg">
          <input 
            type="checkbox" 
            checked={isKskMember}
            onChange={(e) => setIsKskMember(e.target.checked)}
            className="mt-1 w-5 h-5 accent-[#FF0000]"
          />
          <div>
            <p className="text-sm font-bold text-white">{t('ksk_member_label')}</p>
            <p className="text-xs text-gray-400">{t('ksk_description')}</p>
          </div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-gray-400 uppercase tracking-tighter">
            Compliance State: <span className="text-[#00FFFF] font-black">{loading ? t('validating') : 'READY'}</span>
          </p>
        </div>
      </div>
    </div>
  );

  const renderBrazil = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#009B3A]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇧🇷</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('brazil_title')}</h3>
      </div>
      <div className="space-y-6">
        <div className="flex gap-4">
          <button 
            onClick={() => setBrDocType('CPF')}
            className={`flex-1 font-black text-xs p-3 rounded transition-all ${brDocType === 'CPF' ? 'bg-[#009B3A] text-black' : 'bg-gray-800 text-gray-400'}`}
          >
            {t('individual_cpf')}
          </button>
          <button 
            onClick={() => setBrDocType('CNPJ')}
            className={`flex-1 font-black text-xs p-3 rounded transition-all ${brDocType === 'CNPJ' ? 'bg-[#009B3A] text-black' : 'bg-gray-800 text-gray-400'}`}
          >
            {t('business_cnpj')}
          </button>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('document_number_label')}</label>
          <input 
            type="text" 
            placeholder={brDocType === 'CPF' ? "000.000.000-00" : "00.000.000/0001-00"} 
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#009B3A] focus:shadow-[0_0_10px_#009B3A] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('pix_key_label')}</label>
          <input 
            type="text" 
            placeholder="Email, Phone, or Random Key" 
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#009B3A]"
          />
        </div>
      </div>
    </div>
  );

  const renderThailand = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#BA55D3]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇹🇭</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('thailand_title')}</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('promptpay_id_label')}</label>
          <input 
            type="text" 
            placeholder="Mobile Number or National ID" 
            value={promptPayId}
            onChange={(e) => setPromptPayId(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#BA55D3] focus:shadow-[0_0_10px_#BA55D3] transition-all"
          />
        </div>
        <div className="p-6 border-2 border-dashed border-[#BA55D3]/50 rounded-xl text-center">
          <div className="w-16 h-16 bg-[#BA55D3] mx-auto mb-4 rounded-full flex items-center justify-center shadow-[0_0_20px_#BA55D3]">
            <span className="text-2xl">💸</span>
          </div>
          <p className="text-sm font-bold font-montserrat">{t('promptpay_description')}</p>
        </div>
      </div>
    </div>
  );

  const renderCanada = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#D80621]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇨🇦</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('canada_title')}</h3>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
          <input 
            type="checkbox" 
            checked={isQuebec}
            onChange={(e) => setIsQuebec(e.target.checked)}
            className="w-5 h-5 accent-[#D80621]"
          />
          <div>
            <p className="text-sm font-bold">{t('quebec_toggle')}</p>
            <p className="text-xs text-gray-500 italic">{t('quebec_bill96_tip')}</p>
          </div>
        </div>

        {isQuebec && (
          <div className="animate-in fade-in slide-in-from-top-2 space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
             <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('stage_name_fr_label')}</label>
              <input 
                type="text" 
                placeholder="Votre nom de scène" 
                value={stageNameFr}
                onChange={(e) => setStageNameFr(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#D80621]"
              />
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-black">
              {t('bilingual_display_notice')}
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('sin_label')}</label>
          <input 
            type="text" 
            placeholder="000-000-000" 
            value={sin}
            onChange={(e) => setSin(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#D80621] focus:shadow-[0_0_10px_#D80621] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Payout Method</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={caPayoutMethod === 'interac'} onChange={() => setCaPayoutMethod('interac')} className="accent-[#D80621]" />
              <span className="text-sm">{t('interac_label')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={caPayoutMethod === 'direct_deposit'} onChange={() => setCaPayoutMethod('direct_deposit')} className="accent-[#D80621]" />
              <span className="text-sm">{t('direct_deposit_label')}</span>
            </label>
          </div>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-xs text-gray-400">{t('canada_compliance_tip')}</p>
        </div>
      </div>
    </div>
  );

  const renderSpain = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#FFD700]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇪🇸</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('spain_title')}</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('dni_nie_label')}</label>
          <input 
            type="text" 
            placeholder="X1234567-Z" 
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#FFD700] focus:shadow-[0_0_10px_#FFD700] transition-all"
          />
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
          <input 
            type="checkbox" 
            checked={isAutonomo}
            onChange={(e) => setIsAutonomo(e.target.checked)}
            className="w-5 h-5 accent-[#FFD700]"
          />
          <div>
            <p className="text-sm font-bold text-white">{t('autonomo_label')}</p>
            <p className="text-xs text-gray-400">{t('autonomo_description')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTaiwan = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#00D1FF]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇹🇼</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('taiwan_title')}</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('national_id_label')}</label>
          <input 
            type="text" 
            placeholder="A123456789" 
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#00D1FF] focus:shadow-[0_0_10px_#00D1FF] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('account_name_chinese_label')}</label>
          <input 
            type="text" 
            placeholder="姓名" 
            value={accountNameChinese}
            onChange={(e) => setAccountNameChinese(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#00D1FF]"
          />
        </div>
      </div>
    </div>
  );

  const renderArgentina = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#74ACDF]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇦🇷</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('argentina_title')}</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('cuil_cuit_label')}</label>
          <input 
            type="text" 
            placeholder="20-12345678-9" 
            value={cuil}
            onChange={(e) => setCuil(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#74ACDF] focus:shadow-[0_0_10px_#74ACDF] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('tax_regime_ar_label')}</label>
          <select 
            value={arTaxRegime}
            onChange={(e) => setArTaxRegime(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#74ACDF] appearance-none"
          >
            <option value="Monotributista">{t('monotributista')}</option>
            <option value="Responsable Inscripto">{t('responsable_inscripto')}</option>
            <option value="Consumidor Final">{t('consumidor_final')}</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderJapan = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#D4AF37] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle,at_center,#D4AF37_1px,transparent_1px)] bg-[length:10px_10px]" />
      </div>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇯🇵</span>
        <h3 className="text-xl font-black uppercase font-montserrat tracking-tighter">{t('japan_title')} (Neo-Edo Elegance)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('t_number_label')}</label>
          <input 
            type="text" 
            placeholder="T1234567890123" 
            value={tNumber}
            onChange={(e) => setTNumber(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_10px_#D4AF37] transition-all"
          />
        </div>
        <div className="p-4 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
          <label className="flex items-start gap-4 cursor-pointer">
            <input 
              type="checkbox" 
              checked={hasAsfAgreement}
              onChange={(e) => setHasAsfAgreement(e.target.checked)}
              className="mt-1 w-5 h-5 accent-[#D4AF37]"
            />
            <div>
              <p className="text-sm font-bold text-[#D4AF37] uppercase">{t('asf_clause_label')}</p>
              <p className="text-xs text-gray-400">{t('asf_description')}</p>
            </div>
          </label>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 p-4 bg-black/40 rounded-lg text-center border border-gray-800">
             <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Local Payouts</p>
             <p className="text-sm font-black text-white">PayPay / LINE Pay</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIsrael = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#0077BE]">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl">🇮🇱</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('israel_title')} (Bauhaus Beachfront)</h3>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('national_id_il_label')}</label>
          <input 
            type="text" 
            placeholder="000000000" 
            value={nationalIdIl}
            onChange={(e) => setNationalIdIl(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#0077BE] focus:shadow-[0_0_10px_#0077BE] transition-all"
          />
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
          <input 
            type="checkbox" 
            checked={isIsraelBusiness}
            onChange={(e) => setIsIsraelBusiness(e.target.checked)}
            className="w-5 h-5 accent-[#0077BE]"
          />
          <div>
            <p className="text-sm font-bold text-white">{t('israel_business_label')}</p>
            <p className="text-xs text-gray-400">{t('israel_business_description')}</p>
          </div>
        </div>
        <div className="p-4 bg-[#0077BE]/10 rounded-lg border border-[#0077BE]/20">
          <p className="text-xs text-gray-400">
            <span className="text-[#0077BE] font-bold">SHABBAT NOTICE:</span> {t('shabbat_notice')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderItaly = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#8B0000] relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/marble-white.png')]" />
      <div className="flex items-center gap-4 mb-6 relative">
        <span className="text-3xl">🇮🇹</span>
        <h3 className="text-xl font-black uppercase font-playfair italic">{t('italy_title')} (Renaissance Runway)</h3>
      </div>
      <div className="space-y-6 relative">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('codice_fiscale_label')}</label>
          <input 
            type="text" 
            placeholder="RSSMRA80A01H501W" 
            value={codiceFiscale}
            onChange={(e) => setCodiceFiscale(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#8B0000] focus:shadow-[0_0_10px_#8B0000] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('partita_iva_label')}</label>
          <input 
            type="text" 
            placeholder="IT01234567890 (Optional)" 
            value={partitaIva}
            onChange={(e) => setPartitaIva(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#8B0000]"
          />
        </div>
        <div className="p-4 bg-red-900/10 rounded-lg border border-red-900/30">
          <p className="text-xs text-gray-400">
            {t('siae_notice')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderFrance = () => (
    <div className="glass-card p-8 rounded-2xl border-l-4 border-[#4F7942] relative">
       <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen-2.png')]" />
      <div className="flex items-center gap-4 mb-6 relative">
        <span className="text-3xl">🇫🇷</span>
        <h3 className="text-xl font-black uppercase font-montserrat">{t('france_title')} (Belle Époque Burlesque)</h3>
      </div>
      <div className="space-y-6 relative">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('siret_label')}</label>
          <input 
            type="text" 
            placeholder="123 456 789 00012" 
            value={siret}
            onChange={(e) => setSiret(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 font-montserrat focus:outline-none focus:border-[#4F7942] focus:shadow-[0_0_10px_#4F7942] transition-all"
          />
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
          <input 
            type="checkbox" 
            checked={isIntermittent}
            onChange={(e) => setIsIntermittent(e.target.checked)}
            className="w-5 h-5 accent-[#4F7942]"
          />
          <div>
            <p className="text-sm font-bold text-white">{t('intermittent_label')}</p>
            <p className="text-xs text-gray-400">{t('intermittent_description')}</p>
          </div>
        </div>
        <div className="p-4 bg-[#4F7942]/10 rounded-lg border border-[#4F7942]/30">
          <p className="text-xs text-gray-400 italic">
            {t('france_purity_notice')}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h2 className="text-3xl font-black uppercase tracking-widest mb-4 font-montserrat">{t('title')}</h2>
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['MX', 'DE', 'BR', 'TH', 'CA', 'ES', 'TW', 'AR', 'JP', 'IL', 'IT', 'FR', 'SE', 'NO', 'DK', 'NZ', 'PL', 'CZ', 'HU', 'RO', 'VN', 'PH', 'MY', 'ID', 'KR', 'SA', 'CO', 'AE'].map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-6 py-2 rounded-full border-2 font-black text-xs transition-all whitespace-nowrap ${
                region === r ? 'bg-white text-black border-white' : 'border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              {r === 'MX' && 'MEXICO 🇲🇽'}
              {r === 'DE' && 'GERMANY 🇩🇪'}
              {r === 'BR' && 'BRAZIL 🇧🇷'}
              {r === 'TH' && 'THAILAND 🇹🇭'}
              {r === 'CA' && 'CANADA 🇨🇦'}
              {r === 'ES' && 'SPAIN 🇪🇸'}
              {r === 'TW' && 'TAIWAN 🇹🇼'}
              {r === 'AR' && 'ARGENTINA 🇦🇷'}
              {r === 'JP' && 'JAPAN 🇯🇵'}
              {r === 'IL' && 'ISRAEL 🇮🇱'}
              {r === 'IT' && 'ITALY 🇮🇹'}
              {r === 'FR' && 'FRANCE 🇫🇷'}
              {r === 'SE' && 'SWEDEN 🇸🇪'}
              {r === 'NO' && 'NORWAY 🇳🇴'}
              {r === 'DK' && 'DENMARK 🇩🇰'}
              {r === 'NZ' && 'NEW ZEALAND 🇳🇿'}
              {r === 'PL' && 'POLAND 🇵🇱'}
              {r === 'CZ' && 'CZECH 🇨🇿'}
              {r === 'HU' && 'HUNGARY 🇭🇺'}
              {r === 'RO' && 'ROMANIA 🇷🇴'}
              {r === 'VN' && 'VIETNAM 🇻🇳'}
              {r === 'PH' && 'PHILIPPINES 🇵🇭'}
              {r === 'MY' && 'MALAYSIA 🇲🇾'}
              {r === 'ID' && 'INDONESIA 🇮🇩'}
              {r === 'KR' && 'KOREA 🇰🇷'}
              {r === 'SA' && 'S. AFRICA 🇿🇦'}
              {r === 'CO' && 'COLOMBIA 🇨🇴'}
              {r === 'AE' && 'UAE 🇦🇪'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        {region === 'MX' && renderMexico()}
        {region === 'DE' && renderGermany()}
        {region === 'BR' && renderBrazil()}
        {region === 'TH' && renderThailand()}
        {region === 'CA' && renderCanada()}
        {region === 'ES' && renderSpain()}
        {region === 'TW' && renderTaiwan()}
        {region === 'AR' && renderArgentina()}
        {region === 'JP' && renderJapan()}
        {region === 'IL' && renderIsrael()}
        {region === 'IT' && renderItaly()}
        {region === 'FR' && renderFrance()}
        {region === 'SE' && renderSweden()}
        {region === 'NO' && renderNorway()}
        {region === 'DK' && renderDenmark()}
        {region === 'NZ' && renderNewZealand()}
        {region === 'PL' && renderPoland()}
        {region === 'CZ' && renderCzech()}
        {region === 'HU' && renderHungary()}
        {region === 'RO' && renderRomania()}
        {region === 'VN' && renderVietnam()}
        {region === 'PH' && renderPhilippines()}
        {region === 'MY' && renderMalaysia()}
        {region === 'ID' && renderIndonesia()}
        {region === 'KR' && renderSouthKorea()}
        {region === 'SA' && renderSouthAfrica()}
        {region === 'CO' && renderColombia()}
        {region === 'AE' && renderUAE()}
      </div>

      <div className="flex justify-end gap-4">
        {success ? (
          <div className="flex items-center gap-2 text-emerald-400 font-bold animate-in fade-in">
            <CheckCircle2 size={24} />
            SETTINGS SAVED SUCCESSFULLY
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#00FFFF] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {loading ? t('validating') : 'CONFIRM & SAVE'}
          </button>
        )}
      </div>
    </div>
  );
}

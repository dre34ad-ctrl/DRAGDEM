'use server';

import { team_db } from '@/lib/utils/team-db';
import { createClient } from '@/lib/supabase/server';

export interface LDIBenchmark {
  dignity_standard: number;
  currency: string;
  compliance_requirements: string[];
}

const CITY_BENCHMARKS: Record<string, LDIBenchmark> = {
  'Berlin': {
    dignity_standard: 150,
    currency: 'EUR',
    compliance_requirements: ['KSK Automation', 'Kleinunternehmer Disclaimer']
  },
  'Paris': {
    dignity_standard: 150,
    currency: 'EUR',
    compliance_requirements: ['GUSO Integration', 'SIRET Validation', 'AEM Automatic Export']
  },
  'Madrid': {
    dignity_standard: 120,
    currency: 'EUR',
    compliance_requirements: ['RETA Verification', 'IRPF Withholding (15%)', 'Modelo 111 Support']
  },
  'London': {
    dignity_standard: 150,
    currency: 'GBP',
    compliance_requirements: ['PLI Insurance (Mandatory)', 'VAT Threshold Monitor']
  },
  'Sydney': {
    dignity_standard: 300,
    currency: 'AUD',
    compliance_requirements: ['ABR API Verification', 'Superannuation (11.5%)', 'Osko/NPP Rail']
  },
  'Toronto': {
    dignity_standard: 250,
    currency: 'CAD',
    compliance_requirements: ['HST Registration (>30k)', 'SIN Verification', '2-Spirit Advocacy']
  },
  'Buenos Aires': {
    dignity_standard: 100,
    currency: 'USD',
    compliance_requirements: ['Inflation Hedge (Hard Currency)', 'Monotributo Payouts']
  },
  'CDMX': {
    dignity_standard: 2500,
    currency: 'MXN',
    compliance_requirements: ['RESICO CFDI 4.0', 'RFC Validation', 'e.firma Support']
  },
  'Rio': {
    dignity_standard: 500,
    currency: 'BRL',
    compliance_requirements: ['MEI NFS-e Automation', 'Pix Instant Payout', 'Riotur Data Bridge']
  },
  'Bangkok': {
    dignity_standard: 2000,
    currency: 'THB',
    compliance_requirements: ['e-Withholding Tax', 'PromptPay QR', 'Katoey Identity Support']
  }
};

const SAFE_CITY_PROTOCOLS: Record<string, string> = {
  'Barcelona': 'Protocol No Callem',
  'Valencia': 'Puntos Violeta',
  'Paris': 'Charte de la Vie Nocturne',
  'Lyon': 'Charte de la Vie Nocturne',
  'Madrid': 'Protocolo de Seguridad Nocturna',
  'Berlin': 'Safe Nightlife Berlin',
  'London': 'Ask for Angela',
  'Rio': 'Selo Mulher Segura',
  'CDMX': 'Espacios Seguros CDMX',
};

const REGULATORY_DEMO_DATA: Record<string, any> = {
  'Rio': {
    bridge_name: 'NFS-e / MEI Bridge',
    active_tokens: '4,280',
    total_tax_collected: 'R$ 124,500',
    compliance_status: '92%',
    highlights: [
      { label: 'Pix Velocity', value: 'Instant' },
      { label: 'MEI Adoption', value: 'High' },
      { label: 'Nota Fiscal', value: 'Automated' }
    ]
  },
  'Paris': {
    bridge_name: 'GUSO Regulatory Bridge',
    active_tokens: '2,150',
    total_tax_collected: '€ 85,200',
    compliance_status: '88%',
    highlights: [
      { label: 'AEM Generated', value: '1,420' },
      { label: 'GUSO Declarations', value: '100% Sync' },
      { label: 'SIRET Validated', value: '95%' }
    ]
  },
  'Madrid': {
    bridge_name: 'RETA / IRPF Bridge',
    active_tokens: '1,890',
    total_tax_collected: '€ 62,400',
    compliance_status: '90%',
    highlights: [
      { label: 'IRPF Withheld', value: '15%' },
      { label: 'RETA Active', value: '82%' },
      { label: 'Bizum Tipping', value: 'High' }
    ]
  },
  'Berlin': {
    bridge_name: 'KSK Automation Bridge',
    active_tokens: '3,100',
    total_tax_collected: '€ 112,000',
    compliance_status: '94%',
    highlights: [
      { label: 'KSK Contributions', value: '5.2%' },
      { label: 'Kleinunternehmer', value: 'Verified' },
      { label: 'Senate Reporting', value: 'Live' }
    ]
  }
};

export async function getEconomicPulse(city: string) {
  // Let's try to get real totals from payout_jobs if any exist
  const stats = await team_db(`
    SELECT 
      SUM(amount) as total_gmv, 
      COUNT(*) as total_gigs,
      currency
    FROM payout_jobs 
    WHERE status = 'completed'
    GROUP BY currency
  `);

  // Default mock data if no real transactions exist yet
  const mockTourismImpact = 1245000;
  const mockGigs = 420;
  const mockProAdoption = 82;

  // Let's calculate pro adoption from performer_profiles in Supabase
  const supabase = await createClient();
  const { count: totalPerformers } = await supabase
    .from('performer_profiles')
    .select('*', { count: 'exact', head: true });
  
  const { count: certifiedPerformers } = await supabase
    .from('performer_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('institutional_badge', true);

  const realProAdoption = totalPerformers ? Math.round((certifiedPerformers! / totalPerformers) * 100) : mockProAdoption;

  // For the chart, we'll return some trends
  const monthlyImpact = [
    { month: 'JAN', amount: 400000 },
    { month: 'FEB', amount: 650000 },
    { month: 'MAR', amount: 450000 },
    { month: 'APR', amount: 900000 },
    { month: 'MAY', amount: 1245000 },
    { month: 'JUN', amount: 750000 },
    { month: 'JUL', amount: 850000 },
  ];

  const benchmark = CITY_BENCHMARKS[city] || { 
    dignity_standard: 150, 
    currency: 'USD', 
    compliance_requirements: ['Standard Contract'] 
  };

  const regBridge = REGULATORY_DEMO_DATA[city] || {
    bridge_name: 'Standard Regulatory Bridge',
    active_tokens: '1,200',
    total_tax_collected: '$ 45,000',
    compliance_status: '85%',
    highlights: [
      { label: 'Contracts', value: 'Active' },
      { label: 'Escrow', value: 'Enabled' }
    ]
  };

  return {
    city,
    total_gmv: stats.length > 0 ? stats[0].total_gmv : mockTourismImpact,
    total_gigs: stats.length > 0 ? stats[0].total_gigs : mockGigs,
    pro_adoption: realProAdoption,
    monthly_impact: monthlyImpact,
    international_ratio: 65,
    local_ratio: 35,
    ldi: {
      formalized: 68.5,
      transitioning: 21.5,
      informal: 10.0,
      benchmark: benchmark
    },
    safe_city_funnel: {
      unverified_venues: 1240,
      protocol_adopters: 850,
      certified_safe: 412,
      active_protocol: SAFE_CITY_PROTOCOLS[city] || 'Standard Safety Protocol'
    },
    regulatory_bridge: regBridge,
    tourism_multiplier: 3.4
  };
}

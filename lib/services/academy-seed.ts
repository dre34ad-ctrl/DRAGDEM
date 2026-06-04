import { createClient } from '../supabase/server';

const modules = [
  {
    module_code: 'AC-101',
    title: 'Global Tax Bridge',
    description: 'Mastering VAT, GST, and international invoicing for drag performers.',
    required_for_pro: true,
    metadata: {
      estimated_time: '45m',
      correct_answers: ['B', 'A', 'C', 'D']
    }
  },
  {
    module_code: 'AC-102',
    title: 'Contractual Safety & Insurance',
    description: 'Understanding liability, performance riders, and safety protocols.',
    required_for_pro: true,
    metadata: {
      estimated_time: '60m',
      correct_answers: ['A', 'D', 'B', 'B']
    }
  },
  {
    module_code: 'AC-103',
    title: 'Digital Vault & Multi-Currency Management',
    description: 'How to manage global payouts and secure your digital media assets.',
    required_for_pro: true,
    metadata: {
      estimated_time: '30m',
      correct_answers: ['C', 'C', 'A', 'D']
    }
  },
  {
    module_code: 'AC-104',
    title: 'DEI for Performers',
    description: 'Diversity, Equity, and Inclusion standards for institutional bookings.',
    required_for_pro: true,
    metadata: {
      estimated_time: '40m',
      correct_answers: ['D', 'B', 'C', 'A']
    }
  }
];

export async function seedAcademyModules() {
  const supabase = await createClient();
  
  for (const module of modules) {
    const { error } = await supabase
      .from('academy_modules')
      .upsert(module, { onConflict: 'module_code' });
    
    if (error) {
      console.error(`Error seeding module ${module.module_code}:`, error);
    } else {
      console.log(`Seeded module ${module.module_code}`);
    }
  }
}

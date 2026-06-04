import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';

interface VaultHighlightProps {
  title: string;
  description: string;
  vaultItemId: string;
}

const VaultHighlight: React.FC<VaultHighlightProps> = ({ title, description, vaultItemId }) => {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="bg-linear-to-br from-deep via-black to-deep border-2 border-luxury-gold rounded-[2rem] p-12 relative overflow-hidden group shadow-[0_0_50px_rgba(212,175,55,0.15)]">
        {/* Background Decorative Element */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-luxury-gold opacity-10 rounded-full blur-[80px]" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Item Icon/Preview Area */}
          <div className="w-48 h-48 lg:w-64 lg:h-64 shrink-0 bg-luxury-gold rounded-3xl flex items-center justify-center text-8xl shadow-[0_0_40px_rgba(212,175,55,0.3)] transform transition-transform group-hover:scale-105 duration-500">
            💎
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <ShieldCheck className="text-luxury-gold" size={24} />
              <span className="text-luxury-gold font-montserrat font-black uppercase tracking-[0.2em] text-xs">
                Premium Vault Asset
              </span>
            </div>
            
            <h2 className="text-white text-4xl lg:text-5xl font-montserrat font-black mb-6">
              {title}
            </h2>
            
            <p className="text-gray-400 text-lg mb-10 max-w-2xl">
              {description}
            </p>
            
            <button className="bg-luxury-gold hover:bg-white text-black font-black py-4 px-10 rounded-2xl transition-all flex items-center gap-3 mx-auto lg:mx-0 group/btn shadow-[0_10px_30px_rgba(212,175,55,0.4)]">
              View in Vault
              <ChevronRight className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultHighlight;

import React from 'react';

interface SnapConclusionProps {
  initialSnaps: number;
}

const SnapConclusion: React.FC<SnapConclusionProps> = ({ initialSnaps }) => {
  return (
    <section className="container mx-auto px-4 py-32 text-center">
      <h4 className="font-montserrat font-black text-primary uppercase tracking-[0.4em] mb-12 text-sm">
        Show your appreciation
      </h4>
      
      <div className="relative inline-block group">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-primary opacity-20 rounded-full blur-[100px] group-hover:opacity-40 transition-opacity" />
        
        <button className="relative z-10 text-[10rem] md:text-[12rem] cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 bg-transparent border-none">
          🫰
        </button>
      </div>
      
      <div className="mt-8">
        <p className="text-luxury-gold font-montserrat font-black text-2xl uppercase tracking-widest">
          {initialSnaps.toLocaleString()} Snaps
        </p>
        <p className="text-gray-600 text-xs mt-2 uppercase font-black tracking-widest">
          Platform Global Appreciation
        </p>
      </div>
    </section>
  );
};

export default SnapConclusion;

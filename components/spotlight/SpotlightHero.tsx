import React from 'react';

interface SpotlightHeroProps {
  artistName: string;
  tagline: string;
  imageUrl: string;
}

const SpotlightHero: React.FC<SpotlightHeroProps> = ({ artistName, tagline, imageUrl }) => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background with Parallax effect using CSS */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0 scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Cinematic Lighting Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, black 90%) opacity-60 z-10" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center px-4">
        <div className="inline-flex items-center gap-4 bg-black/60 backdrop-blur-md border border-luxury-gold/30 text-luxury-gold px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-12 animate-fade-in shadow-glow-gold/10">
          <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
          Editorial Spotlight
          <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
        </div>
        
        <h1 className="font-playfair italic text-8xl md:text-[12rem] leading-[0.8] mb-8 animate-slide-up glamour-heading">
          {artistName.toUpperCase()}
        </h1>
        
        <p className="font-montserrat text-secondary text-xl md:text-3xl uppercase tracking-[0.6em] font-black animate-fade-in [animation-delay:500ms] drop-shadow-glow-cyan">
          {tagline}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity cursor-default animate-bounce">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Explore Story</span>
        <div className="w-[1px] h-12 bg-linear-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default SpotlightHero;

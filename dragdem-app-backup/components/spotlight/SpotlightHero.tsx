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
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 z-10" />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4">
        <span className="inline-block bg-luxury-gold text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em] mb-8 animate-fade-in">
          Artist Spotlight
        </span>
        <h1 className="font-playfair italic text-7xl md:text-9xl text-white mb-6 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-slide-up">
          {artistName}
        </h1>
        <p className="font-inter text-cyan-400 text-lg md:text-2xl uppercase tracking-[0.5em] font-light animate-fade-in delay-300">
          {tagline}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <span className="text-white text-3xl font-light">↓</span>
      </div>
    </section>
  );
};

export default SpotlightHero;

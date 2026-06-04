import React from 'react';

interface NarrativeFlowProps {
  quote: string;
  story: string;
  stats: { label: string; value: string }[];
}

const NarrativeFlow: React.FC<NarrativeFlowProps> = ({ quote, story, stats }) => {
  return (
    <section className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        {/* Left Column - Main Narrative */}
        <div className="lg:col-span-7">
          <blockquote className="border-l-4 border-primary pl-8 mb-12">
            <p className="font-inter text-3xl md:text-4xl font-bold leading-tight text-white italic">
              "{quote}"
            </p>
          </blockquote>
          
          <div className="font-inter text-lg text-gray-400 leading-relaxed space-y-6">
            <p>{story}</p>
          </div>
          
          {/* Secondary Media - Asymmetric placement */}
          <div className="mt-20 h-[500px] w-full rounded-3xl overflow-hidden border-2 border-secondary/30 relative group">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
             <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
             <div className="absolute bottom-8 left-8">
               <p className="text-white font-montserrat font-black uppercase tracking-widest text-xs">Stage Presence</p>
             </div>
          </div>
        </div>

        {/* Right Column - Stats & Sticky Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="bg-surface/40 backdrop-blur-3xl p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="font-montserrat font-black text-white uppercase tracking-widest text-sm mb-8 text-secondary">
              Performance Stats
            </h3>
            
            <div className="space-y-8">
              {stats.map((stat, index) => (
                <div key={index} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                  <p className="text-gray-500 text-xs font-black uppercase tracking-tighter mb-2">
                    {stat.label}
                  </p>
                  <p className="text-white text-2xl font-montserrat font-bold">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
               <div className="flex items-center gap-4 text-gray-400">
                 <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer">IG</div>
                 <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer">TW</div>
                 <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer">YT</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NarrativeFlow;

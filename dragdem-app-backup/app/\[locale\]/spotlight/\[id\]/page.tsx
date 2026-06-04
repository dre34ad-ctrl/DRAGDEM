import React from 'react';
import Navbar from "@/components/Navbar";
import SpotlightHero from "@/components/spotlight/SpotlightHero";
import NarrativeFlow from "@/components/spotlight/NarrativeFlow";
import VaultHighlight from "@/components/spotlight/VaultHighlight";
import SnapConclusion from "@/components/spotlight/SnapConclusion";
import { getLocalizedString } from "@/lib/i18n";
import { Calendar } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function SpotlightPage({ params }: PageProps) {
  const { id, locale } = await params;

  // Fetch localized content from database
  const artistName = id === 'sasha-sparkle' ? 'Sasha Sparkle' : id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const tagline = await getLocalizedString(id, 'spotlight_tagline', locale) || "The Architect of Neo-Noir";
  const quote = await getLocalizedString(id, 'spotlight_quote', locale) || "Drag is not just a performance; it's a structural disruption of the expected. In New York, we don't just walk the stage—we haunt it.";
  const story = await getLocalizedString(id, 'spotlight_story', locale) || "Sasha Sparkle has redefined the boundaries of the cabaret stage. With a career spanning a decade between Berlin and NYC, her 'Neon-Noir' aesthetic has become a signature that venues worldwide clamor to host. Today, we dive deep into her creative process, her reliance on the Drag Vault, and why she believes the future of drag is digital and distributed.";
  
  const stats = [
    { label: "Base City", value: "New York" },
    { label: "Specialty", value: "Stunt Artistry" },
    { label: "Experience", value: "12+ Years" },
    { label: "Global Gigs", value: "450+" }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      <SpotlightHero 
        artistName={artistName}
        tagline={tagline}
        imageUrl="https://images.unsplash.com/photo-1574434311832-723ec0833b5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
      />
      
      <NarrativeFlow 
        quote={quote}
        story={story}
        stats={stats}
      />
      
      <VaultHighlight 
        title="The OLED Cyber-Gown"
        description="Includes full technical rider, lighting cues, and a 4K performance demo of the world's first wearable OLED drag costume."
        vaultItemId="v-cyber-gown-001"
      />
      
      <SnapConclusion initialSnaps={1240} />
      
      {/* STICKY BOOKING CTA */}
      <div className="fixed bottom-10 right-10 z-50 animate-fade-in delay-1000">
        <Link 
          href={`/profile/${id}/book`}
          className="bg-luxury-gold hover:bg-white text-black font-black py-6 px-10 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.6)] border-2 border-white/20 transition-all transform hover:scale-110 flex items-center gap-3 uppercase tracking-widest text-sm"
        >
          <Calendar size={20} />
          Book {artistName}
        </Link>
      </div>
      
      {/* Footer Decoration */}
      <div className="py-20 text-center opacity-20">
        <p className="font-playfair italic text-white text-4xl">Dragdem Editorial Spotlight</p>
      </div>
    </main>
  );
}

import Navbar from "@/components/Navbar";
import { BadgeCheck, Calendar, MapPin, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import { ProfileJSONLD } from "@/components/seo/ProfileJSONLD";
import { getLocalizedString } from "@/lib/i18n";
import ProfileClient from "./ProfileClient";
import type { Metadata } from "next";
import { getVaultAssets } from "@/lib/actions/vault";
import { getPulsePosts } from "@/lib/actions/pulse";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string, locale: string }> }): Promise<Metadata> {
  const { id, locale } = await params;
  
  const dbBio = await getLocalizedString(id, 'performer_bio', locale);
  const artistName = id === 'sasha-sparkle' ? "Sasha Sparkle" : id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const location = "New York, NY";
  const category = "Concept Artist & Stunt Queen";

  return {
    title: `${artistName} - Professional ${category} in ${location} | DRAGDEM`,
    description: dbBio || `Book ${artistName} for professional drag performances, hosting, and private events in ${location}. View portfolio, performance videos, and verified reviews on DRAGDEM.`,
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === id;

  const vaultAssets = await getVaultAssets(id);

  // Fetch localized bio and tech rider from database
  const dbBio = await getLocalizedString(id, 'performer_bio', locale);
  const dbTechAudio = await getLocalizedString(id, 'tech_rider_audio', locale);
  const dbTechStage = await getLocalizedString(id, 'tech_rider_stage', locale);

  // In a real app, we'd fetch this data based on the [id] param
  const profile = {
    id,
    stage_name: id === 'sasha-sparkle' ? "Sasha Sparkle" : id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    bio: dbBio || "Biography not available in this language.",
    location: "New York, NY",
    categories: ["Pop", "Comedy"],
    tech_audio: dbTechAudio ? dbTechAudio.split(';') : [
      "Wireless headset microphone (Shure preferred)",
      "Professional PA system with XLR inputs",
      "Stage lighting: Pink/Cyan wash with spot"
    ],
    tech_stage: dbTechStage ? dbTechStage.split(';') : [
      "Minimum stage size 12'x10' (Non-slip)",
      "Private, lockable dressing area",
      "Cold water, full-length mirror, fan"
    ]
  };

  const backstagePosts = await getPulsePosts({ performerId: id, category: 'backstage' });

  return (
    <main className="min-h-screen bg-black">
      <ProfileJSONLD 
        stageName={profile.stage_name}
        bio={profile.bio}
        location={profile.location}
        image="https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=2070&auto=format&fit=crop"
      />
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-20">
          <div className="flex flex-col md:flex-row gap-10 items-end">
            <div className="w-56 h-56 rounded-3xl border-4 border-primary bg-surface overflow-hidden shadow-[0_0_50px_rgba(255,0,255,0.3)] relative group">
              <div className="w-full h-full bg-surface flex items-center justify-center text-6xl">💃</div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-black text-white uppercase tracking-[0.2em]">View Gallery</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-6xl font-montserrat font-black text-white">{profile.stage_name}</h1>
                <BadgeCheck className="text-cyan-400" size={40} />
                <span className="bg-yellow-600 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Verified Pro</span>
              </div>
              <p className="text-2xl text-gray-300 mt-4 flex items-center gap-3 font-medium">
                <MapPin size={24} className="text-pink-600" />
                {profile.location} <span className="text-gray-600">|</span> Concept Artist & Stunt Queen
              </p>
              
              {/* LATEST FROM BACKSTAGE snippet */}
              {backstagePosts.length > 0 && (
                <div className="mt-8 p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-between items-center max-w-2xl shadow-2xl">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">✨</span>
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Latest from Backstage</p>
                      <p className="text-sm text-gray-200 truncate font-medium">"{backstagePosts[0].content}"</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 pl-6 border-l border-white/10 ml-6">
                    <div className="text-center">
                      <p className="text-lg">🫰</p>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">42 Snaps</p>
                    </div>
                    <button className="text-[10px] bg-cyan-400 text-black px-4 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-white transition-colors">View</button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-5 mt-10">
                <Link href={`/profile/${id}/book`} className="bg-pink-600 hover:bg-pink-500 text-white font-black py-4 px-12 rounded-2xl shadow-[0_0_25px_rgba(219,39,119,0.4)] transition-all transform hover:scale-105 flex items-center gap-3 text-sm uppercase tracking-widest">
                  <Calendar size={20} />
                  Book Now
                </Link>
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-pink-600 hover:bg-pink-600/10 transition-all group" title="Social Link">
                     <ExternalLink size={24} className="text-gray-400 group-hover:text-pink-600" />
                   </div>
                   <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-pink-600 hover:bg-pink-600/10 transition-all group" title="Global Tour Info">
                     <Globe size={24} className="text-gray-400 group-hover:text-pink-600" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileClient 
        profile={profile} 
        backstagePosts={backstagePosts} 
        vaultAssets={vaultAssets}
        isOwner={isOwner}
      />
    </main>
  );
}

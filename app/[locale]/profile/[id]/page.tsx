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
import SafeCityBadge from "@/components/dashboard/SafeCityBadge";
import { getPerformerVerification, refreshDignitySeal } from "@/lib/actions/verifications";
import { ProfileBadges } from "@/components/profile/ProfileBadges";

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

  // Fetch performer profile data for badges
  const { data: profileData } = await supabase
    .from('performer_profiles')
    .select('institutional_badge, search_priority')
    .eq('id', id)
    .single();

  const verifications = await getPerformerVerification(id);
  
  // Refresh dignity seal in the background or during request if needed
  if (id) {
    await refreshDignitySeal(id);
  }

  const vaultAssets = await getVaultAssets(id);

  // Fetch localized bio and tech rider from database
  const dbBio = await getLocalizedString(id, 'performer_bio', locale);
  const dbTechAudio = await getLocalizedString(id, 'tech_rider_audio', locale);
  const dbTechStage = await getLocalizedString(id, 'tech_rider_stage', locale);

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
    ],
    institutional_badge: profileData?.institutional_badge || false
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
      <div className="relative h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-black/80 z-5" />
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16 relative z-20">
          <div className="flex flex-col md:flex-row gap-12 items-end">
            <div className="w-64 h-64 rounded-[2.5rem] border-4 border-luxury-gold bg-black overflow-hidden shadow-glow-gold/20 relative group transition-transform hover:scale-105 duration-500">
              <div className="w-full h-full bg-black flex items-center justify-center text-8xl">💃</div>
              <div className="absolute inset-0 bg-luxury-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-black text-white uppercase tracking-[0.3em] backdrop-blur-sm">View Portfolio</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-6 flex-wrap mb-6">
                <h1 className="text-7xl md:text-8xl font-playfair font-bold text-white italic tracking-tighter drop-shadow-2xl">{profile.stage_name}</h1>
                <div className="flex items-center gap-3">
                  {profile.institutional_badge && <SafeCityBadge type="performer" />}
                  <ProfileBadges 
                    isVerified={verifications?.is_verified || false} 
                    hasDignitySeal={verifications?.has_dignity_seal || false} 
                  />
                </div>
              </div>
              <p className="text-3xl text-gray-300 flex items-center gap-4 font-light italic mb-10">
                <MapPin size={28} className="text-secondary" />
                {profile.location} <span className="text-gray-700 not-italic mx-2">|</span> Concept Artist & Stunt Queen
              </p>
              
              {/* LATEST FROM BACKSTAGE snippet */}
              {backstagePosts.length > 0 && (
                <div className="mb-10 p-6 bg-deep-charcoal/60 backdrop-blur-2xl border border-white/5 rounded-3xl flex justify-between items-center max-w-3xl shadow-2xl group cursor-pointer hover:border-secondary/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-glow-magenta/20">
                      <span className="text-2xl group-hover:animate-bounce">✨</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-secondary font-black uppercase tracking-[0.4em] mb-2">The Pulse: Backstage</p>
                      <p className="text-lg text-gray-200 truncate font-light italic">"{backstagePosts[0].content}"</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 shrink-0 pl-8 border-l border-white/10 ml-8">
                    <div className="text-center group-hover:scale-110 transition-transform">
                      <p className="text-2xl mb-1">🫰</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">42 Snaps</p>
                    </div>
                    <button className="text-[11px] bg-secondary text-black px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-glow-cyan/20">View Post</button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-6">
                <Link href={`/profile/${id}/book`} className="group relative bg-primary text-white font-black py-5 px-14 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-glow-magenta active:scale-95 flex items-center gap-4 text-sm uppercase tracking-[0.2em]">
                  <Calendar size={20} className="group-hover:rotate-12 transition-transform" />
                  Book Now
                  <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-full bg-deep-charcoal border border-white/10 flex items-center justify-center cursor-pointer hover:border-luxury-gold hover:bg-luxury-gold/10 transition-all group shadow-2xl" title="Social Link">
                     <ExternalLink size={24} className="text-gray-400 group-hover:text-luxury-gold" />
                   </div>
                   <div className="w-16 h-16 rounded-full bg-deep-charcoal border border-white/10 flex items-center justify-center cursor-pointer hover:border-secondary hover:bg-secondary/10 transition-all group shadow-2xl" title="Global Tour Info">
                     <Globe size={24} className="text-gray-400 group-hover:text-secondary" />
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

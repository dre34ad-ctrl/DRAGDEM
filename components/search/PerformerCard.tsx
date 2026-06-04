"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { MapPin, User, ChevronRight } from "lucide-react";
import SafeCityBadge from "@/components/dashboard/SafeCityBadge";

interface PerformerCardProps {
  performer: any;
}

export default function PerformerCard({ performer }: PerformerCardProps) {
  const t = useTranslations("search");
  
  return (
    <div className="glass-panel border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all duration-500 group shadow-2xl relative">
      <div className="aspect-square relative overflow-hidden bg-zinc-900">
        {performer.users?.image_url ? (
          <img
            src={performer.users.image_url}
            alt={performer.stage_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-800">
            <User size={120} strokeWidth={1} />
          </div>
        )}
        
        {/* Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />

        {/* Phase 11: Institutional Badge Overlay */}
        {performer.institutional_badge && (
          <div className="absolute top-6 left-6 z-10 scale-90 origin-top-left drop-shadow-2xl">
            <SafeCityBadge type="performer" showLabel={false} />
          </div>
        )}

        <div className="absolute top-6 right-6 bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-glow-magenta border border-primary/20">
          {performer.drag_style || "Queen"}
        </div>
      </div>
      
      <div className="p-8 relative">
        <div className="mb-4">
          <h3 className="text-3xl font-black font-montserrat tracking-tighter text-white group-hover:text-primary transition-colors italic">
            {performer.stage_name.toUpperCase()}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-xs font-black uppercase tracking-widest mb-6">
          <MapPin size={14} className="text-secondary" />
          <span>{performer.location || "GLOBAL"}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8 min-h-[24px]">
          {Array.from(new Set(performer.media_kits?.flatMap((mk: any) => mk.act_clips?.map((ac: any) => ac.genre)) || [])).slice(0, 2).map((genre: any) => (
            <span key={genre} className="bg-white/5 px-3 py-1 rounded-lg text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 border border-white/5">
              {genre}
            </span>
          ))}
          {performer.institutional_badge && (
            <span className="bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-lg text-[9px] uppercase tracking-[0.15em] font-black text-secondary shadow-glow-cyan/10">
              Verified Pro
            </span>
          )}
        </div>
        
        <Link
          href={`/profile/${performer.vanity_url || performer.id}`}
          className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-900 border border-white/5 text-white rounded-2xl font-black hover:bg-primary hover:border-primary transition-all text-[11px] uppercase tracking-[0.3em] shadow-xl group/btn"
        >
          {t("view_profile")}
          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

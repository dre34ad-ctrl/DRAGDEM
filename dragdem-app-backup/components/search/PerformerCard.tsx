"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface PerformerCardProps {
  performer: any;
}

export default function PerformerCard({ performer }: PerformerCardProps) {
  const t = useTranslations("search");
  
  return (
    <div className="bg-surface border border-gray-800 rounded-3xl overflow-hidden hover:border-primary/50 transition-all group">
      <div className="aspect-square relative overflow-hidden bg-deep">
        {performer.users?.image_url ? (
          <img 
            src={performer.users.image_url} 
            alt={performer.stage_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <span className="text-6xl font-bold">?</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {performer.drag_style || "Queen"}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors text-white">
          {performer.stage_name}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <MapPin size={14} />
          <span>{performer.location || "Unknown"}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {Array.from(new Set(performer.media_kits?.flatMap((mk: any) => mk.act_clips?.map((ac: any) => ac.genre)) || [])).slice(0, 3).map((genre: any) => (
            <span key={genre} className="bg-deep px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold text-gray-500">
              {genre}
            </span>
          ))}
        </div>
        
        <Link 
          href={`/profile/${performer.vanity_url || performer.id}`}
          className="w-full block text-center py-3 bg-deep border border-gray-700 text-white rounded-xl font-bold hover:bg-primary hover:border-primary transition-all"
        >
          {t("view_profile")}
        </Link>
      </div>
    </div>
  );
}

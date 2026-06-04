"use client";

import { useTranslations } from "next-intl";
import { Search, MapPin, Tag } from "lucide-react";

interface SearchFiltersProps {
  query: string;
  location: string;
  category: string;
  onFilterChange: (filters: { query?: string; location?: string; category?: string }) => void;
}

export default function SearchFilters({ query, location, category, onFilterChange }: SearchFiltersProps) {
  const t = useTranslations("search");
  const tp = useTranslations("performer");

  return (
    <div className="bg-surface border border-gray-800 p-6 rounded-3xl mb-12 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder={t("query_placeholder")}
            className="w-full bg-deep border border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-primary outline-hidden transition-all"
            value={query}
            onChange={(e) => onFilterChange({ query: e.target.value })}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder={t("location_placeholder")}
            className="w-full bg-deep border border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-primary outline-hidden transition-all"
            value={location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
          />
        </div>

        <div className="relative">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <select
            className="w-full bg-deep border border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-primary outline-hidden appearance-none transition-all"
            value={category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
          >
            <option value="">{t("category_placeholder")}</option>
            <optgroup label="Identities">
              <option value="Drag Queen">{tp("drag_queen_option")}</option>
              <option value="Drag King">{tp("drag_king_option")}</option>
              <option value="Bio-Queen">{tp("bio_queen_option")}</option>
              <option value="Transformista">{tp("transformista_option")}</option>
              <option value="2-Spirit">{tp("two_spirit_option")}</option>
              <option value="Katoey">{tp("katoey_option")}</option>
            </optgroup>
            <optgroup label="Performance Style">
              <option value="Comedy">Comedy</option>
              <option value="Stunts">Stunts</option>
              <option value="Lip Sync">Lip Sync</option>
              <option value="Live Vocals">Live Vocals</option>
              <option value="Dance">Dance</option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}

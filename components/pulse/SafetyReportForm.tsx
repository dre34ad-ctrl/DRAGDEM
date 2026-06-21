'use client';

import React, { useState } from 'react';
import { ShieldAlert, Star, Calendar, MapPin, Send, Loader2 } from 'lucide-react';
import { submitSafetyReport } from '@/lib/actions/safety';
import { useRouter, useParams } from 'next/navigation';

export const SafetyReportForm = () => {
  const router = useRouter();
  const { locale } = useParams();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      venue_name: formData.get('venue_name') as string,
      location: formData.get('location') as string,
      incident_date: formData.get('incident_date') as string,
      rating: rating,
      description: formData.get('description') as string,
    };

    try {
      await submitSafetyReport(data);
      router.push(`/${locale}/community/safety?success=true`);
    } catch (error) {
      console.error(error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/50 border border-[#FF00FF]/20 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif italic text-white">Submit Safety Report</h2>
        <p className="text-gray-500 text-xs uppercase tracking-widest font-black">Professional Performer Contribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FFFF] flex items-center gap-2">
            <MapPin size={12} /> Venue Name
          </label>
          <input 
            required
            name="venue_name"
            placeholder="e.g. Club Royale"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF00FF]/50 transition-all placeholder:text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FFFF] flex items-center gap-2">
            <MapPin size={12} /> Location (City, Country)
          </label>
          <input 
            required
            name="location"
            placeholder="e.g. Berlin, Germany"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF00FF]/50 transition-all placeholder:text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FFFF] flex items-center gap-2">
            <Calendar size={12} /> Incident Date
          </label>
          <input 
            required
            type="date"
            name="incident_date"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF00FF]/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FFFF] flex items-center gap-2">
            <Star size={12} /> Safety Rating (1-5 Stars)
          </label>
          <div className="flex gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-125"
              >
                <Star 
                  size={24} 
                  className={`${
                    (hoverRating || rating) >= star 
                      ? 'fill-[#D4AF37] text-[#D4AF37]' 
                      : 'text-gray-800'
                  } transition-colors`} 
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FFFF]">
          Detailed Description
        </label>
        <textarea 
          required
          name="description"
          rows={5}
          placeholder="Describe your experience regarding security, environment, and staff..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF00FF]/50 transition-all placeholder:text-gray-700 resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="anon" className="w-4 h-4 rounded border-white/10 bg-white/5 accent-[#FF00FF]" />
        <label htmlFor="anon" className="text-xs text-gray-500 italic">Submit report anonymously</label>
      </div>

      <div className="pt-4">
        <button 
          disabled={loading || rating === 0}
          type="submit"
          className="w-full bg-[#FF00FF] hover:bg-[#FF00FF]/80 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-black py-4 rounded-full uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition flex items-center justify-center gap-3 shadow-glow-pink/30"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          Submit to Index
        </button>
      </div>
    </form>
  );
};

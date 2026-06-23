import ArtistProfileSignature from "@/components/profile/ArtistProfileSignature";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignaturePreviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-8 px-4 flex justify-between items-center border-b border-white/5 mb-8">
        <div>
          <h1 className="text-luxury-gold font-bold uppercase tracking-widest text-sm">Signature Profile Preview</h1>
          <p className="text-gray-500 text-[10px] uppercase font-bold mt-1">This is how your profile will look to elite venues</p>
        </div>
        <a href="/dashboard" className="text-white bg-white/5 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
          Back to Dashboard
        </a>
      </div>
      <ArtistProfileSignature />
    </div>
  );
}

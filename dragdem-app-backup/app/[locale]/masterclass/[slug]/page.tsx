import Navbar from "@/components/Navbar";
import { getMasterclassBySlug } from "@/lib/actions/masterclass";
import MasterclassClient from "./MasterclassClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string, locale: string }> 
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const masterclass = await getMasterclassBySlug(slug);
  
  if (!masterclass) return {};
  
  const market = locale.toUpperCase();
  
  return {
    title: `Masterclass: ${masterclass.title} with ${masterclass.author_name} | DRAGDEM ${market}`,
    description: `Enhance your drag skills with ${masterclass.author_name}. Learn ${masterclass.title} from the world's top drag professionals. Enroll now on DRAGDEM.`,
  };
}

export default async function MasterclassDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string, locale: string }> 
}) {
  const { slug, locale } = await params;
  const masterclass = await getMasterclassBySlug(slug);

  if (!masterclass) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <MasterclassClient masterclass={masterclass} locale={locale} />
    </main>
  );
}

import PulseClient from "./PulseClient";
import type { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  // Define regions for description based on locale
  const regionNames: Record<string, string> = {
    en: "Global",
    de: "German",
    fr: "French",
    mx: "Mexican",
    br: "Brazilian",
    th: "Thai"
  };
  
  const region = regionNames[locale] || "Global";
  const year = new Date().getFullYear();

  return {
    title: `The Pulse - Drag News & Trends ${year} | DRAGDEM`,
    description: `Explore the latest news, interviews, and trends in the ${region} drag scene. Curated by DRAGDEM.`,
  };
}

export default async function PulsePage() {
  return <PulseClient />;
}

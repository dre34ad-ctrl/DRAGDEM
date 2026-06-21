import PulseClient from "./PulseClient";
import type { Metadata } from "next";
import { promises as fs } from 'fs';
import path from 'path';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
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
  let safeCityData = [];
  try {
    const filePath = path.join(process.cwd(), '../../../shared/safe_city_index_data.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(fileContent);
    safeCityData = json.safe_city_index;
  } catch (error) {
    console.error('Error reading safe city data:', error);
    // Fallback data if file not found in build context
    safeCityData = [];
  }

  return <PulseClient safeCityData={safeCityData} />;
}

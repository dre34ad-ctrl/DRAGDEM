import { MetadataRoute } from 'next'
import { getMasterclasses } from '@/lib/actions/masterclass'
import { searchPerformers } from '@/lib/supabase/performers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dragdem.com'
  const locales = ['en', 'de', 'fr', 'mx', 'br', 'th']
  
  // Base pages
  const staticRoutes = ['', '/pulse', '/search', '/vault']
  
  const entries: MetadataRoute.Sitemap = []
  
  // Static Routes
  for (const route of staticRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
      })
    }
  }
  
  // Performers
  try {
    const { performers } = await searchPerformers({ limit: 100 })
    for (const performer of performers) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/profile/${performer.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      }
    }
  } catch (e) {
    console.error('Sitemap performer fetch failed', e)
  }
  
  // Masterclasses
  try {
    const masterclasses = await getMasterclasses()
    for (const mc of masterclasses) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/masterclass/${mc.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        })
      }
    }
  } catch (e) {
    console.error('Sitemap masterclass fetch failed', e)
  }
  
  return entries
}

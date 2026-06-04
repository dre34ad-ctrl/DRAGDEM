import { teamDb } from '../lib/db';

export async function getLocalizedString(resourceId: string, resourceType: string, locale: string): Promise<string | null> {
  try {
    const result = await teamDb(`SELECT value FROM localized_strings WHERE resource_id = '${resourceId}' AND resource_type = '${resourceType}' AND locale = '${locale}'`);
    if (result && result.length > 0) {
      return result[0].value;
    }
    // Fallback to English if not found
    if (locale !== 'en') {
      const fallback = await teamDb(`SELECT value FROM localized_strings WHERE resource_id = '${resourceId}' AND resource_type = '${resourceType}' AND locale = 'en'`);
      if (fallback && fallback.length > 0) {
        return fallback[0].value;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching localized string:', error);
    return null;
  }
}

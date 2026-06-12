import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'de', 'fr', 'mx', 'br', 'pt', 'th', 'jp', 'it', 'il', 'es', 'pl', 'sv', 'no', 'da', 'ko', 'vi', 'ar', 'zh', 'ph', 'he', 'kr'];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  // Load English messages as base/fallback
  const enMessages = (await import(`../messages/en.json`)).default;
  
  // If locale is English, just return English messages
  if (locale === 'en') {
    return {
      locale: 'en',
      messages: enMessages
    };
  }

  // Load current locale messages
  let localeMessages;
  try {
    localeMessages = (await import(`../messages/${locale}.json`)).default;
  } catch (e) {
    localeMessages = {};
  }

  return {
    locale: locale as string,
    messages: deepMerge(enMessages, localeMessages)
  };
});

/**
 * Simple deep merge to ensure localized namespaces don't completely overwrite 
 * English namespaces if keys are missing.
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (target && typeof target === 'object' && source && typeof source === 'object') {
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

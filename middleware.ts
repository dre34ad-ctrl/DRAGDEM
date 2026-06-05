import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'de', 'fr', 'mx', 'br', 'pt', 'th', 'jp', 'it', 'il', 'es', 'pl', 'sv', 'no', 'da', 'ko', 'vi', 'ar', 'zh', 'ph', 'he', 'kr'],

  // Used when no locale matches
  defaultLocale: 'en'
});

export const config = {
  // Match all pathnames including the root /
  // and specific locale prefixes
  matcher: ['/', '/(en|de|fr|mx|br|pt|th|jp|it|il|es|pl|sv|no|da|ko|vi|ar|zh|ph|he|kr)/:path*']
};

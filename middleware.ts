import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'de', 'fr', 'mx', 'br', 'pt', 'th', 'jp', 'it', 'il', 'es', 'pl', 'sv', 'no', 'da', 'ko', 'vi', 'ar', 'zh', 'ph', 'he', 'kr'],

  // Used when no locale matches
  defaultLocale: 'en'
});

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /.* (files in public directory, e.g. /favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

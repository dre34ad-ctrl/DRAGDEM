import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'de', 'fr', 'mx', 'br', 'pt', 'th', 'jp', 'it', 'il', 'es', 'pl', 'sv', 'no', 'da', 'ko', 'vi', 'ar', 'zh', 'ph', 'he', 'kr'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

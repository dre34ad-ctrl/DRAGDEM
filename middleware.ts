import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|de|fr|mx|br|pt|th|jp|it|il|es|pl|sv|no|da|ko|vi|ar|zh|ph|he|kr)/:path*', '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png).*)']
};

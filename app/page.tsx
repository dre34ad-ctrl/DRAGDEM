import { redirect } from 'next/navigation';

/**
 * Fallback redirect to default locale in case middleware is bypassed.
 */
export default function RootPage() {
  redirect('/en');
}

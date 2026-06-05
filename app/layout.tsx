import { ReactNode } from 'react';

/**
 * Root layout required by Next.js app directory structure.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

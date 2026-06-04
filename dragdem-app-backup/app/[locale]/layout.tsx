import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "../globals.css";
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "DRAGDEM.com - Professional Backbone for Drag Excellence",
    description: "Manage bookings, assets, and media kits for the modern drag performer.",
    alternates: {
      canonical: `https://dragdem.com/${locale}`,
      languages: {
        'x-default': 'https://dragdem.com/',
        'de-de': 'https://dragdem.com/de',
        'fr-fr': 'https://dragdem.com/fr',
        'es-mx': 'https://dragdem.com/mx',
        'pt-br': 'https://dragdem.com/br',
        'th-th': 'https://dragdem.com/th',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${inter.variable} ${montserrat.variable} ${playfair.variable} antialiased bg-deep text-white`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

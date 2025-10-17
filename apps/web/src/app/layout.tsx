import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
// import "./globals.css";
import GlobalLayout from '@/layout/global';
import { GlobalStyles } from '@/styles/global';
// import '@rainbow-me/rainbowkit/styles.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Lumina',
  description: 'Lumina web',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <>
          <GlobalStyles />
          <GlobalLayout>{children}</GlobalLayout>
        </>
      </body>
    </html>
  );
}

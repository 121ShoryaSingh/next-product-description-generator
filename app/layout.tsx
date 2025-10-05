import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProductAI',
  description:
    "A Next.js application that leverages Google's Gemini AI to automatically generate SEO-optimized product descriptions and metadata from product images. This tool streamlines the content creation process by analyzing visual product data and producing relevant, search engine-friendly content at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

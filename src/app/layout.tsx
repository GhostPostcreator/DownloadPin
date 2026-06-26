
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Pinterest Media Downloader - High Quality Image & Video Downloader',
  description: 'Download public Pinterest videos, high resolution images, and GIFs in one-click.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans min-flex flex-col min-h-screen transition-colors">
        <Navbar />
        <main className="flex-grow py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

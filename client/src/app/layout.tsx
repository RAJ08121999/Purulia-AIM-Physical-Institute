import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Purulia Aim Physical Institute (AIM) | Free Defence Physical Training',
  description:
    'Purulia Aim Physical Institute (AIM) provides 100% free physical training by Anup Kumar Mahato (ex-Army Havaldar) for Indian Army, Police, Navy, Air Force, RPF, CAPF, and SSC GD.',
  keywords: [
    'Physical Training Purulia',
    'Army Physical Training Bengal',
    'Free Physical Training Bengal',
    'AIM Platform',
    'Anup Kumar Mahato Havaldar',
    'WB Police SI Preparation',
    'Army GD 1600m Running'
  ],
  authors: [{ name: 'Purulia Aim Physical Institute' }]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-AIM-dark text-slate-100 antialiased bg-tactical-grid flex flex-col">
        {children}
      </body>
    </html>
  );
}

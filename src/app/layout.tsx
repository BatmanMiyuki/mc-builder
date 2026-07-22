import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MC Builder - Guide de Construction Minecraft',
  description: 'Tutoriels de construction Minecraft étape par étape avec vues isométriques HD. Génération IA, 20+ builds, 900+ blocs.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false, themeColor: '#e94560',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

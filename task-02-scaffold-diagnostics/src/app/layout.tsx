import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RealMe | Deal Intelligence & Transaction Platform',
  description: 'Fiduciary deal intelligence and transaction verification for Realme Properties Ltd, Lekki Lagos',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="surface-canvas">
        {children}
      </body>
    </html>
  );
}


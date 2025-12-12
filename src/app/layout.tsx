import './globals.css';
import type { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/Shared/Providers';
import FaviconLoader from '@/components/FaviconLoader';

const inter = Inter({ subsets: ['latin'] });
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
});

export const metadata = {
  title: 'Annhurst Transport Limited',
  description: 'Annhurst Transport Service Limited provides comprehensive bus higher purchase solutions for transportation businesses.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <FaviconLoader />
      </head>
      <body className={cn(inter.className, playfairDisplay.variable, 'bg-background text-foreground')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

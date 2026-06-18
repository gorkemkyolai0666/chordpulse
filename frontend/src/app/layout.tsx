import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChordPulse - Çatı Kaplama Operasyon Yönetimi',
  description: 'İş takibi, membran stok, ekip planlaması ve çatı keşif platformu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

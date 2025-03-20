import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { WalletProvider } from '@/components/wallet-provider';
import { Navigation } from '@/components/navigation';
import { ToastProvider } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SolConnect - Solana Wallet Connection',
  description: 'Простое подключение кошельков Solana для вашего приложения',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <WalletProvider>
              <div className="flex min-h-screen flex-col">
                <Navigation />
                <main className="flex-1">
                  {children}
                </main>
                <footer className="border-t py-6 md:py-0">
                  <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                      &copy; {new Date().getFullYear()} SolConnect. Все права защищены.
                    </p>
                    <div className="flex items-center gap-4">
                      <a
                        href="https://github.com/massmindmaker/SolConnect"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        GitHub
                      </a>
                      <a
                        href="https://solana.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Solana
                      </a>
                    </div>
                  </div>
                </footer>
              </div>
            </WalletProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
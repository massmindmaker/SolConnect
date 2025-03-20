'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SolanaWalletConnect } from '@/components/solana-wallet-connect';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { SolanaTransfer } from '@/components/solana-transfer';

export default function Home() {
  const { connected } = useWallet();
  const [showTransfer, setShowTransfer] = useState(false);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24">
      <div className="relative flex flex-col items-center max-w-4xl w-full">
        <Image
          src="https://solana.com/_next/static/media/logotype.e4df684f.svg"
          alt="Solana Logo"
          width={400}
          height={100}
          className="mb-12"
          priority
        />
        
        <div className="flex flex-col items-center justify-center bg-card rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">SolConnect</h1>
          
          <p className="text-center mb-8">
            Простое и безопасное подключение кошелька Solana для вашего приложения
          </p>
          
          <SolanaWalletConnect />
          
          {connected && (
            <div className="mt-8 w-full">
              <Button 
                className="w-full" 
                onClick={() => setShowTransfer(!showTransfer)}
              >
                {showTransfer ? 'Скрыть форму перевода' : 'Показать форму перевода'}
              </Button>
              
              {showTransfer && (
                <div className="mt-4">
                  <SolanaTransfer />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
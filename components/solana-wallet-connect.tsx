'use client';

import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { formatWalletAddress, lamportsToSol } from '@/lib/utils';

export const SolanaWalletConnect: FC = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Получаем баланс кошелька при подключении
  useEffect(() => {
    const getBalance = async () => {
      if (publicKey && connected) {
        try {
          setLoading(true);
          // Используем общедоступный RPC URL для Solana
          const connection = new Connection(
            process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
            'confirmed'
          );
          
          const balance = await connection.getBalance(publicKey);
          setBalance(lamportsToSol(balance));
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        } finally {
          setLoading(false);
        }
      } else {
        setBalance(null);
      }
    };

    getBalance();
  }, [publicKey, connected]);

  // Обработчик отключения кошелька
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setBalance(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {!connected ? (
        // Если не подключен - показываем кнопку подключения
        <div className="wallet-connect-container w-full">
          <WalletMultiButton className="wallet-adapter-button w-full" />
        </div>
      ) : (
        // Если подключен - показываем информацию о кошельке
        <div className="wallet-info w-full p-4 border rounded-lg bg-card">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Адрес:</span>
              <span className="text-sm font-mono">
                {publicKey ? formatWalletAddress(publicKey.toString()) : '-'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Баланс:</span>
              <span className="text-sm">
                {loading 
                  ? 'Загрузка...' 
                  : balance !== null 
                    ? `${balance.toFixed(5)} SOL` 
                    : '-'
                }
              </span>
            </div>
            
            <Button 
              variant="destructive" 
              className="mt-2" 
              onClick={handleDisconnect}
            >
              Отключить кошелек
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
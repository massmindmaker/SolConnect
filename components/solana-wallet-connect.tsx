'use client';

import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CopyAddress } from '@/components/copy-address';
import { useToast } from '@/components/ui/toast';
import { formatSol, getWalletBalance } from '@/lib/utils';

export const SolanaWalletConnect: FC = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const { addToast } = useToast();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Получаем баланс кошелька при подключении
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connected) {
        try {
          setLoading(true);
          // Используем общедоступный RPC URL для Solana
          const connection = new Connection(
            process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
            'confirmed'
          );
          
          const balanceInSol = await getWalletBalance(connection, publicKey.toString());
          setBalance(balanceInSol);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
          addToast({
            title: 'Ошибка',
            description: 'Не удалось получить баланс кошелька',
            type: 'error'
          });
        } finally {
          setLoading(false);
        }
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
  }, [publicKey, connected, addToast]);

  // Обработчик отключения кошелька
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setBalance(null);
      addToast({
        title: 'Кошелек отключен',
        description: 'Вы успешно отключили кошелек Solana',
        type: 'success'
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      addToast({
        title: 'Ошибка',
        description: 'Не удалось отключить кошелек',
        type: 'error'
      });
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
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Подключенный кошелек</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Адрес кошелька</span>
                <CopyAddress 
                  address={publicKey.toString()} 
                  className="bg-muted py-1.5 px-2 rounded-md"
                />
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Баланс</span>
                <div className="flex items-center bg-muted py-1.5 px-3 rounded-md">
                  {loading ? (
                    <span className="text-sm">Загрузка...</span>
                  ) : balance !== null ? (
                    <span className="text-sm font-medium">{formatSol(balance)} SOL</span>
                  ) : (
                    <span className="text-sm">Невозможно получить баланс</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleDisconnect}
            >
              Отключить кошелек
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
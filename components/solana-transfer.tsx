'use client';

import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { isValidSolanaAddress, solToLamports, formatSol } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export const SolanaTransfer: FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { addToast } = useToast();
  const [recipient, setRecipient] = useState(process.env.NEXT_PUBLIC_RECIPIENT_WALLET || '');
  const [amount, setAmount] = useState('0.01');
  const [loading, setLoading] = useState(false);

  // Валидация получателя
  const isRecipientValid = isValidSolanaAddress(recipient);
  
  // Валидация суммы
  const isAmountValid = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

  // Обработчик отправки SOL
  const handleTransfer = async () => {
    if (!publicKey || !isRecipientValid || !isAmountValid) return;

    try {
      setLoading(true);
      addToast({ 
        title: 'Подготовка транзакции', 
        description: 'Пожалуйста, подождите...', 
        type: 'default' 
      });

      // Создаем соединение с Solana
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        'confirmed'
      );

      // Создаем транзакцию перевода
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: solToLamports(parseFloat(amount)),
        })
      );

      // Получаем последний хэш блока для установки в транзакцию
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Отправляем транзакцию
      const signature = await sendTransaction(transaction, connection);
      
      // Ожидаем подтверждение
      addToast({ 
        title: 'Ожидание подтверждения', 
        description: 'Транзакция отправлена в сеть Solana', 
        type: 'default' 
      });
      
      await connection.confirmTransaction(signature, 'confirmed');
      
      // Успешное подтверждение
      addToast({ 
        title: 'Перевод выполнен успешно!', 
        description: `Отправлено ${amount} SOL. Подтверждено в блокчейне.`, 
        type: 'success' 
      });
      
      // Сбросить поля формы после успешной отправки
      setAmount('0.01');
      
    } catch (error) {
      console.error('Error processing transfer:', error);
      addToast({ 
        title: 'Ошибка перевода', 
        description: error instanceof Error ? error.message : 'Неизвестная ошибка', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Перевод SOL</CardTitle>
        <CardDescription>
          Отправьте SOL на любой адрес в сети Solana
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Получатель:</label>
          <Input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Solana адрес получателя"
          />
          {recipient && !isRecipientValid && (
            <p className="text-destructive text-xs">Некорректный адрес кошелька Solana</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Сумма (SOL):</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.000001"
            step="0.001"
            placeholder="0.01"
          />
          {amount && !isAmountValid && (
            <p className="text-destructive text-xs">Сумма должна быть больше 0</p>
          )}
        </div>

        {publicKey && (
          <p className="text-xs text-muted-foreground">
            Доступно: ~{formatSol(0)} SOL (информация может быть неточной)
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleTransfer}
          disabled={loading || !isRecipientValid || !isAmountValid}
          className="w-full"
          variant="solana"
        >
          {loading ? 'Отправка...' : 'Отправить SOL'}
        </Button>
      </CardFooter>
    </Card>
  );
};
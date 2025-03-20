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
import { isValidSolanaAddress, solToLamports } from '@/lib/utils';

export const SolanaTransfer: FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState(process.env.NEXT_PUBLIC_RECIPIENT_WALLET || '');
  const [amount, setAmount] = useState('0.01');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });

  // Валидация получателя
  const isRecipientValid = isValidSolanaAddress(recipient);
  
  // Валидация суммы
  const isAmountValid = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

  // Обработчик отправки SOL
  const handleTransfer = async () => {
    if (!publicKey || !isRecipientValid || !isAmountValid) return;

    try {
      setLoading(true);
      setStatus({ type: 'info', message: 'Подготовка транзакции...' });

      // Создаем соединение с Solana
      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
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
      setStatus({ type: 'info', message: 'Ожидание подтверждения транзакции...' });
      await connection.confirmTransaction(signature, 'confirmed');
      
      // Успешное подтверждение
      setStatus({ 
        type: 'success', 
        message: `Перевод выполнен успешно! Сигнатура: ${signature.substring(0, 8)}...` 
      });
      
    } catch (error) {
      console.error('Error processing transfer:', error);
      setStatus({ 
        type: 'error', 
        message: `Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 mt-4">
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Получатель:</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 rounded border focus:ring-2 focus:ring-primary"
          placeholder="Solana адрес получателя"
        />
        {recipient && !isRecipientValid && (
          <p className="text-destructive text-xs mt-1">Некорректный адрес кошелька Solana</p>
        )}
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Сумма (SOL):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.000001"
          step="0.001"
          className="w-full p-2 rounded border focus:ring-2 focus:ring-primary"
          placeholder="0.01"
        />
        {amount && !isAmountValid && (
          <p className="text-destructive text-xs mt-1">Сумма должна быть больше 0</p>
        )}
      </div>

      <Button
        onClick={handleTransfer}
        disabled={loading || !isRecipientValid || !isAmountValid}
        className="w-full"
      >
        {loading ? 'Отправка...' : 'Отправить SOL'}
      </Button>

      {status.type && (
        <div className={`mt-4 p-3 rounded ${
          status.type === 'success' ? 'bg-green-100 text-green-800' : 
          status.type === 'error' ? 'bg-red-100 text-red-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
};
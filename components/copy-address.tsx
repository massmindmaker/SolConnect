'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Copy, Check } from 'lucide-react';
import { cn, formatWalletAddress } from '@/lib/utils';

interface CopyAddressProps {
  address: string;
  className?: string;
  showFull?: boolean;
  startChars?: number;
  endChars?: number;
}

/**
 * Компонент для отображения и копирования адреса кошелька
 * @param address - Адрес кошелька для отображения и копирования
 * @param className - Дополнительные CSS классы
 * @param showFull - Показывать полный адрес (по умолчанию сокращенный)
 * @param startChars - Количество символов для отображения в начале
 * @param endChars - Количество символов для отображения в конце
 */
export const CopyAddress: FC<CopyAddressProps> = ({
  address,
  className,
  showFull = false,
  startChars = 4,
  endChars = 4,
}) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const displayAddress = showFull 
    ? address 
    : formatWalletAddress(address, startChars, endChars);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      
      addToast({
        title: 'Адрес скопирован',
        description: 'Адрес кошелька скопирован в буфер обмена',
        type: 'success',
        duration: 3000,
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address', error);
      
      addToast({
        title: 'Ошибка копирования',
        description: 'Не удалось скопировать адрес кошелька',
        type: 'error',
      });
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-mono text-sm">{displayAddress}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleCopy} 
        aria-label="Копировать адрес"
        className="h-6 w-6"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
};
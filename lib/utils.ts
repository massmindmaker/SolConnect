import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

/**
 * Объединяет классы CSS с помощью clsx и tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Форматирует адрес кошелька для отображения
 * @param address - Полный адрес кошелька
 * @param start - Количество символов в начале
 * @param end - Количество символов в конце
 */
export function formatWalletAddress(address: string, start = 4, end = 4): string {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Конвертирует SOL в lamports
 * @param sol - Количество SOL для конвертации
 */
export function solToLamports(sol: number): number {
  return sol * LAMPORTS_PER_SOL;
}

/**
 * Конвертирует lamports в SOL
 * @param lamports - Количество lamports для конвертации
 */
export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Проверяет корректность адреса кошелька Solana
 * @param address - Адрес для проверки
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Форматирует количество SOL для отображения
 * @param amount - Количество SOL
 * @param digits - Количество знаков после запятой
 */
export function formatSol(amount: number, digits = 5): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }) + ' SOL';
}

/**
 * Получает баланс кошелька в SOL
 * @param connection - Соединение с Solana
 * @param address - Адрес кошелька
 */
export async function getWalletBalance(connection: Connection, address: string): Promise<number> {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return lamportsToSol(balance);
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    return 0;
  }
}
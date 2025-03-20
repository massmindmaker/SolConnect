'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Страница "О проекте"
 * @returns Компонент страницы о проекте
 */
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">О проекте SolConnect</h1>
      
      <div className="mb-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Что такое SolConnect?</h2>
        <p className="text-muted-foreground mb-4">
          SolConnect — это инструмент для интеграции Solana кошельков в веб-приложения. 
          Проект создан для упрощения работы с блокчейном Solana и предоставляет 
          современный пользовательский интерфейс для подключения кошельков и осуществления 
          транзакций.
        </p>
        <p className="text-muted-foreground">
          Используя SolConnect, разработчики могут быстро внедрить возможность подключения 
          к кошелькам Solana в свои приложения и предоставить пользователям простой способ 
          взаимодействия с блокчейном.
        </p>
      </div>
      
      <div className="mb-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Технологии</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Next.js</h3>
            <p className="text-sm text-muted-foreground">
              React фреймворк для разработки современных веб-приложений
            </p>
          </div>
          <div className="border border-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Tailwind CSS</h3>
            <p className="text-sm text-muted-foreground">
              Utility-first CSS фреймворк для быстрой разработки интерфейсов
            </p>
          </div>
          <div className="border border-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">TypeScript</h3>
            <p className="text-sm text-muted-foreground">
              Типизированный JavaScript для надежного кода
            </p>
          </div>
          <div className="border border-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Solana Web3.js</h3>
            <p className="text-sm text-muted-foreground">
              JavaScript API для взаимодействия с блокчейном Solana
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Особенности проекта</h2>
        <ul className="space-y-2 list-disc pl-6">
          <li>Подключение к популярным кошелькам Solana (Phantom, Solflare, Torus и др.)</li>
          <li>Поддержка отправки SOL между кошельками</li>
          <li>Адаптивный дизайн для мобильных и десктопных устройств</li>
          <li>Поддержка светлой и темной темы</li>
          <li>Типизированный код с использованием TypeScript</li>
          <li>Оптимизированная производительность благодаря Next.js</li>
        </ul>
      </div>
      
      <div className="text-center">
        <Link href="/">
          <Button variant="solana" size="lg">
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  );
}
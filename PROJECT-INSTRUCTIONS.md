# Документация по проекту SolConnect

Это подробная документация по проекту SolConnect, включающая инструкции по установке, настройке и использованию.

## Содержание

- [Структура проекта](#структура-проекта)
- [Установка и настройка](#установка-и-настройка)
- [Компоненты](#компоненты)
- [Хуки](#хуки)
- [Примеры использования](#примеры-использования)
- [Настройка темы](#настройка-темы)
- [Развертывание](#развертывание)
- [Часто задаваемые вопросы](#часто-задаваемые-вопросы)

## Структура проекта

```
SolConnect/
├── app/                 # Директория Next.js приложения
│   ├── layout.tsx       # Основной лейаут приложения
│   ├── page.tsx         # Главная страница
│   └── globals.css      # Глобальные стили
├── components/          # UI компоненты
│   ├── ui/              # Базовые UI компоненты
│   │   └── button.tsx   # Компонент кнопки
│   ├── theme-provider.tsx      # Провайдер темы
│   ├── wallet-provider.tsx     # Провайдер Solana кошелька
│   ├── solana-wallet-connect.tsx  # Компонент подключения кошелька
│   └── solana-transfer.tsx     # Компонент перевода SOL
├── lib/                 # Утилиты и вспомогательные функции
│   └── utils.ts         # Функции для работы с кошельком и форматирования
├── public/              # Статические ассеты
├── .env.example         # Пример файла с переменными окружения
├── next.config.mjs      # Конфигурация Next.js
├── package.json         # Зависимости и скрипты
├── postcss.config.mjs   # Конфигурация PostCSS
└── tailwind.config.js   # Конфигурация Tailwind CSS
```

## Установка и настройка

### Требования

- Node.js 16.x или выше
- npm 7.x или выше (или yarn)

### Шаги установки

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/massmindmaker/SolConnect.git
   cd SolConnect
   ```

2. Установите зависимости:
   ```bash
   npm install
   # или
   yarn
   ```

3. Скопируйте файл `.env.example` в `.env.local` и настройте:
   ```bash
   cp .env.example .env.local
   ```

4. Отредактируйте `.env.local` с вашими параметрами:
   ```
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   # или для тестовой сети
   # NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   ```

5. Запустите проект в режиме разработки:
   ```bash
   npm run dev
   # или
   yarn dev
   ```

## Компоненты

### WalletProvider

Обертка для предоставления доступа к функциональности Solana кошелька через контекст.

**Пример использования:**

```tsx
import { WalletProvider } from '../components/wallet-provider';

function MyApp({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}
```

### SolanaWalletConnect

Компонент для подключения кошелька Solana и отображения информации о балансе.

**Пример использования:**

```tsx
import { SolanaWalletConnect } from '../components/solana-wallet-connect';

function HomePage() {
  return (
    <div>
      <h1>Моё Solana приложение</h1>
      <SolanaWalletConnect />
    </div>
  );
}
```

### SolanaTransfer

Компонент для отправки SOL между кошельками.

**Пример использования:**

```tsx
import { SolanaTransfer } from '../components/solana-transfer';

function TransferPage() {
  return (
    <div>
      <h1>Перевод SOL</h1>
      <SolanaTransfer />
    </div>
  );
}
```

## Хуки

Проект использует хуки из библиотеки `@solana/wallet-adapter-react`:

- `useWallet()` - для получения информации о подключенном кошельке
- `useConnection()` - для доступа к соединению с блокчейном Solana

## Примеры использования

### Получение адреса кошелька

```tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { formatWalletAddress } from '../lib/utils';

function WalletInfo() {
  const { publicKey } = useWallet();
  
  if (!publicKey) {
    return <p>Кошелек не подключен</p>;
  }
  
  return (
    <div>
      <p>Адрес кошелька: {formatWalletAddress(publicKey.toString())}</p>
    </div>
  );
}
```

### Получение баланса

```tsx
import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getWalletBalance, formatSol } from '../lib/utils';

function WalletBalance() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  
  useEffect(() => {
    if (publicKey) {
      getWalletBalance(connection, publicKey.toString())
        .then(bal => setBalance(bal))
        .catch(console.error);
    }
  }, [publicKey, connection]);
  
  if (!publicKey) {
    return <p>Кошелек не подключен</p>;
  }
  
  return (
    <div>
      <p>Баланс: {formatSol(balance)} SOL</p>
    </div>
  );
}
```

## Настройка темы

Проект поддерживает светлую и темную тему через компонент `ThemeProvider`. Цветовая схема определена в `globals.css` и может быть настроена.

Для изменения темы программно:

```tsx
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Сменить тему
    </button>
  );
}
```

## Развертывание

### Развертывание на Vercel

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Импортируйте ваш GitHub/GitLab/Bitbucket репозиторий
3. Настройте переменные окружения:
   - `NEXT_PUBLIC_SOLANA_RPC_URL`
4. Нажмите "Deploy"

### Другие платформы

Проект использует стандартную конфигурацию Next.js и может быть развернут на любой платформе, поддерживающей Next.js, такой как Netlify, AWS Amplify и других.

## Часто задаваемые вопросы

### Как подключить другие кошельки Solana?

Отредактируйте файл `components/wallet-provider.tsx` и добавьте нужные адаптеры в массив `wallets`:

```tsx
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new SolletWalletAdapter(),
    // Добавьте новые адаптеры здесь
    new NewWalletAdapter(),
  ],
  []
);
```

### Как изменить RPC эндпоинт?

Установите переменную окружения `NEXT_PUBLIC_SOLANA_RPC_URL` в файле `.env.local` или через настройки вашей платформы развертывания.

### Как настроить кастомные стили для компонентов кошелька?

Отредактируйте стили кошелька в файле `globals.css`. Классы `wallet-adapter-*` отвечают за стилизацию компонентов кошелька.

### Как добавить новую кнопку или вариант кнопки?

Отредактируйте файл `components/ui/button.tsx` и добавьте новый вариант в объект `buttonVariants`:

```tsx
export const buttonVariants = cva(
  // ...
  {
    variants: {
      variant: {
        // ... существующие варианты
        myNewVariant: "bg-purple-500 text-white hover:bg-purple-600",
      },
    },
  }
);
```
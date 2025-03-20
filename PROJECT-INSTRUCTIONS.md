# Инструкция по запуску проекта SolConnect

## Подготовка к работе

### Требования
- Node.js 16 или выше
- npm или yarn
- Git

### Установка зависимостей

1. Клонируйте репозиторий:
```bash
git clone https://github.com/massmindmaker/SolConnect.git
cd SolConnect
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

## Запуск проекта

### Режим разработки

Для запуска проекта в режиме разработки, выполните:

```bash
npm run dev
# или
yarn dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

### Сборка для продакшн

Для создания продакшн-сборки:

```bash
npm run build
# или
yarn build
```

Для запуска продакшн-версии:

```bash
npm run start
# или
yarn start
```

## Конфигурация

Перед запуском проекта вам нужно настроить переменные окружения:

1. Создайте файл `.env` в корне проекта (можно скопировать из `.env.example`)
2. Укажите необходимые параметры:

```
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_NETWORK=mainnet-beta
```

## Структура проекта

- `/app` - основные компоненты и страницы приложения 
- `/components` - повторно используемые компоненты
- `/contexts` - React контексты для передачи данных
- `/hooks` - кастомные React хуки
- `/lib` - вспомогательные функции и утилиты
- `/public` - статические файлы (изображения, шрифты)
- `/styles` - CSS/SCSS файлы

## Работа с Solana кошельками

Проект поддерживает подключение различных Solana кошельков. Для работы с кошельками используются компоненты в директории `/components/wallet`.

Пример использования:
```jsx
import { WalletButton } from "@/components/wallet/WalletButton";

export default function HomePage() {
  return (
    <div>
      <h1>Подключение к Solana кошельку</h1>
      <WalletButton />
    </div>
  );
}
```
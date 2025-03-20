import { NextResponse } from 'next/server';

/**
 * API-маршрут для проверки здоровья приложения
 * @returns Ответ с данными о состоянии приложения
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    },
    { status: 200 }
  );
}
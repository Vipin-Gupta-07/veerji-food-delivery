import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  const start = Date.now();

  let dbStatus = 'disconnected';
  try {
    await connectDB();
    dbStatus = 'connected';
  } catch {
    dbStatus = 'error';
  }

  return NextResponse.json({
    status: 'ok',
    app: 'Veer Ji Malai Chaap Wale',
    timestamp: new Date().toISOString(),
    responseTime: `${Date.now() - start}ms`,
    database: dbStatus,
    environment: process.env.NODE_ENV,
  });
}

import { NextResponse } from 'next/server';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  return NextResponse.json({
    status: 'OK',
    message: 'KAI Email Collector is running',
    timestamp,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
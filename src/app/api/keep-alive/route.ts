import { NextResponse } from 'next/server';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  // Simple database ping to keep connection alive
  try {
    const { getConnection } = await import('../../../lib/db');
    const client = await getConnection();
    await client.query('SELECT 1');
    client.release();
    
    return NextResponse.json({
      status: 'alive',
      timestamp,
      database: 'connected',
      message: 'Keep-alive ping successful'
    });
  } catch (error) {
    console.error('Keep-alive database error:', error);
    return NextResponse.json({
      status: 'alive',
      timestamp,
      database: 'error',
      message: 'Keep-alive ping with database error'
    }, { status: 200 }); // Still return 200 to indicate app is alive
  }
}

export async function POST() {
  return GET(); // Same functionality for POST requests
}
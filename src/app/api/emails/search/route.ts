import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../../lib/db';

// GET - Search emails
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    const searchTerm = `%${query}%`;
    
    const [rows] = await connection.execute(
      'SELECT * FROM emails WHERE email LIKE ? ORDER BY created_at DESC',
      [searchTerm]
    );
    
    await connection.end();
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error searching emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search emails' },
      { status: 500 }
    );
  }
}
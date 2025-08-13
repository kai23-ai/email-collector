import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// GET - Fetch all emails
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM emails ORDER BY created_at DESC');
    await connection.end();
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

// POST - Add new email
export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO emails (email, name) VALUES (?, ?)',
        [email.toLowerCase().trim(), name]
      );
      await connection.end();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email added successfully' 
      });
    } catch (dbError: unknown) {
      await connection.end();
      
      if (dbError && typeof dbError === 'object' && 'code' in dbError && (dbError as { code: string }).code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 409 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error adding email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add email' },
      { status: 500 }
    );
  }
}

// DELETE - Delete all emails
export async function DELETE() {
  try {
    const connection = await getConnection();
    const [result] = await connection.execute<ResultSetHeader>('DELETE FROM emails');
    await connection.end();
    
    return NextResponse.json({ 
      success: true, 
      message: 'All emails deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting all emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete emails' },
      { status: 500 }
    );
  }
}
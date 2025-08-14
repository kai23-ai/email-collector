import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/db';

// GET - Fetch all emails
export async function GET() {
  try {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM emails ORDER BY created_at DESC');
    client.release();
    
    return NextResponse.json({ success: true, data: result.rows });
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
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = await getConnection();
    
    try {
      await client.query(
        'INSERT INTO emails (email) VALUES ($1)',
        [email.toLowerCase().trim()]
      );
      client.release();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email added successfully' 
      });
    } catch (dbError: unknown) {
      client.release();
      
      if (dbError && typeof dbError === 'object' && 'code' in dbError && (dbError as { code: string }).code === '23505') {
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
    const client = await getConnection();
    await client.query('DELETE FROM emails');
    client.release();
    
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
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../../../lib/db';

// PUT - Update email and password
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email, password } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Email ID is required' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = await getConnection();
    
    try {
      const result = await client.query(
        'UPDATE emails SET email = $1, password = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [email.toLowerCase().trim(), password || null, id]
      );
      
      client.release();
      
      if ((result as any).rowCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Email not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email updated successfully' 
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
    console.error('Error updating email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update email' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../../lib/db';

// DELETE - Delete specific email by ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Email ID is required' },
        { status: 400 }
      );
    }

    const client = await getConnection();
    const result = await client.query(
      'DELETE FROM emails WHERE id = $1',
      [id]
    );
    client.release();
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete email' },
      { status: 500 }
    );
  }
}
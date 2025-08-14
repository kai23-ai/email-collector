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

    const connection = await getConnection();
    const [result]: any = await connection.query(
      'DELETE FROM emails WHERE id = ?',
      [id]
    );
    await connection.end();
    
    if (result.affectedRows === 0) {
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
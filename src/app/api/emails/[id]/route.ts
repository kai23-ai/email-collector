import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../../lib/db';

// DELETE - Delete specific email by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Email ID is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    const [result] = await connection.query(
      'DELETE FROM emails WHERE id = ?',
      [id]
    ) as any;
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
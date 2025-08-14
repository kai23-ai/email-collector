import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../../lib/db';

// PUT - Update email order
export async function PUT(request: NextRequest) {
  try {
    const { emailOrders } = await request.json();
    
    if (!emailOrders || !Array.isArray(emailOrders)) {
      return NextResponse.json(
        { success: false, error: 'Email orders array is required' },
        { status: 400 }
      );
    }

    const client = await getConnection();
    
    // Start transaction
    await client.query('BEGIN');
    
    try {
      // Update sort_order for each email
      for (const { id, sort_order } of emailOrders) {
        await client.query(
          'UPDATE emails SET sort_order = $1 WHERE id = $2',
          [sort_order, id]
        );
      }
      
      // Commit transaction
      await client.query('COMMIT');
      client.release();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email order updated successfully' 
      });
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      client.release();
      throw error;
    }
  } catch (error) {
    console.error('Error updating email order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update email order' },
      { status: 500 }
    );
  }
}
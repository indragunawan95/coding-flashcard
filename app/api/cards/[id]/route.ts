import { NextRequest, NextResponse } from 'next/server';
import { getCardById, updateCard, deleteCard } from '@/lib/services/cardService';

/**
 * GET /api/cards/[id] - Get a single card
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const card = await getCardById(id);

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: card });
  } catch (error: any) {
    console.error('Error fetching card:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch card' },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/cards/[id] - Update a card
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const card = await updateCard(params.id, body);

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: card });
  } catch (error: any) {
    console.error('Error updating card:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update card' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/cards/[id] - Delete a card
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteCard(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Card deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting card:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete card' },
      { status: 400 }
    );
  }
}

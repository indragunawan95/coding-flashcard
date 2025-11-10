import { NextRequest, NextResponse } from 'next/server';
import { getDeckById, updateDeck, deleteDeck } from '@/lib/services/deckService';

/**
 * GET /api/decks/[id] - Get a single deck
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deck = await getDeckById(id);

    if (!deck) {
      return NextResponse.json(
        { success: false, error: 'Deck not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deck });
  } catch (error: any) {
    console.error('Error fetching deck:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch deck' },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/decks/[id] - Update a deck
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const deck = await updateDeck(id, body);

    if (!deck) {
      return NextResponse.json(
        { success: false, error: 'Deck not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deck });
  } catch (error: any) {
    console.error('Error updating deck:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update deck' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/decks/[id] - Delete a deck
 * Query param: cascade=true to delete all cards in the deck
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cascade = searchParams.get('cascade') === 'true';

    const deleted = await deleteDeck(id, cascade);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Deck not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Deck deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting deck:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete deck' },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAllDecks, createDeck } from '@/lib/services/deckService';

/**
 * GET /api/decks - Get all decks
 */
export async function GET() {
  try {
    const decks = await getAllDecks();
    return NextResponse.json({ success: true, data: decks });
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch decks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/decks - Create a new deck
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const deck = await createDeck(body);
    return NextResponse.json({ success: true, data: deck }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating deck:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create deck' },
      { status: 400 }
    );
  }
}

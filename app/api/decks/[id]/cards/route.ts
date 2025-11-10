import { NextRequest, NextResponse } from 'next/server';
import { getCardsByDeckId } from '@/lib/services/deckService';

/**
 * GET /api/decks/[id]/cards - Get all cards in a deck
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cards = await getCardsByDeckId(id);
    return NextResponse.json({ success: true, data: cards });
  } catch (error: any) {
    console.error('Error fetching deck cards:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch deck cards' },
      { status: 400 }
    );
  }
}

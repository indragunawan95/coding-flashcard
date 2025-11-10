import { NextRequest, NextResponse } from 'next/server';
import { getCardsDue } from '@/lib/services/cardService';

/**
 * GET /api/cards/due - Get cards due for review
 * Query params: deckId (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('deckId') || undefined;

    const cards = await getCardsDue(deckId);

    return NextResponse.json({
      success: true,
      data: cards,
      count: cards.length
    });
  } catch (error: any) {
    console.error('Error fetching due cards:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch due cards' },
      { status: 400 }
    );
  }
}

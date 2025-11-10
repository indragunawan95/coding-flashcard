import { NextRequest, NextResponse } from 'next/server';
import { getAllCards, createCard } from '@/lib/services/cardService';

/**
 * GET /api/cards - Get all cards
 * Query params: deckId, language, search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      deckId: searchParams.get('deckId') || undefined,
      language: searchParams.get('language') || undefined,
      search: searchParams.get('search') || undefined,
    };

    const cards = await getAllCards(filters);
    return NextResponse.json({ success: true, data: cards });
  } catch (error: any) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch cards' },
      { status: 400 }
    );
  }
}

/**
 * POST /api/cards - Create a new card
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const card = await createCard(body);
    return NextResponse.json({ success: true, data: card }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create card' },
      { status: 400 }
    );
  }
}

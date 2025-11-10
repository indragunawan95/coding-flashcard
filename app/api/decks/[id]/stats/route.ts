import { NextRequest, NextResponse } from 'next/server';
import { getDeckStats } from '@/lib/services/deckService';

/**
 * GET /api/decks/[id]/stats - Get deck statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stats = await getDeckStats(id);
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    console.error('Error fetching deck stats:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch deck stats' },
      { status: 400 }
    );
  }
}

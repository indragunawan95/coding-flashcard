import { NextRequest, NextResponse } from 'next/server';
import { getCardReviewStats } from '@/lib/services/reviewService';

/**
 * GET /api/reviews/cards/[cardId]/stats - Get review statistics for a card
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { cardId } = await params;
    const stats = await getCardReviewStats(cardId);

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Error fetching card review stats:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch card review stats' },
      { status: 400 }
    );
  }
}

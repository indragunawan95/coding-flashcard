import { NextRequest, NextResponse } from 'next/server';
import { getCardReviews, getCardReviewStats } from '@/lib/services/reviewService';

/**
 * GET /api/reviews/cards/[cardId] - Get review history for a card
 * Query params: limit (optional)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { cardId } = await params;
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const reviews = await getCardReviews(cardId, limit);

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error: any) {
    console.error('Error fetching card reviews:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch card reviews' },
      { status: 400 }
    );
  }
}

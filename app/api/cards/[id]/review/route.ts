import { NextRequest, NextResponse } from 'next/server';
import { reviewCard } from '@/lib/services/cardService';
import { createReview } from '@/lib/services/reviewService';

/**
 * POST /api/cards/[id]/review - Review a card
 * Body: { quality: 0-3, time_taken?: number }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quality, time_taken } = body;

    if (quality === undefined) {
      return NextResponse.json(
        { success: false, error: 'Quality is required' },
        { status: 400 }
      );
    }

    // Update card with SM-2 algorithm
    const updatedCard = await reviewCard(id, quality);

    if (!updatedCard) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    // Create review record (optional - for analytics)
    try {
      await createReview({
        card_id: id,
        quality,
        time_taken,
      });
    } catch (reviewError) {
      console.error('Error creating review record:', reviewError);
      // Don't fail the request if review record creation fails
    }

    return NextResponse.json({
      success: true,
      data: updatedCard,
      message: 'Card reviewed successfully'
    });
  } catch (error: any) {
    console.error('Error reviewing card:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to review card' },
      { status: 400 }
    );
  }
}

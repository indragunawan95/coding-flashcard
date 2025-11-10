import { NextRequest, NextResponse } from 'next/server';
import { getReviewsByDateRange, getTodayReviewCount } from '@/lib/services/reviewService';

/**
 * GET /api/reviews - Get reviews
 * Query params: startDate, endDate (optional - defaults to today's reviews)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // If no date params, return today's review count
    if (!startDateParam && !endDateParam) {
      const count = await getTodayReviewCount();
      return NextResponse.json({
        success: true,
        data: { todayCount: count }
      });
    }

    // If date range provided, get reviews in that range
    const startDate = startDateParam ? new Date(startDateParam) : new Date();
    const endDate = endDateParam ? new Date(endDateParam) : new Date();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const reviews = await getReviewsByDateRange(startDate, endDate);

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 400 }
    );
  }
}

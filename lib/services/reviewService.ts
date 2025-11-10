import { ObjectId } from 'mongodb';
import connectDB from '@/lib/mongodb';
import ReviewModel from '@/lib/models/Review';
import { Review } from '@/types/models';

/**
 * Create a review record
 */
export async function createReview(reviewData: {
  card_id: string | ObjectId;
  quality: number;
  time_taken?: number;
}): Promise<Review> {
  await connectDB();

  // Validate card_id
  const cardIdString = reviewData.card_id.toString();
  if (!ObjectId.isValid(cardIdString)) {
    throw new Error('Invalid card ID');
  }

  // Validate quality
  if (reviewData.quality < 0 || reviewData.quality > 3) {
    throw new Error('Quality must be between 0 and 3');
  }

  // Validate time_taken if provided
  if (reviewData.time_taken !== undefined && reviewData.time_taken < 0) {
    throw new Error('Time taken cannot be negative');
  }

  const review = new ReviewModel({
    card_id: new ObjectId(cardIdString),
    quality: reviewData.quality,
    time_taken: reviewData.time_taken,
    reviewed_at: new Date(),
  });

  return await review.save();
}

/**
 * Get review history for a card
 */
export async function getCardReviews(cardId: string, limit?: number): Promise<Review[]> {
  await connectDB();

  if (!ObjectId.isValid(cardId)) {
    throw new Error('Invalid card ID');
  }

  const query = ReviewModel.find({ card_id: new ObjectId(cardId) })
    .sort({ reviewed_at: -1 });

  if (limit) {
    query.limit(limit);
  }

  return await query.lean();
}

/**
 * Get review statistics for a card
 */
export async function getCardReviewStats(cardId: string) {
  await connectDB();

  if (!ObjectId.isValid(cardId)) {
    throw new Error('Invalid card ID');
  }

  const reviews = await ReviewModel.find({ card_id: new ObjectId(cardId) }).lean();

  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageQuality: 0,
      averageTime: 0,
      qualityDistribution: { 0: 0, 1: 0, 2: 0, 3: 0 }
    };
  }

  const qualityDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 };
  let totalQuality = 0;
  let totalTime = 0;
  let timeCount = 0;

  reviews.forEach(review => {
    qualityDistribution[review.quality as 0 | 1 | 2 | 3]++;
    totalQuality += review.quality;
    if (review.time_taken) {
      totalTime += review.time_taken;
      timeCount++;
    }
  });

  return {
    totalReviews: reviews.length,
    averageQuality: totalQuality / reviews.length,
    averageTime: timeCount > 0 ? totalTime / timeCount : 0,
    qualityDistribution
  };
}

/**
 * Get all reviews within a date range
 */
export async function getReviewsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Review[]> {
  await connectDB();

  return await ReviewModel.find({
    reviewed_at: {
      $gte: startDate,
      $lte: endDate
    }
  })
    .sort({ reviewed_at: -1 })
    .lean();
}

/**
 * Get review count for today
 */
export async function getTodayReviewCount(): Promise<number> {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await ReviewModel.countDocuments({
    reviewed_at: {
      $gte: today,
      $lt: tomorrow
    }
  });
}

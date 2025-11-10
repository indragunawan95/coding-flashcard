import { Card, UpdatedCardFields } from '@/types/models';

/**
 * SM-2 Algorithm Implementation
 *
 * @param card - The card to update
 * @param quality - Rating from 0-3 (Again=0, Hard=1, Good=2, Easy=3)
 * @returns Updated card fields for next review
 */
export function updateCardSM2(
  card: Card,
  quality: number
): UpdatedCardFields {
  let { ease_factor, interval, repetitions } = card;

  // Validate quality rating
  if (quality < 0 || quality > 3) {
    throw new Error('Quality must be between 0 and 3');
  }

  // If quality < 2 (Again or Hard), reset the card
  if (quality < 2) {
    repetitions = 0;
    interval = 0;
  } else {
    // Update ease factor based on quality
    // Map quality (2-3) to performance rating (3-5)
    const performanceRating = quality + 1; // 2->3, 3->4 (we'll boost Easy to 5)
    const actualRating = quality === 3 ? 5 : performanceRating;

    ease_factor = Math.max(
      1.3,
      ease_factor + (0.1 - (5 - actualRating) * (0.08 + (5 - actualRating) * 0.02))
    );

    repetitions += 1;

    // Calculate new interval
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
  }

  // Calculate next review date
  const next_review = new Date();
  next_review.setDate(next_review.getDate() + interval);

  return {
    ease_factor,
    interval,
    repetitions,
    next_review,
    last_reviewed: new Date(),
  };
}

/**
 * Get cards that are due for review
 * @param date - The date to check against (default: now)
 * @returns Filter for cards due
 */
export function getCardsDueFilter(date: Date = new Date()): { next_review: { $lte: Date } } {
  return {
    next_review: { $lte: date },
  };
}

/**
 * Format interval in human-readable form
 * @param days - Number of days
 * @returns Formatted string
 */
export function formatInterval(days: number): string {
  if (days === 0) return 'New';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  return `${Math.round(days / 365)} years`;
}

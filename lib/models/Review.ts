import mongoose, { Schema, Model } from 'mongoose';
import { Review } from '@/types/models';

const ReviewSchema = new Schema<Review>(
  {
    card_id: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
      index: true,
    },
    quality: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    reviewed_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    time_taken: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: false,
  }
);

// Add compound indexes for analytics queries
ReviewSchema.index({ card_id: 1, reviewed_at: -1 });
ReviewSchema.index({ reviewed_at: -1 });

// Prevent model recompilation during hot reload
const ReviewModel: Model<Review> =
  mongoose.models.Review || mongoose.model<Review>('Review', ReviewSchema);

export default ReviewModel;

import mongoose, { Schema, Model } from 'mongoose';
import { Card } from '@/types/models';

const CardSchema = new Schema<Card>(
  {
    deck_id: {
      type: Schema.Types.ObjectId,
      ref: 'Deck',
      required: true,
      index: true,
    },
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ease_factor: {
      type: Number,
      default: 2.5,
      min: 1.3,
    },
    interval: {
      type: Number,
      default: 0,
      min: 0,
    },
    repetitions: {
      type: Number,
      default: 0,
      min: 0,
    },
    next_review: {
      type: Date,
      default: Date.now,
      index: true,
    },
    last_reviewed: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Add compound indexes for common queries
CardSchema.index({ deck_id: 1, next_review: 1 });
CardSchema.index({ language: 1 });
CardSchema.index({ next_review: 1, deck_id: 1 });

// Prevent model recompilation during hot reload
const CardModel: Model<Card> =
  mongoose.models.Card || mongoose.model<Card>('Card', CardSchema);

export default CardModel;

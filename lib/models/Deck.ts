import mongoose, { Schema, Model } from 'mongoose';
import { Deck } from '@/types/models';

const DeckSchema = new Schema<Deck>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#7C3AED',
      match: /^#[0-9A-F]{6}$/i,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Add indexes
DeckSchema.index({ name: 1 });

// Prevent model recompilation during hot reload
const DeckModel: Model<Deck> =
  mongoose.models.Deck || mongoose.model<Deck>('Deck', DeckSchema);

export default DeckModel;

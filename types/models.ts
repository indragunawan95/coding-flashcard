import { ObjectId } from 'mongodb';

// Deck type definition
export interface Deck {
  _id?: ObjectId;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

// Card type definition
export interface Card {
  _id?: ObjectId;
  deck_id: ObjectId;
  front: string;
  back: string;
  language: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: Date;
  last_reviewed?: Date;
  created_at: Date;
  updated_at: Date;
}

// Review type definition (optional - for analytics)
export interface Review {
  _id?: ObjectId;
  card_id: ObjectId;
  quality: number;
  reviewed_at: Date;
  time_taken?: number;
}

// Utility type for card updates after SM-2 algorithm
export interface UpdatedCardFields {
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: Date;
  last_reviewed: Date;
}

import { ObjectId } from 'mongodb';
import connectDB from '@/lib/mongodb';
import CardModel from '@/lib/models/Card';
import DeckModel from '@/lib/models/Deck';
import { Card } from '@/types/models';
import { updateCardSM2, getCardsDueFilter } from '@/lib/utils/sm2';

/**
 * Get all cards with optional filters
 */
export async function getAllCards(filters?: {
  deckId?: string;
  language?: string;
  search?: string;
}): Promise<Card[]> {
  await connectDB();

  const query: any = {};

  if (filters?.deckId) {
    if (!ObjectId.isValid(filters.deckId)) {
      throw new Error('Invalid deck ID');
    }
    query.deck_id = new ObjectId(filters.deckId);
  }

  if (filters?.language) {
    query.language = filters.language.toLowerCase();
  }

  if (filters?.search) {
    // Search in front and back content
    query.$or = [
      { front: { $regex: filters.search, $options: 'i' } },
      { back: { $regex: filters.search, $options: 'i' } }
    ];
  }

  return await CardModel.find(query).sort({ created_at: -1 }).lean();
}

/**
 * Get card by ID
 */
export async function getCardById(id: string): Promise<Card | null> {
  await connectDB();

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid card ID');
  }

  return await CardModel.findById(id).lean();
}

/**
 * Get cards due for review
 */
export async function getCardsDue(deckId?: string): Promise<Card[]> {
  await connectDB();

  const query: any = getCardsDueFilter();

  if (deckId) {
    if (!ObjectId.isValid(deckId)) {
      throw new Error('Invalid deck ID');
    }
    query.deck_id = new ObjectId(deckId);
  }

  return await CardModel.find(query).sort({ next_review: 1 }).lean();
}

/**
 * Create a new card
 */
export async function createCard(cardData: Partial<Card>): Promise<Card> {
  await connectDB();

  // Validate required fields
  if (!cardData.deck_id) {
    throw new Error('Deck ID is required');
  }

  if (!ObjectId.isValid(cardData.deck_id.toString())) {
    throw new Error('Invalid deck ID');
  }

  if (!cardData.front || cardData.front.trim() === '') {
    throw new Error('Card front content is required');
  }

  if (!cardData.back || cardData.back.trim() === '') {
    throw new Error('Card back content is required');
  }

  if (!cardData.language || cardData.language.trim() === '') {
    throw new Error('Language is required');
  }

  // Verify deck exists
  const deckExists = await DeckModel.exists({ _id: cardData.deck_id });
  if (!deckExists) {
    throw new Error('Deck not found');
  }

  const card = new CardModel({
    deck_id: cardData.deck_id,
    front: cardData.front.trim(),
    back: cardData.back.trim(),
    language: cardData.language.trim().toLowerCase(),
    ease_factor: 2.5,
    interval: 0,
    repetitions: 0,
    next_review: new Date(),
  });

  return await card.save();
}

/**
 * Update a card
 */
export async function updateCard(id: string, cardData: Partial<Card>): Promise<Card | null> {
  await connectDB();

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid card ID');
  }

  // Validate fields if provided
  if (cardData.front !== undefined && cardData.front.trim() === '') {
    throw new Error('Card front content cannot be empty');
  }

  if (cardData.back !== undefined && cardData.back.trim() === '') {
    throw new Error('Card back content cannot be empty');
  }

  if (cardData.language !== undefined && cardData.language.trim() === '') {
    throw new Error('Language cannot be empty');
  }

  if (cardData.deck_id) {
    if (!ObjectId.isValid(cardData.deck_id.toString())) {
      throw new Error('Invalid deck ID');
    }

    // Verify deck exists
    const deckExists = await DeckModel.exists({ _id: cardData.deck_id });
    if (!deckExists) {
      throw new Error('Deck not found');
    }
  }

  const updateData: any = {};

  if (cardData.front) updateData.front = cardData.front.trim();
  if (cardData.back) updateData.back = cardData.back.trim();
  if (cardData.language) updateData.language = cardData.language.trim().toLowerCase();
  if (cardData.deck_id) updateData.deck_id = cardData.deck_id;

  return await CardModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
}

/**
 * Delete a card
 */
export async function deleteCard(id: string): Promise<boolean> {
  await connectDB();

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid card ID');
  }

  const result = await CardModel.findByIdAndDelete(id);
  return result !== null;
}

/**
 * Review a card (apply SM-2 algorithm)
 */
export async function reviewCard(id: string, quality: number): Promise<Card | null> {
  await connectDB();

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid card ID');
  }

  // Validate quality
  if (quality < 0 || quality > 3) {
    throw new Error('Quality must be between 0 and 3');
  }

  const card = await CardModel.findById(id);

  if (!card) {
    throw new Error('Card not found');
  }

  // Apply SM-2 algorithm
  const updatedFields = updateCardSM2(card.toObject(), quality);

  // Update card with new values
  return await CardModel.findByIdAndUpdate(
    id,
    { $set: updatedFields },
    { new: true }
  ).lean();
}

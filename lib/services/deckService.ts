import { ObjectId } from 'mongodb';
import connectDB from '@/lib/mongodb';
import DeckModel from '@/lib/models/Deck';
import CardModel from '@/lib/models/Card';
import { Deck } from '@/types/models';

/**
 * Get all decks
 */
export async function getAllDecks(): Promise<Deck[]> {
  await connectDB();
  return await DeckModel.find({}).sort({ created_at: -1 }).lean();
}

/**
 * Get deck by ID
 */
export async function getDeckById(id: string): Promise<Deck | null> {
  await connectDB();

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid deck ID');
  }

  return await DeckModel.findById(id).lean();
}

/**
 * Get all cards in a deck
 */
export async function getCardsByDeckId(deckId: string) {
  await connectDB();

  if (!ObjectId.isValid(deckId)) {
    throw new Error('Invalid deck ID');
  }

  return await CardModel.find({ deck_id: new ObjectId(deckId) })
    .sort({ created_at: -1 })
    .lean();
}

/**
 * Get deck stats (total cards, cards due)
 */
export async function getDeckStats(deckId: string) {
  await connectDB();

  if (!ObjectId.isValid(deckId)) {
    throw new Error('Invalid deck ID');
  }

  const deckObjectId = new ObjectId(deckId);
  const now = new Date();

  const [totalCards, cardsDue] = await Promise.all([
    CardModel.countDocuments({ deck_id: deckObjectId }),
    CardModel.countDocuments({
      deck_id: deckObjectId,
      next_review: { $lte: now }
    })
  ]);

  return {
    totalCards,
    cardsDue
  };
}

/**
 * Create a new deck
 */
export async function createDeck(deckData: Partial<Deck>): Promise<Deck> {
  await connectDB();

  // Validate required fields
  if (!deckData.name || deckData.name.trim() === '') {
    throw new Error('Deck name is required');
  }

  const deck = new DeckModel({
    name: deckData.name.trim(),
    description: deckData.description?.trim(),
    color: deckData.color || '#7C3AED',
    icon: deckData.icon,
  });

  return await deck.save();
}

/**
 * Update a deck
 */
export async function updateDeck(id: string, deckData: Partial<Deck>): Promise<Deck | null> {
  await connectDB();

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid deck ID');
  }

  // Validate name if provided
  if (deckData.name !== undefined && deckData.name.trim() === '') {
    throw new Error('Deck name cannot be empty');
  }

  const updateData: Partial<Deck> = {};

  if (deckData.name) updateData.name = deckData.name.trim();
  if (deckData.description !== undefined) updateData.description = deckData.description.trim();
  if (deckData.color) updateData.color = deckData.color;
  if (deckData.icon !== undefined) updateData.icon = deckData.icon;

  return await DeckModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
}

/**
 * Delete a deck
 * @param cascade - If true, also delete all cards in the deck
 */
export async function deleteDeck(id: string, cascade: boolean = false): Promise<boolean> {
  await connectDB();

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid deck ID');
  }

  const deckObjectId = new ObjectId(id);

  // Check if deck has cards
  const cardCount = await CardModel.countDocuments({ deck_id: deckObjectId });

  if (cardCount > 0 && !cascade) {
    throw new Error(
      `Cannot delete deck with ${cardCount} cards. Use cascade=true to delete all cards.`
    );
  }

  // Delete cards if cascade
  if (cascade && cardCount > 0) {
    await CardModel.deleteMany({ deck_id: deckObjectId });
  }

  const result = await DeckModel.findByIdAndDelete(id);
  return result !== null;
}

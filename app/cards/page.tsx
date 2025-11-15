'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cardApi, deckApi } from '@/lib/api/client';

interface Card {
  _id: string;
  deck_id: string;
  front: string;
  back: string;
  language: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
}

interface Deck {
  _id: string;
  name: string;
  color?: string;
  icon?: string;
}

export default function CardsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    deckId: searchParams.get('deckId') || '',
    language: '',
    search: '',
  });

  useEffect(() => {
    loadDecks();
  }, []);

  useEffect(() => {
    loadCards();
  }, [filters]);

  async function loadDecks() {
    try {
      const data = await deckApi.getAll();
      setDecks(data);
    } catch (err) {
      console.error('Error loading decks:', err);
    }
  }

  async function loadCards() {
    try {
      setLoading(true);
      const data = await cardApi.getAll(filters);
      setCards(data);
    } catch (err) {
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCard(id: string) {
    if (!confirm('Delete this card?')) return;

    try {
      await cardApi.delete(id);
      loadCards();
    } catch (err: any) {
      alert('Error deleting card: ' + err.message);
    }
  }

  function getDeckInfo(deckId: string) {
    return decks.find(d => d._id === deckId);
  }

  const truncate = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card-bg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Cards</h1>
              <p className="text-text-secondary mt-1">Browse and manage your flashcards</p>
            </div>
            <Link
              href="/cards/new"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Card
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-bg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Deck</label>
              <select
                value={filters.deckId}
                onChange={(e) => setFilters({ ...filters, deckId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Decks</option>
                {decks.map((deck) => (
                  <option key={deck._id} value={deck._id}>
                    {deck.icon} {deck.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Language</label>
              <input
                type="text"
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                placeholder="e.g., javascript, python"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search in cards..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center bg-card-bg rounded-xl p-12 shadow-md">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">No cards found</h2>
            <p className="text-text-secondary mb-6">Create your first flashcard to get started</p>
            <Link
              href="/cards/new"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Create Card
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => {
              const deck = getDeckInfo(card.deck_id);
              return (
                <div
                  key={card._id}
                  className="bg-card-bg rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 p-6"
                  style={{ borderColor: deck?.color || '#7C3AED' }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {deck && (
                          <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: deck.color + '20', color: deck.color }}>
                            {deck.icon} {deck.name}
                          </span>
                        )}
                        <span className="text-xs font-mono text-text-secondary bg-gray-100 px-2 py-1 rounded">
                          {card.language}
                        </span>
                      </div>

                      <div className="mb-2">
                        <p className="text-sm font-semibold text-text-secondary mb-1">Question:</p>
                        <p className="text-text-primary">{truncate(card.front.replace(/[#*`]/g, ''))}</p>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-semibold text-text-secondary mb-1">Answer:</p>
                        <p className="text-text-primary">{truncate(card.back.replace(/[#*`]/g, ''))}</p>
                      </div>

                      <div className="flex gap-4 text-xs text-text-secondary">
                        <span>Ease: {card.ease_factor.toFixed(2)}</span>
                        <span>•</span>
                        <span>Interval: {card.interval} days</span>
                        <span>•</span>
                        <span>Reviews: {card.repetitions}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Link
                        href={`/cards/${card._id}/edit`}
                        className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteCard(card._id)}
                        className="px-4 py-2 bg-error text-white rounded-lg text-sm font-semibold hover:bg-error-light transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

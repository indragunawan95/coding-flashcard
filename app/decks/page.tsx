'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { deckApi } from '@/lib/api/client';

interface Deck {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeck, setNewDeck] = useState({ name: '', description: '', color: '#7C3AED', icon: '📚' });

  useEffect(() => {
    loadDecks();
  }, []);

  async function loadDecks() {
    try {
      setLoading(true);
      const data = await deckApi.getAll();
      setDecks(data);
    } catch (err) {
      console.error('Error loading decks:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDeck() {
    if (!newDeck.name.trim()) {
      alert('Deck name is required');
      return;
    }

    try {
      await deckApi.create(newDeck);
      setShowCreateModal(false);
      setNewDeck({ name: '', description: '', color: '#7C3AED', icon: '📚' });
      loadDecks();
    } catch (err: any) {
      alert('Error creating deck: ' + err.message);
    }
  }

  async function handleDeleteDeck(id: string, name: string) {
    if (!confirm(`Delete deck "${name}"? This will also delete all cards in this deck.`)) {
      return;
    }

    try {
      await deckApi.delete(id, true);
      loadDecks();
    } catch (err: any) {
      alert('Error deleting deck: ' + err.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card-bg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Decks</h1>
              <p className="text-text-secondary mt-1">Organize your flashcards into decks</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Deck
            </button>
          </div>
        </div>
      </div>

      {/* Decks Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {decks.length === 0 ? (
          <div className="text-center bg-card-bg rounded-xl p-12 shadow-md">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">No decks yet</h2>
            <p className="text-text-secondary mb-6">Create your first deck to organize your flashcards</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Create Deck
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <div
                key={deck._id}
                className="bg-card-bg rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 overflow-hidden"
                style={{ borderColor: deck.color || '#7C3AED' + '40' }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{deck.icon || '📚'}</span>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary">{deck.name}</h3>
                        {deck.description && (
                          <p className="text-sm text-text-secondary mt-1">{deck.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/cards?deckId=${deck._id}`}
                      className="flex-1 py-2 px-4 text-center bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
                    >
                      View Cards
                    </Link>
                    <button
                      onClick={() => handleDeleteDeck(deck._id, deck.name)}
                      className="py-2 px-4 bg-error text-white rounded-lg font-semibold hover:bg-error-light transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Deck Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Create New Deck</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Deck Name *</label>
                <input
                  type="text"
                  value={newDeck.name}
                  onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
                  placeholder="e.g., JavaScript Basics"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                <textarea
                  value={newDeck.description}
                  onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Color</label>
                  <input
                    type="color"
                    value={newDeck.color}
                    onChange={(e) => setNewDeck({ ...newDeck, color: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Icon</label>
                  <input
                    type="text"
                    value={newDeck.icon}
                    onChange={(e) => setNewDeck({ ...newDeck, icon: e.target.value })}
                    placeholder="📚"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-text-primary rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeck}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

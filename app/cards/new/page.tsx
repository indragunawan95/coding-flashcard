'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cardApi, deckApi } from '@/lib/api/client';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Deck {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
}

export default function NewCardPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [formData, setFormData] = useState({
    deck_id: '',
    front: '',
    back: '',
    language: 'javascript',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDecks() {
      try {
        const data = await deckApi.getAll();
        setDecks(data);
        if (data.length > 0 && !formData.deck_id) {
          setFormData(prev => ({ ...prev, deck_id: data[0]._id }));
        }
      } catch (err) {
        console.error('Error loading decks:', err);
      }
    }
    loadDecks();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.deck_id || !formData.front.trim() || !formData.back.trim() || !formData.language.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await cardApi.create(formData);
      router.push('/cards');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (decks.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md bg-card-bg p-12 rounded-xl shadow-lg">
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">No decks found</h2>
          <p className="text-text-secondary mb-6">You need to create a deck first before adding cards</p>
          <Link
            href="/decks"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Create Deck
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card-bg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/cards" className="text-sm text-primary hover:text-primary-dark mb-2 inline-block">
            ← Back to Cards
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">Create New Card</h1>
          <p className="text-text-secondary mt-1">Add a new flashcard to your collection</p>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Metadata */}
          <div className="bg-card-bg rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Card Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Deck *</label>
                <select
                  value={formData.deck_id}
                  onChange={(e) => setFormData({ ...formData, deck_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {decks.map((deck) => (
                    <option key={deck._id} value={deck._id}>
                      {deck.icon} {deck.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Language *</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="e.g., javascript, python, java"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Preview Toggle */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          {/* Editor/Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Front Side */}
            <div className="bg-card-bg rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Front (Question)</h3>
              {!showPreview ? (
                <textarea
                  value={formData.front}
                  onChange={(e) => setFormData({ ...formData, front: e.target.value })}
                  placeholder="Enter your question in Markdown...

Example:
# What is a closure?
Explain closures in JavaScript with an example."
                  required
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 min-h-[380px]">
                  <MarkdownRenderer content={formData.front || '*No content yet*'} />
                </div>
              )}
            </div>

            {/* Back Side */}
            <div className="bg-card-bg rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Back (Answer)</h3>
              {!showPreview ? (
                <textarea
                  value={formData.back}
                  onChange={(e) => setFormData({ ...formData, back: e.target.value })}
                  placeholder="Enter your answer in Markdown...

Example:
A closure is a function that has access to variables in its outer scope.

\`\`\`javascript
function outer() {
  const name = 'John';
  return function inner() {
    console.log(name);
  }
}
\`\`\`"
                  required
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 min-h-[380px]">
                  <MarkdownRenderer content={formData.back || '*No content yet*'} />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/cards"
              className="px-6 py-3 border-2 border-gray-300 text-text-primary rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Card'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

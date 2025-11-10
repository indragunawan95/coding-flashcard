'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cardApi } from '@/lib/api/client';
import { Card } from '@/types/card';

export default function Home() {
  const [cardsDue, setCardsDue] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCardsDue() {
      try {
        setLoading(true);
        const cards = await cardApi.getDue();
        setCardsDue(cards);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCardsDue();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-error mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card-bg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Coding Flashcards</h1>
              <p className="text-text-secondary mt-1">Master programming concepts with spaced repetition</p>
            </div>
            <nav className="flex gap-4">
              <Link
                href="/decks"
                className="px-4 py-2 text-text-primary hover:text-primary transition-colors font-medium"
              >
                Decks
              </Link>
              <Link
                href="/cards"
                className="px-4 py-2 text-text-primary hover:text-primary transition-colors font-medium"
              >
                Cards
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card-bg rounded-xl p-6 shadow-md border-2 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{cardsDue.length}</p>
                <p className="text-sm text-text-secondary">Cards Due Today</p>
              </div>
            </div>
          </div>

          <div className="bg-card-bg rounded-xl p-6 shadow-md border-2 border-accent/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">0</p>
                <p className="text-sm text-text-secondary">Total Decks</p>
              </div>
            </div>
          </div>

          <div className="bg-card-bg rounded-xl p-6 shadow-md border-2 border-success/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">0</p>
                <p className="text-sm text-text-secondary">Reviewed Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        {cardsDue.length > 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Ready to study?</h2>
            <p className="text-text-secondary mb-8">
              You have {cardsDue.length} card{cardsDue.length !== 1 ? 's' : ''} waiting for review
            </p>
            <Link
              href="/study"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Studying
            </Link>
          </div>
        ) : (
          <div className="text-center bg-card-bg rounded-xl p-12 shadow-md">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">All caught up!</h2>
            <p className="text-text-secondary mb-8">No cards due for review right now. Great job!</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/cards/new"
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Add New Cards
              </Link>
              <Link
                href="/decks"
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
              >
                Browse Decks
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

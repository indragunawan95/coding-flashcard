'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cardApi } from '@/lib/api/client';
import { Card } from '@/types/card';
import FlashCard from '@/components/FlashCard';

export default function StudyPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    async function loadCards() {
      try {
        setLoading(true);
        const dueCards = await cardApi.getDue();
        setCards(dueCards);
        if (dueCards.length === 0) {
          setSessionComplete(true);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, []);

  const handleReview = async (cardId: string, quality: number) => {
    try {
      await cardApi.review(cardId, quality);
      setReviewedCount(prev => prev + 1);

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setSessionComplete(true);
      }
    } catch (err: any) {
      console.error('Error reviewing card:', err);
      alert('Failed to save review: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading your cards...</p>
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
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <div className="bg-card-bg rounded-2xl p-12 shadow-xl">
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-4">Study Session Complete!</h1>
            <p className="text-xl text-text-secondary mb-8">
              Great job! You reviewed {reviewedCount} card{reviewedCount !== 1 ? 's' : ''} today.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => router.push('/cards/new')}
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
              >
                Add More Cards
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <header className="bg-card-bg border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => router.push('/')}
              className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Exit
            </button>
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Card {currentIndex + 1} of {cards.length}
              </p>
            </div>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Flashcard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FlashCard
          card={currentCard}
          onReview={handleReview}
        />
      </main>
    </div>
  );
}

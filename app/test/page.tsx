'use client';

import { useState } from 'react';
import FlashCard from '@/components/FlashCard';
import { Card } from '@/types/card';

// Sample card data for testing
const sampleCards: Card[] = [
  {
    _id: '1',
    front: `# What is a JavaScript Closure?

Write a function that demonstrates closure by creating a counter.`,
    back: `# JavaScript Closure

A **closure** is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

## Example:

\`\`\`javascript
function createCounter() {
  let count = 0;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());   // 2
\`\`\`

**Key Points:**
- Inner functions have access to outer function variables
- Variables persist even after outer function completes
- Enables data privacy and encapsulation
`,
    language: 'javascript',
    ease_factor: 2.5,
    interval: 0,
    repetitions: 0,
    next_review: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: '2',
    front: `# Python List Comprehension

How do you create a list of squares from 1 to 10 using list comprehension?`,
    back: `# List Comprehension Solution

\`\`\`python
# Basic list comprehension
squares = [x**2 for x in range(1, 11)]
print(squares)
# Output: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# With conditional
even_squares = [x**2 for x in range(1, 11) if x % 2 == 0]
print(even_squares)
# Output: [4, 16, 36, 64, 100]
\`\`\`

**Syntax:** \`[expression for item in iterable if condition]\`

- More concise than traditional loops
- Returns a new list
- Can include optional conditions
`,
    language: 'python',
    ease_factor: 2.5,
    interval: 1,
    repetitions: 1,
    next_review: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: '3',
    front: `# React useState Hook

What does the \`useState\` hook do and how do you use it?`,
    back: `# React useState Hook

The \`useState\` hook lets you add state to functional components.

## Syntax:

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  // Declare state variable
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
\`\`\`

**Returns:** Array with two elements:
1. Current state value
2. Function to update state

**Important:** State updates trigger re-renders!
`,
    language: 'javascript',
    ease_factor: 2.8,
    interval: 3,
    repetitions: 3,
    next_review: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  }
];

export default function TestPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewedCards, setReviewedCards] = useState<string[]>([]);

  const handleReview = async (cardId: string, quality: number) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`Reviewed card ${cardId} with quality ${quality}`);
    setReviewedCards([...reviewedCards, cardId]);

    // Move to next card
    if (currentCardIndex < sampleCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      alert('All cards reviewed! Resetting...');
      setCurrentCardIndex(0);
      setReviewedCards([]);
    }
  };

  const currentCard = sampleCards[currentCardIndex];

  return (
    <div className="min-h-screen bg-background py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 px-4 sm:px-0">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Component Test Page
          </h1>
          <p className="text-text-secondary">
            Testing FlashCard, MarkdownRenderer, ReviewButtons, and CodeEditorModal
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 bg-white rounded-lg shadow p-4 mx-4 sm:mx-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-text-primary">
              Progress
            </span>
            <span className="text-sm text-text-secondary">
              {currentCardIndex + 1} / {sampleCards.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentCardIndex + 1) / sampleCards.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* FlashCard Component */}
        <FlashCard
          card={currentCard}
          onReview={handleReview}
        />

        {/* Controls */}
        <div className="mt-8 flex gap-4 justify-center px-4 sm:px-0">
          <button
            onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
            disabled={currentCardIndex === 0}
            className="px-4 py-2 bg-gray-200 text-text-primary rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentCardIndex(Math.min(sampleCards.length - 1, currentCardIndex + 1))}
            disabled={currentCardIndex === sampleCards.length - 1}
            className="px-4 py-2 bg-gray-200 text-text-primary rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4 mx-4 sm:mx-0">
          <h3 className="text-sm font-bold text-text-primary mb-2">Debug Info</h3>
          <div className="text-xs text-text-secondary space-y-1">
            <p>Current Card: {currentCard._id}</p>
            <p>Reviewed Cards: {reviewedCards.length}</p>
            <p>Card Language: {currentCard.language}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

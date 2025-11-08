'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/types/card';
import MarkdownRenderer from './MarkdownRenderer';
import ReviewButtons from './ReviewButtons';
import CodeEditorModal from './CodeEditorModal';

interface FlashCardProps {
  card: Card;
  onReview: (cardId: string, quality: number) => Promise<void>;
}

const flipVariants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: 'easeInOut' }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: 'easeInOut' }
  }
};

export default function FlashCard({ card, onReview }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [userCode, setUserCode] = useState('');

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReview = async (quality: number) => {
    setIsReviewing(true);
    try {
      await onReview(card._id, quality);
    } catch (error) {
      console.error('Failed to review card:', error);
    } finally {
      setIsReviewing(false);
      setIsFlipped(false);
      setUserCode(''); // Reset user code for next card
    }
  };

  const handleOpenEditor = () => {
    setShowCodeEditor(true);
  };

  const handleCodeSubmit = (code: string) => {
    setUserCode(code);
    setShowCodeEditor(false);
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto perspective-1000 px-0 sm:px-4">
        {/* Card Container */}
        <div className="relative h-[400px] sm:h-[450px] mb-6">
          <motion.div
            className="w-full h-full cursor-pointer preserve-3d"
            animate={isFlipped ? 'back' : 'front'}
            variants={flipVariants}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front Side */}
            <div
              className="absolute inset-0 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div
                className="w-full h-full bg-card-bg rounded-none sm:rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col border-2 border-primary/20"
                onClick={handleFlip}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {card.language}
                  </span>
                  <span className="text-xs text-text-secondary">
                    Click to flip
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <MarkdownRenderer content={card.front} />
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditor();
                    }}
                    className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Practice Code
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div
              className="absolute inset-0 backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div
                className="w-full h-full bg-card-bg rounded-none sm:rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col border-2 border-success/20"
                onClick={handleFlip}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-success bg-success/10 px-3 py-1 rounded-full">
                    Answer
                  </span>
                  <span className="text-xs text-text-secondary">
                    Click to flip back
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <MarkdownRenderer content={card.back} />

                  {/* User's Code - Show if user practiced */}
                  {userCode && (
                    <div className="mt-6 pt-6 border-t-2 border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <h3 className="text-sm font-bold text-primary">Your Code:</h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditor();
                          }}
                          className="text-xs text-primary hover:text-primary-dark font-semibold flex items-center gap-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                          View in Editor
                        </button>
                      </div>
                      <div className="relative">
                        <pre className="code-block bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto overflow-y-auto max-h-64">
                          <code className="text-xs sm:text-sm">{userCode}</code>
                        </pre>
                        {/* Scroll indicators */}
                        <div className="scroll-fade-right"></div>
                        <div className="scroll-fade-bottom"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Review Buttons - Only show when flipped */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-4 text-center">
              <p className="text-sm text-text-secondary font-medium">
                How well did you remember?
              </p>
            </div>
            <ReviewButtons
              onReview={handleReview}
              disabled={isReviewing}
            />
          </motion.div>
        )}

        {/* Card Stats */}
        <div className="mt-6 flex justify-center gap-4 text-xs text-text-secondary">
          <span>Ease: {card.ease_factor.toFixed(2)}</span>
          <span>•</span>
          <span>Interval: {card.interval} days</span>
          <span>•</span>
          <span>Reviews: {card.repetitions}</span>
        </div>
      </div>

      {/* Code Editor Modal */}
      <CodeEditorModal
        isOpen={showCodeEditor}
        onClose={() => setShowCodeEditor(false)}
        onSubmit={handleCodeSubmit}
        language={card.language}
        initialCode={userCode}
      />

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }

        /* Enhanced code block scrolling */
        .code-block {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .code-block::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .code-block::-webkit-scrollbar-track {
          background: transparent;
        }

        .code-block::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }

        .code-block::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }

        /* Scroll fade indicators */
        .scroll-fade-right {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(to left, rgba(17, 24, 39, 0.8), transparent);
          pointer-events: none;
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .scroll-fade-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(to top, rgba(17, 24, 39, 0.8), transparent);
          pointer-events: none;
          border-radius: 0 0 0.5rem 0.5rem;
        }
      `}</style>
    </>
  );
}

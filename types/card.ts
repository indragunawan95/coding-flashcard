export interface Card {
  _id: string;
  front: string;           // Markdown content with question
  back: string;            // Markdown content with answer
  language: string;        // Programming language (js, python, etc.)
  ease_factor: number;     // Default: 2.5, Min: 1.3
  interval: number;        // Days until next review, Default: 0
  repetitions: number;     // Successful reviews count, Default: 0
  next_review: Date;       // Next scheduled review date
  last_reviewed?: Date;    // Last review timestamp
  created_at: Date;
  updated_at: Date;
}

export interface ReviewQuality {
  label: string;
  value: number;
  color: string;
  description: string;
}

export const REVIEW_OPTIONS: ReviewQuality[] = [
  { label: 'Again', value: 0, color: 'error', description: 'Complete failure' },
  { label: 'Hard', value: 1, color: 'warning', description: 'Difficult recall' },
  { label: 'Good', value: 2, color: 'accent', description: 'Correct with effort' },
  { label: 'Easy', value: 3, color: 'success', description: 'Perfect recall' }
];

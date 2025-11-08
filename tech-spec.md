# Technical Specification - Coding Flashcard App

## Overview
A spaced repetition flashcard application for learning programming concepts, implementing the SM-2 algorithm for optimal review scheduling.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Markdown Rendering**: react-markdown + rehype-highlight
- **Code Editor**: monaco-editor or react-simple-code-editor
- **Animation**: Framer Motion
- **API**: Next.js API Routes

## Database Schema

### Collections

#### 1. Cards Collection
```javascript
{
  _id: ObjectId,
  front: String,           // Markdown content with question
  back: String,            // Markdown content with answer
  language: String,        // Programming language (js, python, etc.)
  ease_factor: Number,     // Default: 2.5, Min: 1.3
  interval: Number,        // Days until next review, Default: 0
  repetitions: Number,     // Successful reviews count, Default: 0
  next_review: Date,       // Next scheduled review date
  last_reviewed: Date,     // Last review timestamp
  created_at: Date,
  updated_at: Date
}
```

#### 2. Reviews Collection (Optional - for analytics)
```javascript
{
  _id: ObjectId,
  card_id: ObjectId,
  quality: Number,         // 0-3 rating
  reviewed_at: Date,
  time_taken: Number       // Seconds spent on review
}
```

## Component Architecture

### 1. FlashCard Component
**Path**: `components/FlashCard.tsx`

**State**:
- `isFlipped: boolean` - Front/back state
- `showCodeEditor: boolean` - Active recall editor visibility
- `userCode: string` - User's code input

**Sub-components**:
- `CardFront` - Renders markdown question
- `CardBack` - Renders markdown answer
- `CodeEditorModal` - Code editor for active recall
- `ReviewButtons` - 4 rating buttons (Again, Hard, Good, Easy)

**Props**:
```typescript
interface FlashCardProps {
  card: Card;
  onReview: (cardId: string, quality: number) => Promise<void>;
}
```

**Features**:
- Flip animation (3D transform)
- Markdown rendering with syntax highlighting
- Code editor modal for practice
- Mobile-first responsive design

### 2. MarkdownRenderer Component
**Path**: `components/MarkdownRenderer.tsx`

**Libraries**:
- `react-markdown` - Markdown parsing
- `rehype-highlight` - Syntax highlighting
- `rehype-raw` - HTML support

**Features**:
- Render code blocks with syntax highlighting
- Support images
- Custom styling for code blocks

### 3. CodeEditorModal Component
**Path**: `components/CodeEditorModal.tsx`

**Libraries**:
- `monaco-editor` (recommended) or `react-simple-code-editor`

**Features**:
- Full-screen modal
- Syntax highlighting
- Language detection from card metadata
- Close/Submit actions

### 4. ReviewButtons Component
**Path**: `components/ReviewButtons.tsx`

**Buttons**:
```typescript
const REVIEW_OPTIONS = [
  { label: 'Again', value: 0, color: 'red', description: 'Complete failure' },
  { label: 'Hard', value: 1, color: 'orange', description: 'Difficult recall' },
  { label: 'Good', value: 2, color: 'blue', description: 'Correct with effort' },
  { label: 'Easy', value: 3, color: 'green', description: 'Perfect recall' }
];
```

## Pages/Routes

### 1. Home Page - `/`
**Path**: `app/page.tsx`

**Features**:
- Display next card due for review
- Show study statistics (cards due today, total cards)
- Empty state when no cards due

### 2. Study Session - `/study`
**Path**: `app/study/page.tsx`

**Features**:
- Queue of cards due for review
- Progress indicator
- Session completion summary

### 3. Browse Cards - `/cards`
**Path**: `app/cards/page.tsx`

**Features**:
- List all cards
- Filter by language
- Search functionality
- Add/Edit/Delete cards

### 4. Add/Edit Card - `/cards/new` & `/cards/[id]/edit`
**Path**: `app/cards/new/page.tsx`, `app/cards/[id]/edit/page.tsx`

**Features**:
- Markdown editor for front/back
- Preview mode
- Language selection

## API Routes

### 1. Get Cards Due for Review
**Endpoint**: `GET /api/cards/due`

**Response**:
```typescript
{
  cards: Card[],
  count: number
}
```

**Logic**: Filter cards where `next_review <= current_date`

### 2. Review Card
**Endpoint**: `POST /api/cards/[id]/review`

**Request Body**:
```typescript
{
  quality: number // 0-3
}
```

**Response**:
```typescript
{
  success: boolean,
  updatedCard: Card
}
```

**Logic**: Apply SM-2 algorithm and update card

### 3. CRUD Operations
- `GET /api/cards` - List all cards
- `GET /api/cards/[id]` - Get single card
- `POST /api/cards` - Create card
- `PUT /api/cards/[id]` - Update card
- `DELETE /api/cards/[id]` - Delete card

## Utility Functions

### 1. SM-2 Algorithm
**Path**: `lib/sm2.ts`

```typescript
export function updateCardSM2(card: Card, quality: number): UpdatedCardFields {
  // Implementation from README
}
```

### 2. Database Connection
**Path**: `lib/mongodb.ts`

**Features**:
- Singleton connection pattern
- Connection pooling

### 3. Card Utilities
**Path**: `lib/cardUtils.ts`

**Functions**:
- `getCardsDue(date: Date): Promise<Card[]>`
- `getNextReviewDate(card: Card): Date`
- `formatInterval(days: number): string`

## Design System

### Color Palette (Motivational & Eye-catching)
```css
/* Primary - Energetic Purple */
--primary: #7C3AED;
--primary-light: #A78BFA;
--primary-dark: #5B21B6;

/* Success - Vibrant Green */
--success: #10B981;
--success-light: #34D399;

/* Warning - Warm Orange */
--warning: #F59E0B;
--warning-light: #FBBF24;

/* Error - Bold Red */
--error: #EF4444;
--error-light: #F87171;

/* Neutral - Clean Grays */
--background: #F9FAFB;
--card-bg: #FFFFFF;
--text-primary: #111827;
--text-secondary: #6B7280;

/* Accent - Electric Blue */
--accent: #3B82F6;
```

### Animation Configuration
**Library**: Framer Motion

**Card Flip Animation**:
```typescript
const flipVariants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: "easeInOut" }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};
```

**Button Hover/Tap**:
```typescript
const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};
```

## Mobile-First Responsive Breakpoints
```css
/* Tailwind defaults */
sm: 640px   // Small devices
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
```

**Component Behavior**:
- Cards: Full width on mobile, max 600px on desktop
- Buttons: Stack vertically on mobile, horizontal on tablet+
- Code editor: Full screen on all devices

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Setup Next.js project structure
- [ ] Configure MongoDB connection
- [ ] Create database schema and models
- [ ] Setup Tailwind CSS with custom colors

### Phase 2: Core Components (Week 2)
- [ ] Build FlashCard component with flip animation
- [ ] Implement MarkdownRenderer with syntax highlighting
- [ ] Create ReviewButtons component
- [ ] Build CodeEditorModal

### Phase 3: SM-2 Algorithm (Week 3)
- [ ] Implement SM-2 algorithm utility
- [ ] Create review API endpoint
- [ ] Test algorithm with various scenarios

### Phase 4: Pages & Routing (Week 4)
- [ ] Build home page with due cards
- [ ] Create study session page
- [ ] Implement card management (CRUD)
- [ ] Add/Edit card forms

### Phase 5: Polish & Testing (Week 5)
- [ ] Mobile responsiveness testing
- [ ] Animation fine-tuning
- [ ] Performance optimization
- [ ] User testing and feedback

## Testing Strategy

### Unit Tests
- SM-2 algorithm calculations
- Date utilities
- Card filtering logic

### Integration Tests
- API endpoints
- Database operations
- Card review flow

### E2E Tests (Playwright)
- Complete study session
- Card creation/editing
- Mobile interactions

## Performance Considerations

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Dynamic imports for code editor
3. **Caching**: SWR or React Query for card data
4. **Database Indexing**: Index on `next_review` field
5. **Lazy Loading**: Load cards in batches

## Future Enhancements

- [ ] User authentication
- [ ] Card decks/categories
- [ ] Study statistics dashboard
- [ ] Import/Export cards (JSON/CSV)
- [ ] Dark mode
- [ ] Offline support (PWA)
- [ ] Spaced repetition calendar view
- [ ] Card templates library

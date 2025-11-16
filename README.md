This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Task
### 1. Flash Card Component
- Render Front
  - contain markdown text which has text question, code snippet and picture
- Render Show Back
  - contain markdown text which has text explaination, code snippet and picture
- Button to open form with code editor component for active recall. User will input the code implementation based Front questions in this component.
- Button below to review
  - Again (0): Complete failure, forgot completely
  - Hard (1): Difficult recall, lots of hesitation
  - Good (2): Correct with some effort
  - Easy (3): Perfect, instant recall
- Mobile First
- Use eye catching colors combination. Use colors that motivate people to learn.
- Use animation when we flip card Front to Back or Back to Front
- maybe use librabry react-markdown rehype-highlight ?

### Data Structure in MongoDB
```javascript
{
    front: "What is a closure?",
    back: `A closure is a function that retains access to its outer scope.

    \`\`\`javascript
    function outer() {
    let count = 0;
    return function() {
        return ++count;
    }
    }
    \`\`\`

    **Key points:**
    - Inner function has access to outer variables
    - Variables persist even after outer function returns`,
    language: "javascript", // optional, for metadata
    ease_factor: 2.5,    // How "easy" the card is (≥1.3)
    interval: 1,         // Days until next review
    repetitions: 0       // Successful reviews in a row
}
```

### SM-2 Algorithm
When you review a card, you rate your response:

- Again (0): Complete failure, forgot completely
- Hard (1): Difficult recall, lots of hesitation
- Good (2): Correct with some effort
- Easy (3): Perfect, instant recall
```javascript
function updateCardSM2(card, quality) {
  // quality: 0=Again, 1=Hard, 2=Good, 3=Easy
  
  let { ease_factor, interval, repetitions } = card;
  
  // If failed (Again)
  if (quality < 2) {
    repetitions = 0;
    interval = 1;
  } 
  // If passed (Hard, Good, Easy)
  else {
    // First successful review
    if (repetitions === 0) {
      interval = 1;
    }
    // Second successful review
    else if (repetitions === 1) {
      interval = 6;
    }
    // Third+ successful review - use ease factor
    else {
      interval = Math.round(interval * ease_factor);
    }
    
    repetitions += 1;
  }
  
  // Update ease factor based on quality
  ease_factor = ease_factor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
  
  // Ease factor must be at least 1.3
  if (ease_factor < 1.3) {
    ease_factor = 1.3;
  }
  
  // Calculate next review date
  const next_review = new Date();
  next_review.setDate(next_review.getDate() + interval);
  
  return {
    ease_factor,
    interval,
    repetitions,
    next_review,
    last_reviewed: new Date()
  };
}
```

**Example Walkthrough:**

Let's say you're learning a new JavaScript card:
```
Initial state:
- ease_factor: 2.5
- interval: 0
- repetitions: 0

Day 1: First review, you answer "Good" (2)
- repetitions: 0 → 1
- interval: 0 → 1 day
- ease_factor: 2.5 (unchanged)
- Next review: Tomorrow

Day 2: Second review, you answer "Good" (2)
- repetitions: 1 → 2
- interval: 1 → 6 days
- ease_factor: 2.5
- Next review: 6 days later

Day 8: Third review, you answer "Good" (2)
- repetitions: 2 → 3
- interval: 6 → 15 days (6 × 2.5)
- ease_factor: 2.5
- Next review: 15 days later

Day 23: Fourth review, you answer "Easy" (3)
- repetitions: 3 → 4
- interval: 15 → 45 days (15 × 2.5 × 1.2)
- ease_factor: 2.5 → 2.6 (gets easier)
- Next review: 45 days later

Day 68: Fifth review, you answer "Again" (0) - FORGOT!
- repetitions: 4 → 0 (reset!)
- interval: 45 → 1 day (start over)
- ease_factor: 2.6 → 2.18 (gets harder)
- Next review: Tomorrow
```


### Prompt
```
Prompt for algorithm masukin di create card:

Create Front and Back Flash Card about [ALGORITHM_NAME]. Front and Back must be in markdown string format.

Front: Step-by-step explanation with ASCII art (use →, ←, ↑, ↓, ⇄, │, ─, └, ┘, ┌, ┐) showing concrete example.

Back: Include algorithm explanation, core mechanism, time/space complexity with explanation, [PROGRAMMING LANGUANGE] implementation, pros/cons, and when to use/avoid.
```
# API Documentation

## Base URL
`http://localhost:3000/api`

---

## Decks API

### Get all decks
```
GET /api/decks
```
**Response:**
```json
{
  "success": true,
  "data": [{ "_id": "...", "name": "JavaScript", "color": "#7C3AED", ... }]
}
```

### Get single deck
```
GET /api/decks/:id
```

### Create deck
```
POST /api/decks
Content-Type: application/json

{
  "name": "JavaScript Basics",
  "description": "Core JS concepts",
  "color": "#F59E0B",
  "icon": "📚"
}
```

### Update deck
```
PUT /api/decks/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "color": "#10B981"
}
```

### Delete deck
```
DELETE /api/decks/:id?cascade=true
```
Query params:
- `cascade=true`: Also delete all cards in the deck

### Get deck cards
```
GET /api/decks/:id/cards
```

### Get deck stats
```
GET /api/decks/:id/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalCards": 25,
    "cardsDue": 5
  }
}
```

---

## Cards API

### Get all cards
```
GET /api/cards?deckId=xxx&language=javascript&search=closure
```
Query params:
- `deckId`: Filter by deck
- `language`: Filter by programming language
- `search`: Search in front/back content

### Get single card
```
GET /api/cards/:id
```

### Create card
```
POST /api/cards
Content-Type: application/json

{
  "deck_id": "507f1f77bcf86cd799439011",
  "front": "# What is a closure?\nExplain closures in JavaScript",
  "back": "A closure is a function that has access to variables in its outer scope...",
  "language": "javascript"
}
```

### Update card
```
PUT /api/cards/:id
Content-Type: application/json

{
  "front": "Updated question",
  "back": "Updated answer",
  "deck_id": "new_deck_id"
}
```

### Delete card
```
DELETE /api/cards/:id
```

### Get cards due for review
```
GET /api/cards/due?deckId=xxx
```
Query params:
- `deckId` (optional): Filter by specific deck

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### Review a card
```
POST /api/cards/:id/review
Content-Type: application/json

{
  "quality": 2,
  "time_taken": 45
}
```
**Body:**
- `quality`: 0 (Again), 1 (Hard), 2 (Good), 3 (Easy)
- `time_taken` (optional): Seconds spent reviewing

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "ease_factor": 2.6,
    "interval": 6,
    "next_review": "2024-11-15T10:00:00.000Z",
    ...
  },
  "message": "Card reviewed successfully"
}
```

---

## Reviews API (Analytics)

### Get today's review count
```
GET /api/reviews
```

### Get reviews by date range
```
GET /api/reviews?startDate=2024-11-01&endDate=2024-11-09
```

### Get card review history
```
GET /api/reviews/cards/:cardId?limit=10
```
Query params:
- `limit` (optional): Limit number of reviews returned

### Get card review statistics
```
GET /api/reviews/cards/:cardId/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalReviews": 15,
    "averageQuality": 2.3,
    "averageTime": 34.5,
    "qualityDistribution": {
      "0": 2,
      "1": 3,
      "2": 7,
      "3": 3
    }
  }
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

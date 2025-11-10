// API client utilities for frontend

const API_BASE = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'API request failed');
  }

  return data.data as T;
}

// Deck API calls
export const deckApi = {
  getAll: () => fetchApi<any[]>('/decks'),

  getById: (id: string) => fetchApi<any>(`/decks/${id}`),

  getCards: (id: string) => fetchApi<any[]>(`/decks/${id}/cards`),

  getStats: (id: string) => fetchApi<{ totalCards: number; cardsDue: number }>(`/decks/${id}/stats`),

  create: (data: { name: string; description?: string; color?: string; icon?: string }) =>
    fetchApi<any>('/decks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{ name: string; description?: string; color?: string; icon?: string }>) =>
    fetchApi<any>(`/decks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string, cascade: boolean = false) =>
    fetchApi<{ message: string }>(`/decks/${id}?cascade=${cascade}`, {
      method: 'DELETE',
    }),
};

// Card API calls
export const cardApi = {
  getAll: (filters?: { deckId?: string; language?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.deckId) params.append('deckId', filters.deckId);
    if (filters?.language) params.append('language', filters.language);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<any[]>(`/cards${query}`);
  },

  getById: (id: string) => fetchApi<any>(`/cards/${id}`),

  getDue: (deckId?: string) => {
    const query = deckId ? `?deckId=${deckId}` : '';
    return fetchApi<any[]>(`/cards/due${query}`);
  },

  create: (data: {
    deck_id: string;
    front: string;
    back: string;
    language: string;
  }) =>
    fetchApi<any>('/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{
    deck_id: string;
    front: string;
    back: string;
    language: string;
  }>) =>
    fetchApi<any>(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/cards/${id}`, {
      method: 'DELETE',
    }),

  review: (id: string, quality: number, time_taken?: number) =>
    fetchApi<any>(`/cards/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ quality, time_taken }),
    }),
};

// Review API calls
export const reviewApi = {
  getTodayCount: () => fetchApi<{ todayCount: number }>('/reviews'),

  getByDateRange: (startDate: string, endDate: string) => {
    const params = new URLSearchParams({ startDate, endDate });
    return fetchApi<any[]>(`/reviews?${params.toString()}`);
  },

  getCardHistory: (cardId: string, limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return fetchApi<any[]>(`/reviews/cards/${cardId}${query}`);
  },

  getCardStats: (cardId: string) =>
    fetchApi<{
      totalReviews: number;
      averageQuality: number;
      averageTime: number;
      qualityDistribution: { 0: number; 1: number; 2: number; 3: number };
    }>(`/reviews/cards/${cardId}/stats`),
};

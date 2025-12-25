import { auth } from '@/lib/firebaseConfig';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get Firebase ID token for authenticated requests
 */
const getAuthToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        return await user.getIdToken();
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

/**
 * Base API fetch with authentication
 */
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

// ================================
// Journals API
// ================================

export interface JournalInput {
    title: string;
    transcription: string;
    audioUrl?: string;
    date?: string;
    mood?: string;
    tags?: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface JournalFilters {
    page?: number;
    limit?: number;
    mood?: string;
    sentiment?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
}

export const journalsApi = {
    getAll: (filters?: JournalFilters) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) params.append(key, String(value));
            });
        }
        return apiFetch(`/api/journals?${params}`);
    },

    getById: (id: string) => apiFetch(`/api/journals/${id}`),

    create: (data: JournalInput) =>
        apiFetch('/api/journals', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<JournalInput>) =>
        apiFetch(`/api/journals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiFetch(`/api/journals/${id}`, { method: 'DELETE' }),

    getStats: () => apiFetch('/api/journals/stats/summary'),
};

// ================================
// Moods API
// ================================

export interface MoodInput {
    mood: 'happy' | 'calm' | 'excited' | 'sad' | 'angry' | 'anxious' | 'grateful';
    intensity: number;
    notes?: string;
    date?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface MoodFilters {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
}

export const moodsApi = {
    getAll: (filters?: MoodFilters) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) params.append(key, String(value));
            });
        }
        return apiFetch(`/api/moods?${params}`);
    },

    getToday: () => apiFetch('/api/moods/today'),

    create: (data: MoodInput) =>
        apiFetch('/api/moods', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiFetch(`/api/moods/${id}`, { method: 'DELETE' }),

    getStats: () => apiFetch('/api/moods/stats/summary'),
};

// ================================
// Goals API
// ================================

export interface GoalInput {
    title: string;
    description?: string;
    category: 'health' | 'career' | 'personal' | 'education';
    target?: number;
    deadline?: string;
    milestones?: Array<{ title: string; completed: boolean }>;
}

export interface GoalFilters {
    status?: 'active' | 'completed' | 'paused' | 'cancelled';
    category?: string;
}

export const goalsApi = {
    getAll: (filters?: GoalFilters) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) params.append(key, String(value));
            });
        }
        return apiFetch(`/api/goals?${params}`);
    },

    getById: (id: string) => apiFetch(`/api/goals/${id}`),

    create: (data: GoalInput) =>
        apiFetch('/api/goals', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<GoalInput & { progress?: number; status?: string }>) =>
        apiFetch(`/api/goals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    updateProgress: (id: string, progress: number) =>
        apiFetch(`/api/goals/${id}/progress`, {
            method: 'PATCH',
            body: JSON.stringify({ progress }),
        }),

    delete: (id: string) =>
        apiFetch(`/api/goals/${id}`, { method: 'DELETE' }),

    getStats: () => apiFetch('/api/goals/stats/summary'),
};

// Export all APIs
export const api = {
    journals: journalsApi,
    moods: moodsApi,
    goals: goalsApi,
};

export default api;

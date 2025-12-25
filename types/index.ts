// ================================
// VoxaAI Shared Type Definitions
// ================================

// User & Authentication
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export type SubscriptionPlan = 'basic' | 'premium';

export interface UserProfile {
    uid: string;
    email: string;
    subscription: SubscriptionPlan;
    createdAt: Date;
    updatedAt: Date;
}

// Mood Types
export const MOOD_TYPES = ['happy', 'calm', 'excited', 'sad', 'angry', 'anxious', 'grateful'] as const;
export type MoodType = typeof MOOD_TYPES[number];

export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface MoodEntry {
    id: string;
    userId: string;
    mood: MoodType;
    intensity: number; // 1-10
    sentiment?: SentimentType;
    note?: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Journal Types
export interface JournalEntry {
    id: string;
    userId: string;
    title: string;
    transcription: string;
    audioUrl?: string;
    date: Date;
    mood?: MoodType;
    tags: string[];
    sentiment?: SentimentType;
    wordCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface JournalInput {
    title: string;
    transcription: string;
    audioUrl?: string;
    mood?: MoodType;
    tags?: string[];
}

// Goal Types
export const GOAL_CATEGORIES = ['health', 'career', 'personal', 'education'] as const;
export type GoalCategory = typeof GOAL_CATEGORIES[number];

export type GoalStatus = 'active' | 'completed' | 'paused';

export interface Goal {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: GoalCategory;
    progress: number;
    target: number;
    deadline: Date;
    status: GoalStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface GoalInput {
    title: string;
    description?: string;
    category: GoalCategory;
    target: number;
    deadline: Date;
}

// Daily Prompts
export interface DailyPrompt {
    id: string;
    text: string;
    category: 'reflection' | 'gratitude' | 'goals' | 'emotions' | 'growth';
    isPremium: boolean;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Transcription Types
export interface TranscriptionResult {
    text: string;
    confidence?: number;
    duration?: number;
}

// Component Props Types
export interface DashboardComponentProps {
    userPlan: SubscriptionPlan;
    preview?: boolean;
}

// Auth Context Types
export interface AuthContextType {
    user: User | null;
    subscription: SubscriptionPlan | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

// Subscription Context Types
export interface SubscriptionContextType {
    plan: SubscriptionPlan | null;
    isLoading: boolean;
}

// Filter Types
export interface JournalFilters {
    dateRange?: 'today' | 'week' | 'month' | 'quarter' | 'year';
    mood?: MoodType;
    sentiment?: SentimentType;
    tags?: string[];
    searchQuery?: string;
}

// ================================
// Constants
// ================================

// Mood types
export const MOOD_TYPES = ['happy', 'calm', 'excited', 'sad', 'angry', 'anxious', 'grateful'] as const;

// Mood display configuration
export const MOOD_CONFIG = {
    happy: { label: 'Happy', icon: 'Smile', color: 'bg-neutral-300 dark:bg-neutral-600' },
    calm: { label: 'Calm', icon: 'Meh', color: 'bg-neutral-400 dark:bg-neutral-500' },
    excited: { label: 'Excited', icon: 'Smile', color: 'bg-neutral-200 dark:bg-neutral-700' },
    sad: { label: 'Sad', icon: 'Frown', color: 'bg-neutral-600 dark:bg-neutral-400' },
    angry: { label: 'Angry', icon: 'Frown', color: 'bg-neutral-800 dark:bg-neutral-200' },
    anxious: { label: 'Anxious', icon: 'Frown', color: 'bg-neutral-500' },
    grateful: { label: 'Grateful', icon: 'Heart', color: 'bg-neutral-300 dark:bg-neutral-600' },
} as const;

// Goal categories
export const GOAL_CATEGORIES = ['health', 'career', 'personal', 'education'] as const;

export const GOAL_CATEGORY_CONFIG = {
    health: { label: 'Health', color: 'bg-neutral-200 text-neutral-800' },
    career: { label: 'Career', color: 'bg-neutral-300 text-neutral-800' },
    personal: { label: 'Personal', color: 'bg-neutral-400 text-neutral-800' },
    education: { label: 'Education', color: 'bg-neutral-500 text-neutral-100' },
} as const;

// Subscription plans
export const SUBSCRIPTION_PLANS = {
    BASIC: 'basic',
    PREMIUM: 'premium',
} as const;

// Feature access by plan
export const FEATURE_ACCESS = {
    basic: {
        maxJournals: 50,
        maxGoals: 0,
        hasAnalytics: false,
        hasAISentiment: false,
        hasAIPrompts: false,
        hasCloudBackup: true,
        storageLimit: 1, // GB
    },
    premium: {
        maxJournals: Infinity,
        maxGoals: Infinity,
        hasAnalytics: true,
        hasAISentiment: true,
        hasAIPrompts: true,
        hasCloudBackup: true,
        storageLimit: 10, // GB
    },
} as const;

// Date range options
export const DATE_RANGE_OPTIONS = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'This Year' },
] as const;

// Theme options
export const THEME_OPTIONS = [
    { value: 'light', label: 'Light Mode' },
    { value: 'dark', label: 'Dark Mode' },
] as const;

// Daily prompts
export const BASIC_PROMPTS = [
    "What are you grateful for today?",
    "Describe your mood in three words.",
    "What was the highlight of your day?",
    "What challenge did you overcome today?",
    "How did you show kindness today?",
] as const;

export const PREMIUM_PROMPTS = [
    "Reflecting on your recent journal entries, what patterns do you notice in your emotional responses to stress?",
    "Based on your goals, what small action could you take today to move closer to your aspirations?",
    "Considering your mood trends this week, what activities or thoughts seem to boost your wellbeing?",
    "How has your perspective on personal challenges evolved over the past month?",
    "What would you tell your past self from a year ago, given what you've learned about yourself?",
] as const;

// API routes
export const API_ROUTES = {
    TRANSCRIBE: '/api/transcribe',
    TRANSCRIBE_STATUS: '/api/transcribe/status',
} as const;

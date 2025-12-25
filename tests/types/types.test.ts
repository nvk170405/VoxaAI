import { describe, it, expect } from 'vitest';

// Test type definitions
import type {
    JournalEntry,
    MoodEntry,
    Goal,
    SubscriptionPlan,
    MoodType,
    GoalCategory
} from '@/types';

describe('Type Definitions', () => {
    describe('JournalEntry', () => {
        it('should allow valid journal entry structure', () => {
            const entry: JournalEntry = {
                id: '1',
                userId: 'user-1',
                title: 'Test Entry',
                transcription: 'This is a test transcription.',
                date: new Date(),
                tags: ['test'],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            expect(entry.id).toBe('1');
            expect(entry.title).toBe('Test Entry');
            expect(entry.tags).toContain('test');
        });

        it('should allow optional fields', () => {
            const entry: JournalEntry = {
                id: '1',
                userId: 'user-1',
                title: 'Test Entry',
                transcription: 'This is a test transcription.',
                date: new Date(),
                tags: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                audioUrl: 'https://example.com/audio.wav',
                mood: 'happy',
                sentiment: 'positive',
            };

            expect(entry.audioUrl).toBeDefined();
            expect(entry.mood).toBe('happy');
        });
    });

    describe('MoodEntry', () => {
        it('should allow valid mood entry structure', () => {
            const entry: MoodEntry = {
                id: '1',
                userId: 'user-1',
                mood: 'happy',
                intensity: 8,
                date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            expect(entry.mood).toBe('happy');
            expect(entry.intensity).toBe(8);
        });
    });

    describe('Goal', () => {
        it('should allow valid goal structure', () => {
            const goal: Goal = {
                id: '1',
                userId: 'user-1',
                title: 'Learn TypeScript',
                description: 'Master TypeScript for better code quality',
                category: 'education',
                progress: 50,
                target: 100,
                deadline: new Date(),
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            expect(goal.category).toBe('education');
            expect(goal.status).toBe('active');
        });
    });

    describe('SubscriptionPlan', () => {
        it('should only allow valid plan types', () => {
            const basicPlan: SubscriptionPlan = 'basic';
            const premiumPlan: SubscriptionPlan = 'premium';

            expect(['basic', 'premium']).toContain(basicPlan);
            expect(['basic', 'premium']).toContain(premiumPlan);
        });
    });

    describe('MoodType', () => {
        it('should allow valid mood types', () => {
            const moods: MoodType[] = ['happy', 'calm', 'excited', 'sad', 'angry', 'anxious', 'grateful'];
            expect(moods.length).toBe(7);
        });
    });

    describe('GoalCategory', () => {
        it('should allow valid goal categories', () => {
            const categories: GoalCategory[] = ['health', 'career', 'personal', 'education'];
            expect(categories.length).toBe(4);
        });
    });
});

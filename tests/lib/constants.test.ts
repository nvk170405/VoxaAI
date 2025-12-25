import { describe, it, expect } from 'vitest';
import {
    MOOD_TYPES,
    MOOD_CONFIG,
    GOAL_CATEGORIES,
    FEATURE_ACCESS,
    BASIC_PROMPTS,
    PREMIUM_PROMPTS
} from '@/lib/constants';

describe('Constants', () => {
    describe('MOOD_TYPES', () => {
        it('should contain expected mood types', () => {
            expect(MOOD_TYPES).toContain('happy');
            expect(MOOD_TYPES).toContain('sad');
            expect(MOOD_TYPES).toContain('anxious');
            expect(MOOD_TYPES).toContain('grateful');
        });

        it('should have 7 mood types', () => {
            expect(MOOD_TYPES.length).toBe(7);
        });
    });

    describe('MOOD_CONFIG', () => {
        it('should have config for each mood type', () => {
            MOOD_TYPES.forEach(mood => {
                expect(MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG]).toBeDefined();
                expect(MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG].label).toBeDefined();
                expect(MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG].color).toBeDefined();
            });
        });
    });

    describe('GOAL_CATEGORIES', () => {
        it('should contain expected categories', () => {
            expect(GOAL_CATEGORIES).toContain('health');
            expect(GOAL_CATEGORIES).toContain('career');
            expect(GOAL_CATEGORIES).toContain('personal');
            expect(GOAL_CATEGORIES).toContain('education');
        });

        it('should have 4 categories', () => {
            expect(GOAL_CATEGORIES.length).toBe(4);
        });
    });

    describe('FEATURE_ACCESS', () => {
        it('should have basic plan features', () => {
            expect(FEATURE_ACCESS.basic).toBeDefined();
            expect(FEATURE_ACCESS.basic.maxJournals).toBe(50);
            expect(FEATURE_ACCESS.basic.hasAnalytics).toBe(false);
        });

        it('should have premium plan features', () => {
            expect(FEATURE_ACCESS.premium).toBeDefined();
            expect(FEATURE_ACCESS.premium.hasAnalytics).toBe(true);
            expect(FEATURE_ACCESS.premium.hasAISentiment).toBe(true);
        });

        it('should give premium more features than basic', () => {
            expect(FEATURE_ACCESS.premium.maxJournals).toBeGreaterThan(FEATURE_ACCESS.basic.maxJournals);
            expect(FEATURE_ACCESS.premium.storageLimit).toBeGreaterThan(FEATURE_ACCESS.basic.storageLimit);
        });
    });

    describe('PROMPTS', () => {
        it('should have basic prompts', () => {
            expect(BASIC_PROMPTS.length).toBeGreaterThan(0);
        });

        it('should have premium prompts', () => {
            expect(PREMIUM_PROMPTS.length).toBeGreaterThan(0);
        });

        it('basic prompts should be shorter/simpler than premium', () => {
            const avgBasicLength = BASIC_PROMPTS.reduce((sum, p) => sum + p.length, 0) / BASIC_PROMPTS.length;
            const avgPremiumLength = PREMIUM_PROMPTS.reduce((sum, p) => sum + p.length, 0) / PREMIUM_PROMPTS.length;
            expect(avgPremiumLength).toBeGreaterThan(avgBasicLength);
        });
    });
});

// ================================
// useMoods Hook
// ================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    getMoods,
    createMood,
    updateMood,
    deleteMood,
    getTodaysMood,
    getMoodStats
} from '@/lib/firebase/moods';
import type { MoodEntry, MoodType } from '@/types';

interface MoodStats {
    totalEntries: number;
    positivePercentage: number;
    averageIntensity: number;
    mostCommonMood: MoodType | null;
    streak: number;
}

interface UseMoodsReturn {
    moods: MoodEntry[];
    todaysMood: MoodEntry | null;
    stats: MoodStats | null;
    isLoading: boolean;
    error: string | null;
    logMood: (mood: MoodType, intensity: number, note?: string) => Promise<MoodEntry | null>;
    updateMoodEntry: (id: string, updates: Partial<Pick<MoodEntry, 'mood' | 'intensity' | 'note'>>) => Promise<void>;
    deleteMoodEntry: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export const useMoods = (limitCount?: number): UseMoodsReturn => {
    const { user, subscription } = useAuth() as { user: { uid: string } | null; subscription: string | null };
    const [moods, setMoods] = useState<MoodEntry[]>([]);
    const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null);
    const [stats, setStats] = useState<MoodStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMoods = useCallback(async () => {
        if (!user?.uid) {
            setMoods([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [moodsData, todayData] = await Promise.all([
                getMoods(user.uid, limitCount),
                getTodaysMood(user.uid),
            ]);

            setMoods(moodsData);
            setTodaysMood(todayData);

            // Fetch stats only for premium users
            if (subscription === 'premium') {
                const statsData = await getMoodStats(user.uid, 30);
                setStats(statsData);
            }
        } catch (err) {
            console.error('Error fetching moods:', err);
            setError('Failed to load mood data');
        } finally {
            setIsLoading(false);
        }
    }, [user?.uid, subscription, limitCount]);

    useEffect(() => {
        fetchMoods();
    }, [fetchMoods]);

    const logMood = async (
        mood: MoodType,
        intensity: number,
        note?: string
    ): Promise<MoodEntry | null> => {
        if (!user?.uid) return null;

        try {
            const newMood = await createMood(user.uid, mood, intensity, note);
            setMoods(prev => [newMood, ...prev]);
            setTodaysMood(newMood);

            // Refresh stats
            if (subscription === 'premium') {
                const statsData = await getMoodStats(user.uid, 30);
                setStats(statsData);
            }

            return newMood;
        } catch (err) {
            console.error('Error logging mood:', err);
            setError('Failed to log mood');
            return null;
        }
    };

    const updateMoodEntry = async (
        id: string,
        updates: Partial<Pick<MoodEntry, 'mood' | 'intensity' | 'note'>>
    ): Promise<void> => {
        try {
            await updateMood(id, updates);
            setMoods(prev =>
                prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m)
            );
        } catch (err) {
            console.error('Error updating mood:', err);
            setError('Failed to update mood');
        }
    };

    const deleteMoodEntry = async (id: string): Promise<void> => {
        try {
            await deleteMood(id);
            setMoods(prev => prev.filter(m => m.id !== id));

            if (todaysMood?.id === id) {
                setTodaysMood(null);
            }
        } catch (err) {
            console.error('Error deleting mood:', err);
            setError('Failed to delete mood');
        }
    };

    const refresh = async (): Promise<void> => {
        await fetchMoods();
    };

    return {
        moods,
        todaysMood,
        stats,
        isLoading,
        error,
        logMood,
        updateMoodEntry,
        deleteMoodEntry,
        refresh,
    };
};

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { moodsApi, MoodFilters } from '@/lib/api';
import type { MoodEntry, MoodType } from '@/types';

interface MoodStats {
    positivePercentage: number;
    averageIntensity: number;
    streak: number;
    moodBreakdown: Record<string, number>;
}

interface UseMoodsReturn {
    moods: MoodEntry[];
    todaysMood: MoodEntry | null;
    loading: boolean;
    error: string | null;
    stats: MoodStats | null;
    fetchMoods: (filters?: MoodFilters) => Promise<void>;
    logMood: (mood: MoodType, intensity: number, notes?: string) => Promise<MoodEntry | null>;
    deleteMood: (id: string) => Promise<boolean>;
    refreshStats: () => Promise<void>;
    fetchTodaysMood: () => Promise<void>;
}

export const useMoods = (initialFilters?: MoodFilters): UseMoodsReturn => {
    const { user } = useAuth();
    const [moods, setMoods] = useState<MoodEntry[]>([]);
    const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<MoodStats | null>(null);

    const fetchMoods = useCallback(async (filters?: MoodFilters) => {
        if (!user) {
            setMoods([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await moodsApi.getAll(filters || initialFilters) as {
                success: boolean;
                data: MoodEntry[];
            };

            if (response.success) {
                setMoods(response.data);
            }
        } catch (err) {
            console.error('Error fetching moods:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch moods');
        } finally {
            setLoading(false);
        }
    }, [user, initialFilters]);

    const fetchTodaysMood = useCallback(async () => {
        if (!user) return;

        try {
            const response = await moodsApi.getToday() as {
                success: boolean;
                data: MoodEntry | null;
            };

            if (response.success) {
                setTodaysMood(response.data);
            }
        } catch (err) {
            console.error('Error fetching today\'s mood:', err);
        }
    }, [user]);

    const refreshStats = useCallback(async () => {
        if (!user) return;

        try {
            const response = await moodsApi.getStats() as {
                success: boolean;
                data: MoodStats;
            };

            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching mood stats:', err);
        }
    }, [user]);

    const logMood = useCallback(async (
        mood: MoodType,
        intensity: number,
        notes?: string
    ): Promise<MoodEntry | null> => {
        if (!user) return null;

        try {
            setError(null);
            const response = await moodsApi.create({
                mood,
                intensity,
                notes,
                date: new Date().toISOString(),
            }) as { success: boolean; data: MoodEntry };

            if (response.success) {
                setMoods(prev => [response.data, ...prev]);
                setTodaysMood(response.data);
                // Refresh stats after logging
                refreshStats();
                return response.data;
            }
            return null;
        } catch (err) {
            console.error('Error logging mood:', err);
            setError(err instanceof Error ? err.message : 'Failed to log mood');
            return null;
        }
    }, [user, refreshStats]);

    const deleteMood = useCallback(async (id: string): Promise<boolean> => {
        if (!user) return false;

        try {
            setError(null);
            const response = await moodsApi.delete(id) as { success: boolean };

            if (response.success) {
                setMoods(prev => prev.filter(m => m.id !== id));
                if (todaysMood?.id === id) {
                    setTodaysMood(null);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error deleting mood:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete mood');
            return false;
        }
    }, [user, todaysMood]);

    // Fetch on mount and when user changes
    useEffect(() => {
        fetchMoods();
        fetchTodaysMood();
        refreshStats();
    }, [fetchMoods, fetchTodaysMood, refreshStats]);

    return {
        moods,
        todaysMood,
        loading,
        error,
        stats,
        fetchMoods,
        logMood,
        deleteMood,
        refreshStats,
        fetchTodaysMood,
    };
};

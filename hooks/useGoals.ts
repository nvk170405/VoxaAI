'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { goalsApi, GoalFilters } from '@/lib/api';
import type { Goal, GoalCategory } from '@/types';

interface GoalStats {
    total: number;
    active: number;
    completed: number;
    paused: number;
    averageProgress: number;
    categoryBreakdown: Record<string, number>;
}

interface UseGoalsReturn {
    goals: Goal[];
    loading: boolean;
    error: string | null;
    stats: GoalStats | null;
    fetchGoals: (filters?: GoalFilters) => Promise<void>;
    createGoal: (data: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'progress' | 'status'>) => Promise<Goal | null>;
    updateGoal: (id: string, data: Partial<Goal>) => Promise<Goal | null>;
    updateProgress: (id: string, progress: number) => Promise<Goal | null>;
    deleteGoal: (id: string) => Promise<boolean>;
    refreshStats: () => Promise<void>;
}

export const useGoals = (initialFilters?: GoalFilters): UseGoalsReturn => {
    const { user, subscription } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<GoalStats | null>(null);

    // Goals are a premium feature
    const isPremium = subscription === 'premium';

    const fetchGoals = useCallback(async (filters?: GoalFilters) => {
        if (!user || !isPremium) {
            setGoals([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await goalsApi.getAll(filters || initialFilters) as {
                success: boolean;
                data: Goal[];
            };

            if (response.success) {
                setGoals(response.data);
            }
        } catch (err) {
            console.error('Error fetching goals:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch goals');
        } finally {
            setLoading(false);
        }
    }, [user, isPremium, initialFilters]);

    const refreshStats = useCallback(async () => {
        if (!user || !isPremium) return;

        try {
            const response = await goalsApi.getStats() as {
                success: boolean;
                data: GoalStats;
            };

            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching goal stats:', err);
        }
    }, [user, isPremium]);

    const createGoal = useCallback(async (
        data: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'progress' | 'status'>
    ): Promise<Goal | null> => {
        if (!user || !isPremium) return null;

        try {
            setError(null);
            const response = await goalsApi.create({
                title: data.title,
                description: data.description,
                category: data.category as GoalCategory,
                target: data.target,
                deadline: data.deadline?.toISOString(),
            }) as { success: boolean; data: Goal };

            if (response.success) {
                setGoals(prev => [response.data, ...prev]);
                return response.data;
            }
            return null;
        } catch (err) {
            console.error('Error creating goal:', err);
            setError(err instanceof Error ? err.message : 'Failed to create goal');
            return null;
        }
    }, [user, isPremium]);

    const updateGoal = useCallback(async (
        id: string,
        data: Partial<Goal>
    ): Promise<Goal | null> => {
        if (!user || !isPremium) return null;

        try {
            setError(null);
            const response = await goalsApi.update(id, {
                title: data.title,
                description: data.description,
                category: data.category as GoalCategory,
                progress: data.progress,
                target: data.target,
                deadline: data.deadline?.toISOString(),
                status: data.status,
            }) as { success: boolean; data: Goal };

            if (response.success) {
                setGoals(prev => prev.map(g => g.id === id ? response.data : g));
                return response.data;
            }
            return null;
        } catch (err) {
            console.error('Error updating goal:', err);
            setError(err instanceof Error ? err.message : 'Failed to update goal');
            return null;
        }
    }, [user, isPremium]);

    const updateProgress = useCallback(async (
        id: string,
        progress: number
    ): Promise<Goal | null> => {
        if (!user || !isPremium) return null;

        try {
            setError(null);
            const response = await goalsApi.updateProgress(id, progress) as {
                success: boolean;
                data: Goal;
            };

            if (response.success) {
                setGoals(prev => prev.map(g => g.id === id ? response.data : g));
                // Refresh stats after progress update
                refreshStats();
                return response.data;
            }
            return null;
        } catch (err) {
            console.error('Error updating goal progress:', err);
            setError(err instanceof Error ? err.message : 'Failed to update progress');
            return null;
        }
    }, [user, isPremium, refreshStats]);

    const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
        if (!user || !isPremium) return false;

        try {
            setError(null);
            const response = await goalsApi.delete(id) as { success: boolean };

            if (response.success) {
                setGoals(prev => prev.filter(g => g.id !== id));
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error deleting goal:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete goal');
            return false;
        }
    }, [user, isPremium]);

    // Fetch on mount and when user changes
    useEffect(() => {
        fetchGoals();
        refreshStats();
    }, [fetchGoals, refreshStats]);

    return {
        goals,
        loading,
        error,
        stats,
        fetchGoals,
        createGoal,
        updateGoal,
        updateProgress,
        deleteGoal,
        refreshStats,
    };
};

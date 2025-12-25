// ================================
// useGoals Hook
// ================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    getGoals,
    getActiveGoals,
    createGoal,
    updateGoal,
    updateGoalProgress,
    updateGoalStatus,
    deleteGoal,
    getGoalStats
} from '@/lib/firebase/goals';
import type { Goal, GoalInput, GoalStatus } from '@/types';

interface GoalStats {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    averageProgress: number;
}

interface UseGoalsReturn {
    goals: Goal[];
    activeGoals: Goal[];
    stats: GoalStats | null;
    isLoading: boolean;
    error: string | null;
    createNewGoal: (input: GoalInput) => Promise<Goal | null>;
    updateGoalDetails: (id: string, updates: Partial<GoalInput>) => Promise<void>;
    incrementProgress: (id: string, amount?: number) => Promise<void>;
    setProgress: (id: string, progress: number) => Promise<void>;
    changeStatus: (id: string, status: GoalStatus) => Promise<void>;
    removeGoal: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export const useGoals = (): UseGoalsReturn => {
    const { user, subscription } = useAuth() as { user: { uid: string } | null; subscription: string | null };
    const [goals, setGoals] = useState<Goal[]>([]);
    const [stats, setStats] = useState<GoalStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Premium-only feature check
    const isPremium = subscription === 'premium';

    const fetchGoals = useCallback(async () => {
        if (!user?.uid || !isPremium) {
            setGoals([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [goalsData, statsData] = await Promise.all([
                getGoals(user.uid),
                getGoalStats(user.uid),
            ]);

            setGoals(goalsData);
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching goals:', err);
            setError('Failed to load goals');
        } finally {
            setIsLoading(false);
        }
    }, [user?.uid, isPremium]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const activeGoals = goals.filter(g => g.status === 'active');

    const createNewGoal = async (input: GoalInput): Promise<Goal | null> => {
        if (!user?.uid || !isPremium) return null;

        try {
            const newGoal = await createGoal(user.uid, input);
            setGoals(prev => [...prev, newGoal]);

            // Update stats
            const statsData = await getGoalStats(user.uid);
            setStats(statsData);

            return newGoal;
        } catch (err) {
            console.error('Error creating goal:', err);
            setError('Failed to create goal');
            return null;
        }
    };

    const updateGoalDetails = async (id: string, updates: Partial<GoalInput>): Promise<void> => {
        try {
            await updateGoal(id, updates);
            setGoals(prev =>
                prev.map(g => g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g)
            );
        } catch (err) {
            console.error('Error updating goal:', err);
            setError('Failed to update goal');
        }
    };

    const incrementProgress = async (id: string, amount: number = 1): Promise<void> => {
        const goal = goals.find(g => g.id === id);
        if (!goal) return;

        const newProgress = Math.min(goal.progress + amount, goal.target);
        await setProgress(id, newProgress);
    };

    const setProgress = async (id: string, progress: number): Promise<void> => {
        try {
            await updateGoalProgress(id, progress);

            const goal = goals.find(g => g.id === id);
            const newStatus: GoalStatus = goal && progress >= goal.target ? 'completed' : 'active';

            setGoals(prev =>
                prev.map(g => g.id === id ? { ...g, progress, status: newStatus, updatedAt: new Date() } : g)
            );

            // Update stats if goal was completed
            if (newStatus === 'completed' && user?.uid) {
                const statsData = await getGoalStats(user.uid);
                setStats(statsData);
            }
        } catch (err) {
            console.error('Error updating progress:', err);
            setError('Failed to update progress');
        }
    };

    const changeStatus = async (id: string, status: GoalStatus): Promise<void> => {
        try {
            await updateGoalStatus(id, status);
            setGoals(prev =>
                prev.map(g => g.id === id ? { ...g, status, updatedAt: new Date() } : g)
            );
        } catch (err) {
            console.error('Error changing status:', err);
            setError('Failed to change goal status');
        }
    };

    const removeGoal = async (id: string): Promise<void> => {
        try {
            await deleteGoal(id);
            setGoals(prev => prev.filter(g => g.id !== id));

            // Update stats
            if (user?.uid) {
                const statsData = await getGoalStats(user.uid);
                setStats(statsData);
            }
        } catch (err) {
            console.error('Error deleting goal:', err);
            setError('Failed to delete goal');
        }
    };

    const refresh = async (): Promise<void> => {
        await fetchGoals();
    };

    return {
        goals,
        activeGoals,
        stats,
        isLoading,
        error,
        createNewGoal,
        updateGoalDetails,
        incrementProgress,
        setProgress,
        changeStatus,
        removeGoal,
        refresh,
    };
};

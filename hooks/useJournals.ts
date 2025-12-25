'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { journalsApi, JournalFilters } from '@/lib/api';
import type { JournalEntry } from '@/types';

interface UseJournalsReturn {
    journals: JournalEntry[];
    loading: boolean;
    error: string | null;
    stats: {
        totalJournals: number;
        journalsThisWeek: number;
        moodBreakdown: Record<string, number>;
    } | null;
    fetchJournals: (filters?: JournalFilters) => Promise<void>;
    createJournal: (data: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<JournalEntry | null>;
    updateJournal: (id: string, data: Partial<JournalEntry>) => Promise<JournalEntry | null>;
    deleteJournal: (id: string) => Promise<boolean>;
    refreshStats: () => Promise<void>;
}

export const useJournals = (initialFilters?: JournalFilters): UseJournalsReturn => {
    const { user } = useAuth();
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<UseJournalsReturn['stats']>(null);

    const fetchJournals = useCallback(async (filters?: JournalFilters) => {
        if (!user) {
            setJournals([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await journalsApi.getAll(filters || initialFilters) as {
                success: boolean;
                data: JournalEntry[];
            };

            if (response.success) {
                setJournals(response.data);
            }
        } catch (err) {
            console.error('Error fetching journals:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch journals');
        } finally {
            setLoading(false);
        }
    }, [user, initialFilters]);

    const refreshStats = useCallback(async () => {
        if (!user) return;

        try {
            const response = await journalsApi.getStats() as {
                success: boolean;
                data: UseJournalsReturn['stats'];
            };

            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching journal stats:', err);
        }
    }, [user]);

    const createJournal = useCallback(async (
        data: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ): Promise<JournalEntry | null> => {
        if (!user) return null;

        try {
            setError(null);
            const response = await journalsApi.create({
                title: data.title,
                transcription: data.transcription,
                audioUrl: data.audioUrl,
                date: data.date?.toISOString(),
                mood: data.mood,
                tags: data.tags,
                sentiment: data.sentiment,
            }) as { success: boolean; data: JournalEntry };

            if (response.success) {
                setJournals(prev => [response.data, ...prev]);
                return response.data;
            }
            return null;
        } catch (err) {
            console.error('Error creating journal:', err);
            setError(err instanceof Error ? err.message : 'Failed to create journal');
            return null;
        }
    }, [user]);

    const updateJournal = useCallback(async (
        id: string,
        data: Partial<JournalEntry>
    ): Promise<JournalEntry | null> => {
        if (!user) return null;

        try {
            setError(null);
            const response = await journalsApi.update(id, {
                title: data.title,
                transcription: data.transcription,
                audioUrl: data.audioUrl,
                date: data.date?.toISOString(),
                mood: data.mood,
                tags: data.tags,
                sentiment: data.sentiment,
            }) as { success: boolean; data: JournalEntry };

            if (response.success) {
                setJournals(prev => prev.map(j => j.id === id ? response.data : j));
                return response.data;
            }
            return null;
        } catch (err) {
            console.error('Error updating journal:', err);
            setError(err instanceof Error ? err.message : 'Failed to update journal');
            return null;
        }
    }, [user]);

    const deleteJournal = useCallback(async (id: string): Promise<boolean> => {
        if (!user) return false;

        try {
            setError(null);
            const response = await journalsApi.delete(id) as { success: boolean };

            if (response.success) {
                setJournals(prev => prev.filter(j => j.id !== id));
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error deleting journal:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete journal');
            return false;
        }
    }, [user]);

    // Fetch on mount and when user changes
    useEffect(() => {
        fetchJournals();
        refreshStats();
    }, [fetchJournals, refreshStats]);

    return {
        journals,
        loading,
        error,
        stats,
        fetchJournals,
        createJournal,
        updateJournal,
        deleteJournal,
        refreshStats,
    };
};

// ================================
// useJournals Hook
// ================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    getJournals,
    createJournal,
    updateJournal,
    deleteJournal,
    getJournalCount
} from '@/lib/firebase/journals';
import type { JournalEntry, JournalInput, JournalFilters } from '@/types';

interface UseJournalsReturn {
    journals: JournalEntry[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    createEntry: (input: JournalInput) => Promise<JournalEntry | null>;
    updateEntry: (id: string, updates: Partial<JournalInput>) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
    applyFilters: (filters: JournalFilters) => Promise<void>;
}

export const useJournals = (initialFilters?: JournalFilters): UseJournalsReturn => {
    const { user } = useAuth() as { user: { uid: string } | null };
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState<JournalFilters | undefined>(initialFilters);

    const fetchJournals = useCallback(async () => {
        if (!user?.uid) {
            setJournals([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [data, count] = await Promise.all([
                getJournals(user.uid, filters),
                getJournalCount(user.uid),
            ]);
            setJournals(data);
            setTotalCount(count);
        } catch (err) {
            console.error('Error fetching journals:', err);
            setError('Failed to load journal entries');
        } finally {
            setIsLoading(false);
        }
    }, [user?.uid, filters]);

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    const createEntry = async (input: JournalInput): Promise<JournalEntry | null> => {
        if (!user?.uid) return null;

        try {
            const newEntry = await createJournal(user.uid, input);
            setJournals(prev => [newEntry, ...prev]);
            setTotalCount(prev => prev + 1);
            return newEntry;
        } catch (err) {
            console.error('Error creating journal:', err);
            setError('Failed to create journal entry');
            return null;
        }
    };

    const updateEntry = async (id: string, updates: Partial<JournalInput>): Promise<void> => {
        try {
            await updateJournal(id, updates);
            setJournals(prev =>
                prev.map(j => j.id === id ? { ...j, ...updates, updatedAt: new Date() } : j)
            );
        } catch (err) {
            console.error('Error updating journal:', err);
            setError('Failed to update journal entry');
        }
    };

    const deleteEntry = async (id: string): Promise<void> => {
        try {
            await deleteJournal(id);
            setJournals(prev => prev.filter(j => j.id !== id));
            setTotalCount(prev => prev - 1);
        } catch (err) {
            console.error('Error deleting journal:', err);
            setError('Failed to delete journal entry');
        }
    };

    const refresh = async (): Promise<void> => {
        await fetchJournals();
    };

    const applyFilters = async (newFilters: JournalFilters): Promise<void> => {
        setFilters(newFilters);
    };

    return {
        journals,
        isLoading,
        error,
        totalCount,
        createEntry,
        updateEntry,
        deleteEntry,
        refresh,
        applyFilters,
    };
};

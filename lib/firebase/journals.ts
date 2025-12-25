// ================================
// Firebase Journals Service
// ================================

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import type { JournalEntry, JournalInput, JournalFilters } from '@/types';

const COLLECTION_NAME = 'journals';

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: Timestamp | Date): Date => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }
    return timestamp;
};

// Convert Firestore document to JournalEntry
const docToJournal = (doc: any): JournalEntry => {
    const data = doc.data();
    return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        transcription: data.transcription,
        audioUrl: data.audioUrl,
        date: convertTimestamp(data.date),
        mood: data.mood,
        tags: data.tags || [],
        sentiment: data.sentiment,
        wordCount: data.wordCount,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
    };
};

/**
 * Create a new journal entry
 */
export const createJournal = async (
    userId: string,
    input: JournalInput
): Promise<JournalEntry> => {
    const journalData = {
        userId,
        title: input.title,
        transcription: input.transcription,
        audioUrl: input.audioUrl || null,
        date: Timestamp.now(),
        mood: input.mood || null,
        tags: input.tags || [],
        sentiment: null, // Will be set by AI analysis
        wordCount: input.transcription.split(/\s+/).length,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), journalData);
    const newDoc = await getDoc(docRef);

    return docToJournal({ id: docRef.id, data: () => newDoc.data() });
};

/**
 * Get all journal entries for a user
 */
export const getJournals = async (
    userId: string,
    filters?: JournalFilters
): Promise<JournalEntry[]> => {
    let q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'desc')
    );

    // Apply mood filter
    if (filters?.mood) {
        q = query(q, where('mood', '==', filters.mood));
    }

    // Apply sentiment filter
    if (filters?.sentiment) {
        q = query(q, where('sentiment', '==', filters.sentiment));
    }

    const querySnapshot = await getDocs(q);
    const journals: JournalEntry[] = [];

    querySnapshot.forEach((doc) => {
        const journal = docToJournal(doc);

        // Apply client-side filters (search query, date range)
        let includeEntry = true;

        if (filters?.searchQuery) {
            const searchLower = filters.searchQuery.toLowerCase();
            includeEntry = journal.title.toLowerCase().includes(searchLower) ||
                journal.transcription.toLowerCase().includes(searchLower);
        }

        if (filters?.dateRange) {
            const now = new Date();
            const entryDate = journal.date;

            switch (filters.dateRange) {
                case 'today':
                    includeEntry = includeEntry &&
                        entryDate.toDateString() === now.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    includeEntry = includeEntry && entryDate >= weekAgo;
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    includeEntry = includeEntry && entryDate >= monthAgo;
                    break;
                case 'quarter':
                    const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    includeEntry = includeEntry && entryDate >= quarterAgo;
                    break;
                case 'year':
                    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    includeEntry = includeEntry && entryDate >= yearAgo;
                    break;
            }
        }

        if (includeEntry) {
            journals.push(journal);
        }
    });

    return journals;
};

/**
 * Get a single journal entry by ID
 */
export const getJournalById = async (journalId: string): Promise<JournalEntry | null> => {
    const docRef = doc(db, COLLECTION_NAME, journalId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return docToJournal(docSnap);
};

/**
 * Update a journal entry
 */
export const updateJournal = async (
    journalId: string,
    updates: Partial<JournalInput>
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, journalId);

    const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp(),
    };

    // Recalculate word count if transcription changed
    if (updates.transcription) {
        updateData.wordCount = updates.transcription.split(/\s+/).length;
    }

    await updateDoc(docRef, updateData);
};

/**
 * Delete a journal entry
 */
export const deleteJournal = async (journalId: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, journalId);
    await deleteDoc(docRef);
};

/**
 * Get journal count for a user
 */
export const getJournalCount = async (userId: string): Promise<number> => {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
};

/**
 * Get journals by date range for analytics
 */
export const getJournalsByDateRange = async (
    userId: string,
    startDate: Date,
    endDate: Date
): Promise<JournalEntry[]> => {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToJournal);
};

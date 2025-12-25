// ================================
// Firebase Moods Service
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
    limit,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import type { MoodEntry, MoodType, SentimentType } from '@/types';

const COLLECTION_NAME = 'moods';

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: Timestamp | Date): Date => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }
    return timestamp;
};

// Convert Firestore document to MoodEntry
const docToMood = (doc: any): MoodEntry => {
    const data = doc.data();
    return {
        id: doc.id,
        userId: data.userId,
        mood: data.mood,
        intensity: data.intensity,
        sentiment: data.sentiment,
        note: data.note,
        date: convertTimestamp(data.date),
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
    };
};

/**
 * Log a new mood entry
 */
export const createMood = async (
    userId: string,
    mood: MoodType,
    intensity: number,
    note?: string
): Promise<MoodEntry> => {
    // Auto-detect sentiment based on mood
    const positiveMoods: MoodType[] = ['happy', 'excited', 'grateful', 'calm'];
    const negativeMoods: MoodType[] = ['sad', 'angry', 'anxious'];

    let sentiment: SentimentType = 'neutral';
    if (positiveMoods.includes(mood)) sentiment = 'positive';
    if (negativeMoods.includes(mood)) sentiment = 'negative';

    const moodData = {
        userId,
        mood,
        intensity,
        sentiment,
        note: note || null,
        date: Timestamp.now(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), moodData);
    const newDoc = await getDoc(docRef);

    return docToMood({ id: docRef.id, data: () => newDoc.data() });
};

/**
 * Get all mood entries for a user
 */
export const getMoods = async (
    userId: string,
    limitCount?: number
): Promise<MoodEntry[]> => {
    let q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'desc')
    );

    if (limitCount) {
        q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToMood);
};

/**
 * Get mood entries for a date range
 */
export const getMoodsByDateRange = async (
    userId: string,
    startDate: Date,
    endDate: Date
): Promise<MoodEntry[]> => {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToMood);
};

/**
 * Get today's mood
 */
export const getTodaysMood = async (userId: string): Promise<MoodEntry | null> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(today)),
        where('date', '<', Timestamp.fromDate(tomorrow)),
        limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    return docToMood(querySnapshot.docs[0]);
};

/**
 * Update a mood entry
 */
export const updateMood = async (
    moodId: string,
    updates: Partial<Pick<MoodEntry, 'mood' | 'intensity' | 'note'>>
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, moodId);

    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Delete a mood entry
 */
export const deleteMood = async (moodId: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, moodId);
    await deleteDoc(docRef);
};

/**
 * Get mood statistics for analytics
 */
export const getMoodStats = async (
    userId: string,
    days: number = 30
): Promise<{
    totalEntries: number;
    positivePercentage: number;
    averageIntensity: number;
    mostCommonMood: MoodType | null;
    streak: number;
}> => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await getMoodsByDateRange(userId, startDate, new Date());

    if (moods.length === 0) {
        return {
            totalEntries: 0,
            positivePercentage: 0,
            averageIntensity: 0,
            mostCommonMood: null,
            streak: 0,
        };
    }

    // Calculate positive percentage
    const positiveCount = moods.filter(m => m.sentiment === 'positive').length;
    const positivePercentage = Math.round((positiveCount / moods.length) * 100);

    // Calculate average intensity
    const totalIntensity = moods.reduce((sum, m) => sum + m.intensity, 0);
    const averageIntensity = Math.round((totalIntensity / moods.length) * 10) / 10;

    // Find most common mood
    const moodCounts: Record<string, number> = {};
    moods.forEach(m => {
        moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });
    const mostCommonMood = Object.entries(moodCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] as MoodType || null;

    // Calculate streak (consecutive days with mood logged)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < days; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);

        const hasEntry = moods.some(m => {
            const moodDate = new Date(m.date);
            moodDate.setHours(0, 0, 0, 0);
            return moodDate.getTime() === checkDate.getTime();
        });

        if (hasEntry) {
            streak++;
        } else if (i > 0) {
            break; // Streak broken
        }
    }

    return {
        totalEntries: moods.length,
        positivePercentage,
        averageIntensity,
        mostCommonMood,
        streak,
    };
};

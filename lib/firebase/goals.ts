// ================================
// Firebase Goals Service
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
import type { Goal, GoalInput, GoalStatus, GoalCategory } from '@/types';

const COLLECTION_NAME = 'goals';

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: Timestamp | Date): Date => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }
    return timestamp;
};

// Convert Firestore document to Goal
const docToGoal = (doc: any): Goal => {
    const data = doc.data();
    return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        category: data.category,
        progress: data.progress,
        target: data.target,
        deadline: convertTimestamp(data.deadline),
        status: data.status,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
    };
};

/**
 * Create a new goal
 */
export const createGoal = async (
    userId: string,
    input: GoalInput
): Promise<Goal> => {
    const goalData = {
        userId,
        title: input.title,
        description: input.description || '',
        category: input.category,
        progress: 0,
        target: input.target,
        deadline: Timestamp.fromDate(input.deadline),
        status: 'active' as GoalStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), goalData);
    const newDoc = await getDoc(docRef);

    return docToGoal({ id: docRef.id, data: () => newDoc.data() });
};

/**
 * Get all goals for a user
 */
export const getGoals = async (
    userId: string,
    status?: GoalStatus
): Promise<Goal[]> => {
    let q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('deadline', 'asc')
    );

    if (status) {
        q = query(q, where('status', '==', status));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGoal);
};

/**
 * Get active goals for a user
 */
export const getActiveGoals = async (userId: string): Promise<Goal[]> => {
    return getGoals(userId, 'active');
};

/**
 * Get a single goal by ID
 */
export const getGoalById = async (goalId: string): Promise<Goal | null> => {
    const docRef = doc(db, COLLECTION_NAME, goalId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return docToGoal(docSnap);
};

/**
 * Update goal progress
 */
export const updateGoalProgress = async (
    goalId: string,
    progress: number
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, goalId);
    const goal = await getGoalById(goalId);

    if (!goal) throw new Error('Goal not found');

    // Check if goal is completed
    const status: GoalStatus = progress >= goal.target ? 'completed' : 'active';

    await updateDoc(docRef, {
        progress,
        status,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Update goal status
 */
export const updateGoalStatus = async (
    goalId: string,
    status: GoalStatus
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, goalId);

    await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Update goal details
 */
export const updateGoal = async (
    goalId: string,
    updates: Partial<GoalInput>
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, goalId);

    const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp(),
    };

    if (updates.deadline) {
        updateData.deadline = Timestamp.fromDate(updates.deadline);
    }

    await updateDoc(docRef, updateData);
};

/**
 * Delete a goal
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, goalId);
    await deleteDoc(docRef);
};

/**
 * Get goal statistics
 */
export const getGoalStats = async (
    userId: string
): Promise<{
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    averageProgress: number;
}> => {
    const goals = await getGoals(userId);

    const activeGoals = goals.filter(g => g.status === 'active').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;

    const activeGoalsList = goals.filter(g => g.status === 'active');
    const averageProgress = activeGoalsList.length > 0
        ? Math.round(
            activeGoalsList.reduce((sum, g) => sum + (g.progress / g.target) * 100, 0) /
            activeGoalsList.length
        )
        : 0;

    return {
        totalGoals: goals.length,
        activeGoals,
        completedGoals,
        averageProgress,
    };
};

/**
 * Get goals by category
 */
export const getGoalsByCategory = async (
    userId: string,
    category: GoalCategory
): Promise<Goal[]> => {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('deadline', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGoal);
};

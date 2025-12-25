'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { AuthContextType, SubscriptionPlan, User } from '@/types';

// Create context with proper typing
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

// Convert Firebase User to our User type
const convertUser = (firebaseUser: FirebaseUser): User => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
});

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(convertUser(firebaseUser));

                // Fetch user subscription from Firestore
                const userRef = doc(db, 'users', firebaseUser.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSubscription((data.subscription as SubscriptionPlan) || 'basic');
                } else {
                    // Create user doc with default subscription
                    await setDoc(userRef, {
                        email: firebaseUser.email,
                        subscription: 'basic' as SubscriptionPlan,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                    setSubscription('basic');
                }
            } else {
                setUser(null);
                setSubscription(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (): Promise<void> => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        subscription,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

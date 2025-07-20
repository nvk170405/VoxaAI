'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type Plan = 'basic' | 'premium' | null;

const SubscriptionContext = createContext<{ plan: Plan }>({ plan: null });

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [plan, setPlan] = useState<Plan>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        setPlan(snap.data()?.subscription || 'basic');
      }
    });
    return () => unsub();
  }, []);

  return <SubscriptionContext.Provider value={{ plan }}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = () => useContext(SubscriptionContext);

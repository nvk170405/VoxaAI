'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requirePremium?: boolean;
}

/**
 * Protected Route Wrapper
 * Ensures user is authenticated before rendering children
 * Optionally requires premium subscription
 */
export function ProtectedRoute({ children, requirePremium = false }: ProtectedRouteProps) {
    const { user, subscription, loading } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in, redirect to login
                router.push('/login');
            } else if (requirePremium && subscription !== 'premium') {
                // Requires premium but user is not premium
                router.push('/dashboard?upgrade=true');
            } else {
                // All checks passed
                setIsChecking(false);
            }
        }
    }, [user, subscription, loading, requirePremium, router]);

    // Show loading state while checking auth
    if (loading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                    <p className="text-muted-foreground text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // User is authenticated (and premium if required)
    return <>{children}</>;
}

/**
 * Higher-order component for protected pages
 */
export function withProtectedRoute<P extends object>(
    Component: React.ComponentType<P>,
    options?: { requirePremium?: boolean }
) {
    return function ProtectedComponent(props: P) {
        return (
            <ProtectedRoute requirePremium={options?.requirePremium}>
                <Component {...props} />
            </ProtectedRoute>
        );
    };
}

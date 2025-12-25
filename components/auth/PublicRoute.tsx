'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface PublicRouteProps {
    children: React.ReactNode;
}

/**
 * Public Route Wrapper
 * Redirects authenticated users to dashboard
 * Use this for login/signup pages
 */
export function PublicRoute({ children }: PublicRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (user) {
                // Already logged in, redirect to dashboard
                router.push('/dashboard');
            } else {
                // Not logged in, show public content
                setIsChecking(false);
            }
        }
    }, [user, loading, router]);

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

    return <>{children}</>;
}

'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Generic Card Skeleton - for loading card components
 */
export function CardSkeleton() {
    return (
        <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </CardContent>
        </Card>
    );
}

/**
 * Voice Recorder Skeleton
 */
export function VoiceRecorderSkeleton() {
    return (
        <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-5 w-36" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Recording circle */}
                <div className="flex flex-col items-center gap-6 py-8">
                    <Skeleton className="h-28 w-28 rounded-full" />
                    <Skeleton className="h-10 w-40 rounded-lg" />
                </div>
                {/* Timer */}
                <Skeleton className="h-8 w-24 mx-auto rounded-lg" />
            </CardContent>
        </Card>
    );
}

/**
 * Journal Entry Skeleton - single entry
 */
export function JournalEntrySkeleton() {
    return (
        <div className="p-4 bg-muted/50 border border-border rounded-xl space-y-3">
            <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
                <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
            </div>
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </div>
    );
}

/**
 * Journal Entries List Skeleton
 */
export function JournalEntriesListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                    <JournalEntrySkeleton key={i} />
                ))}
                <Skeleton className="h-10 w-full rounded-lg mt-2" />
            </CardContent>
        </Card>
    );
}

/**
 * Mood Tracker Skeleton
 */
export function MoodTrackerSkeleton() {
    return (
        <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Mood buttons grid */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 rounded-lg" />
                        ))}
                    </div>
                </div>
                {/* Recent moods */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Daily Prompts Skeleton
 */
export function DailyPromptsSkeleton() {
    return (
        <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-6 w-10 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Goal Tracker Skeleton
 */
export function GoalTrackerSkeleton() {
    return (
        <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-xl">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="text-center space-y-1">
                            <Skeleton className="h-7 w-12 mx-auto" />
                            <Skeleton className="h-3 w-16 mx-auto" />
                        </div>
                    ))}
                </div>
                {/* Goal items */}
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="p-4 bg-muted/50 border border-border rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

/**
 * Search Filters Skeleton
 */
export function SearchFiltersSkeleton() {
    return (
        <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-5 w-28" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-20 rounded-lg" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Dashboard Page Skeleton - Full page loading
 */
export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                {/* Sidebar skeleton */}
                <div className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card p-4 space-y-4">
                    <Skeleton className="h-8 w-32 mb-8" />
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                </div>

                {/* Main content skeleton */}
                <div className="flex-1 ml-64">
                    {/* Header skeleton */}
                    <div className="sticky top-0 z-30 border-b border-border bg-card p-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-48" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </div>
                    </div>

                    {/* Content skeleton */}
                    <main className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <VoiceRecorderSkeleton />
                                <SearchFiltersSkeleton />
                                <JournalEntriesListSkeleton count={2} />
                            </div>
                            <div className="space-y-6">
                                <DailyPromptsSkeleton />
                                <MoodTrackerSkeleton />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

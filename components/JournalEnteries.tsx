"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Play,
  Pause,
  Calendar,
  Hash,
  Share,
  Trash2,
  Edit,
  Crown,
  MoreHorizontal,
  Loader2,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SubscriptionPlan, JournalEntry } from "@/types";
import { MOOD_CONFIG } from "@/lib/constants";
import { useJournals } from "@/hooks/useJournals";

interface JournalEntriesProps {
  userPlan: SubscriptionPlan;
  preview?: boolean;
}

// Memoized single entry component
const JournalEntryCard = React.memo(({
  entry,
  index,
  userPlan,
  playingId,
  onPlayAudio,
  onDelete,
  onClick,
  isDeleting
}: {
  entry: JournalEntry;
  index: number;
  userPlan: SubscriptionPlan;
  playingId: string | null;
  onPlayAudio: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  isDeleting: boolean;
}) => {
  const getMoodColor = useCallback((mood: string) => {
    const config = MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG];
    return config?.color || "bg-neutral-400";
  }, []);

  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="p-4 bg-muted/50 border border-border rounded-xl hover:bg-muted transition-colors cursor-pointer group"
      onClick={() => onClick(entry.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium">{entry.title}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(entry.date).toLocaleDateString()}
            </div>
            {entry.mood && (
              <div className="flex items-center gap-1.5">
                <motion.div
                  className={`w-2.5 h-2.5 rounded-full ${getMoodColor(entry.mood)}`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="capitalize">{entry.mood}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {entry.audioUrl && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPlayAudio(entry.id)}
              >
                {playingId === entry.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {userPlan === "premium" && (
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(entry.id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {entry.transcription}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {entry.tags.map((tag, tagIndex) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
          >
            <Badge variant="outline" className="text-xs bg-background">
              <Hash className="h-2.5 w-2.5 mr-1" />
              {tag}
            </Badge>
          </motion.div>
        ))}

        {userPlan === "premium" && entry.sentiment && (
          <Badge
            variant="outline"
            className="text-xs ml-auto"
          >
            <Crown className="h-2.5 w-2.5 mr-1" />
            AI: {entry.sentiment}
          </Badge>
        )}
      </div>
    </motion.div>
  );
});

JournalEntryCard.displayName = "JournalEntryCard";

// Loading skeleton for entries
const JournalEntriesSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 bg-muted/50 border border-border rounded-xl space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

// Main component wrapped with React.memo
export const JournalEntries = React.memo(({ userPlan, preview = false }: JournalEntriesProps) => {
  const router = useRouter();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Use real data from backend
  const { journals, loading, error, deleteJournal, stats } = useJournals();

  // Memoize displayed entries
  const displayedEntries = useMemo(() =>
    preview ? journals.slice(0, 3) : journals,
    [preview, journals]
  );

  // Memoize callbacks
  const handlePlayAudio = useCallback((id: string) => {
    setPlayingId(playingId === id ? null : id);
  }, [playingId]);

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteJournal(id);
    } finally {
      setDeletingId(null);
    }
  }, [deleteJournal]);

  const handleClick = useCallback((id: string) => {
    router.push(`/journal/${id}`);
  }, [router]);

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.div
              className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <FileText className="h-4 w-4 text-background" />
            </motion.div>
            Journal Entries
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {loading ? '...' : journals.length} entries
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <JournalEntriesSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-destructive mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : displayedEntries.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No journal entries yet. Start recording your thoughts!
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {displayedEntries.map((entry, index) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                index={index}
                userPlan={userPlan}
                playingId={playingId}
                onPlayAudio={handlePlayAudio}
                onDelete={handleDelete}
                onClick={handleClick}
                isDeleting={deletingId === entry.id}
              />
            ))}
          </AnimatePresence>
        )}

        {!preview && journals.length > 0 && (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button variant="outline" className="w-full">
              Load More Entries
            </Button>
          </motion.div>
        )}

        {userPlan === "basic" && journals.length >= 3 && (
          <motion.div
            className="p-4 bg-muted rounded-xl border border-border text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Crown className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium for unlimited entries and AI analysis
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
});

JournalEntries.displayName = "JournalEntries";
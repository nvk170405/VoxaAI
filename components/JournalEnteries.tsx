"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JournalEntriesProps {
  userPlan: "basic" | "premium";
  preview?: boolean;
}

interface JournalEntry {
  id: string;
  title: string;
  transcription: string;
  audioUrl?: string;
  date: Date;
  mood?: string;
  tags: string[];
  sentiment?: "positive" | "negative" | "neutral";
}

export const JournalEntries = ({ userPlan, preview = false }: JournalEntriesProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const mockEntries: JournalEntry[] = [
    {
      id: "1",
      title: "Morning Reflections",
      transcription: "Today feels like a fresh start. I woke up feeling grateful for the opportunities ahead...",
      date: new Date(2024, 0, 15),
      mood: "grateful",
      tags: ["morning", "gratitude"],
      sentiment: userPlan === "premium" ? "positive" : undefined,
    },
    {
      id: "2",
      title: "Challenging Day",
      transcription: "Work was overwhelming today. I need to find better ways to manage stress...",
      date: new Date(2024, 0, 14),
      mood: "anxious",
      tags: ["work", "stress"],
      sentiment: userPlan === "premium" ? "negative" : undefined,
    },
    {
      id: "3",
      title: "Weekend Plans",
      transcription: "Excited about the weekend. Planning to visit the new art gallery downtown...",
      date: new Date(2024, 0, 13),
      mood: "excited",
      tags: ["weekend", "art"],
      sentiment: userPlan === "premium" ? "positive" : undefined,
    },
  ];

  const displayedEntries = preview ? mockEntries.slice(0, 2) : mockEntries;

  const playAudio = (entryId: string) => {
    if (playingId === entryId) {
      setPlayingId(null);
    } else {
      setPlayingId(entryId);
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  const getMoodColor = (mood: string) => {
    const moodColors: Record<string, string> = {
      happy: "bg-neutral-300 dark:bg-neutral-600",
      calm: "bg-neutral-400 dark:bg-neutral-500",
      excited: "bg-neutral-200 dark:bg-neutral-700",
      sad: "bg-neutral-600 dark:bg-neutral-400",
      angry: "bg-neutral-800 dark:bg-neutral-200",
      anxious: "bg-neutral-500",
      grateful: "bg-neutral-300 dark:bg-neutral-600",
    };
    return moodColors[mood] || "bg-neutral-400";
  };

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
          {preview && (
            <Badge variant="outline" className="text-xs">
              Recent
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {displayedEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-muted/50 border border-border rounded-xl hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{entry.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {entry.date.toLocaleDateString()}
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
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => playAudio(entry.id)}
                      >
                        {playingId === entry.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>

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
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
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
            ))}
          </AnimatePresence>

          {preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button variant="outline" className="w-full mt-2">
                View All Entries
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
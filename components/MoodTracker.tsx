"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  Smile,
  Meh,
  Frown,
  Crown,
  TrendingUp,
  Brain,
  Loader2
} from "lucide-react";
import type { SubscriptionPlan, MoodType, MoodEntry } from "@/types";
import { useMoods } from "@/hooks/useMoods";

interface MoodTrackerProps {
  userPlan: SubscriptionPlan;
  preview?: boolean;
}

// Memoized mood button component
const MoodButton = React.memo(({
  mood,
  isSelected,
  onSelect,
  disabled
}: {
  mood: { name: string; icon: React.ComponentType<{ className?: string }>; label: string };
  isSelected: boolean;
  onSelect: (name: string) => void;
  disabled?: boolean;
}) => {
  const Icon = mood.icon;

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <Button
        variant="outline"
        disabled={disabled}
        className={`h-16 w-full flex-col gap-1.5 ${isSelected
          ? "bg-foreground text-background border-foreground hover:bg-foreground/90 hover:text-background"
          : "hover:bg-muted"
          }`}
        onClick={() => onSelect(mood.name)}
      >
        <Icon className="h-5 w-5" />
        <span className="text-xs">{mood.label}</span>
      </Button>
    </motion.div>
  );
});

MoodButton.displayName = "MoodButton";

// Memoized mood history item
const MoodHistoryItem = React.memo(({
  entry,
  index,
  userPlan
}: {
  entry: MoodEntry;
  index: number;
  userPlan: SubscriptionPlan;
}) => (
  <motion.div
    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ x: 4 }}
  >
    <div className="flex items-center gap-3">
      <motion.div
        className="w-3 h-3 rounded-full bg-neutral-400 dark:bg-neutral-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
      />
      <span className="text-sm capitalize font-medium">{entry.mood}</span>
      <span className="text-xs text-muted-foreground">
        {new Date(entry.date).toLocaleDateString()}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{entry.intensity}/10</span>
      {userPlan === "premium" && entry.sentiment && (
        <Badge variant="outline" className="text-xs">
          {entry.sentiment}
        </Badge>
      )}
    </div>
  </motion.div>
));

MoodHistoryItem.displayName = "MoodHistoryItem";

// Loading skeleton for mood history
const MoodHistorySkeleton = () => (
  <div className="space-y-2">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </div>
);

// Main component wrapped with React.memo
export const MoodTracker = React.memo(({ userPlan, preview = false }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [isLogging, setIsLogging] = useState(false);

  // Use real data from backend
  const { moods, loading, error, stats, logMood: logMoodToBackend, todaysMood } = useMoods();

  // Memoize moods configuration
  const moodOptions = useMemo(() => [
    { name: "happy", icon: Smile, label: "Happy" },
    { name: "calm", icon: Meh, label: "Calm" },
    { name: "excited", icon: Smile, label: "Excited" },
    { name: "sad", icon: Frown, label: "Sad" },
    { name: "angry", icon: Frown, label: "Angry" },
    { name: "anxious", icon: Frown, label: "Anxious" },
    { name: "grateful", icon: Heart, label: "Grateful" },
  ], []);

  // Memoize displayed entries
  const displayedHistory = useMemo(() =>
    preview ? moods.slice(0, 3) : moods.slice(0, 5),
    [preview, moods]
  );

  // Memoize callbacks
  const handleMoodSelect = useCallback((moodName: string) => {
    setSelectedMood(moodName);
  }, []);

  const handleIntensityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMoodIntensity(Number(e.target.value));
  }, []);

  const handleLogMood = useCallback(async () => {
    if (selectedMood) {
      setIsLogging(true);
      try {
        await logMoodToBackend(selectedMood as MoodType, moodIntensity);
        setSelectedMood(null);
        setMoodIntensity(5);
      } catch (err) {
        console.error('Failed to log mood:', err);
      } finally {
        setIsLogging(false);
      }
    }
  }, [selectedMood, moodIntensity, logMoodToBackend]);

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.div
              className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 text-background" />
            </motion.div>
            Mood Tracker
          </CardTitle>
          {userPlan === "premium" && (
            <Badge variant="outline" className="bg-foreground text-background border-foreground text-xs">
              <Crown className="h-3 w-3 mr-1" />
              AI
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's mood indicator */}
        {todaysMood && (
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Today's mood</p>
            <div className="flex items-center gap-2">
              <span className="capitalize font-medium">{todaysMood.mood}</span>
              <span className="text-sm text-muted-foreground">• {todaysMood.intensity}/10</span>
            </div>
          </div>
        )}

        {!preview && !todaysMood && (
          <>
            <div>
              <p className="text-sm font-medium mb-3">How are you feeling today?</p>
              <div className="grid grid-cols-4 gap-2">
                {moodOptions.slice(0, 8).map((mood, index) => (
                  <motion.div
                    key={mood.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MoodButton
                      mood={mood}
                      isSelected={selectedMood === mood.name}
                      onSelect={handleMoodSelect}
                      disabled={isLogging}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {selectedMood && (
                <motion.div
                  className="p-4 bg-muted rounded-xl border border-border"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium mb-3">Intensity (1-10)</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={moodIntensity}
                      onChange={handleIntensityChange}
                      className="flex-1 accent-foreground"
                      disabled={isLogging}
                    />
                    <motion.span
                      className="text-sm font-medium w-8 text-center bg-foreground text-background rounded-md py-1"
                      key={moodIntensity}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {moodIntensity}
                    </motion.span>
                  </div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      onClick={handleLogMood}
                      disabled={isLogging}
                      className="w-full mt-4 bg-foreground text-background hover:bg-foreground/90"
                    >
                      {isLogging ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Logging...
                        </>
                      ) : (
                        'Log Mood'
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {userPlan === "premium" && stats && (
          <motion.div
            className="p-4 bg-muted rounded-xl border border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium">AI Insights</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: `${stats.positivePercentage}%`, label: "Positive" },
                { value: `${stats.averageIntensity}/10`, label: "Avg Intensity" },
                { value: stats.streak, label: "Day Streak" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div>
          <p className="text-sm font-medium mb-3">Recent Moods</p>
          {loading ? (
            <MoodHistorySkeleton />
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : displayedHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No moods logged yet. Start tracking your mood!
            </p>
          ) : (
            <div className="space-y-2">
              {displayedHistory.map((entry, index) => (
                <MoodHistoryItem
                  key={entry.id || index}
                  entry={entry}
                  index={index}
                  userPlan={userPlan}
                />
              ))}
            </div>
          )}
        </div>

        {userPlan === "basic" && (
          <motion.div
            className="p-4 bg-muted rounded-xl border border-border text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Crown className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium for AI sentiment analysis
            </p>
          </motion.div>
        )}

        {preview && (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button variant="outline" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Mood Analytics
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
});

MoodTracker.displayName = "MoodTracker";
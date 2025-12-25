"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Smile,
  Meh,
  Frown,
  Crown,
  TrendingUp,
  Brain
} from "lucide-react";

interface MoodTrackerProps {
  userPlan: "basic" | "premium";
  preview?: boolean;
}

interface MoodEntry {
  date: Date;
  mood: string;
  intensity: number;
  sentiment?: "positive" | "negative" | "neutral";
}

export const MoodTracker = ({ userPlan, preview = false }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState(5);

  const moods = [
    { name: "happy", icon: Smile, label: "Happy" },
    { name: "calm", icon: Meh, label: "Calm" },
    { name: "excited", icon: Smile, label: "Excited" },
    { name: "sad", icon: Frown, label: "Sad" },
    { name: "angry", icon: Frown, label: "Angry" },
    { name: "anxious", icon: Frown, label: "Anxious" },
    { name: "grateful", icon: Heart, label: "Grateful" },
  ];

  const mockMoodHistory: MoodEntry[] = [
    { date: new Date(2024, 0, 15), mood: "grateful", intensity: 8, sentiment: userPlan === "premium" ? "positive" : undefined },
    { date: new Date(2024, 0, 14), mood: "anxious", intensity: 6, sentiment: userPlan === "premium" ? "negative" : undefined },
    { date: new Date(2024, 0, 13), mood: "excited", intensity: 9, sentiment: userPlan === "premium" ? "positive" : undefined },
    { date: new Date(2024, 0, 12), mood: "calm", intensity: 7, sentiment: userPlan === "premium" ? "neutral" : undefined },
  ];

  const logMood = () => {
    if (selectedMood) {
      console.log(`Logged mood: ${selectedMood} with intensity ${moodIntensity}`);
      setSelectedMood(null);
      setMoodIntensity(5);
    }
  };

  const getMoodStats = () => {
    if (userPlan !== "premium") return null;

    const positiveCount = mockMoodHistory.filter(entry =>
      ["happy", "excited", "grateful", "calm"].includes(entry.mood)
    ).length;

    const percentage = Math.round((positiveCount / mockMoodHistory.length) * 100);

    return {
      positivePercentage: percentage,
      averageIntensity: Math.round(mockMoodHistory.reduce((sum, entry) => sum + entry.intensity, 0) / mockMoodHistory.length),
      streak: 3,
    };
  };

  const stats = getMoodStats();

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
        {!preview && (
          <>
            <div>
              <p className="text-sm font-medium mb-3">How are you feeling today?</p>
              <div className="grid grid-cols-4 gap-2">
                {moods.slice(0, 8).map((mood, index) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.name;

                  return (
                    <motion.div
                      key={mood.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className={`h-16 w-full flex-col gap-1.5 ${isSelected
                            ? "bg-foreground text-background border-foreground hover:bg-foreground/90 hover:text-background"
                            : "hover:bg-muted"
                          }`}
                        onClick={() => setSelectedMood(mood.name)}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{mood.label}</span>
                      </Button>
                    </motion.div>
                  );
                })}
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
                      onChange={(e) => setMoodIntensity(Number(e.target.value))}
                      className="flex-1 accent-foreground"
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
                      onClick={logMood}
                      className="w-full mt-4 bg-foreground text-background hover:bg-foreground/90"
                    >
                      Log Mood
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
          <div className="space-y-2">
            {mockMoodHistory.slice(0, preview ? 3 : 5).map((entry, index) => (
              <motion.div
                key={index}
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
                    {entry.date.toLocaleDateString()}
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
            ))}
          </div>
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
};
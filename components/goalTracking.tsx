"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Plus,
  CheckCircle,
  Clock,
  TrendingUp,
  Trophy,
  Calendar,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface GoalTrackerProps {
  preview?: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "health" | "career" | "personal" | "education";
  progress: number;
  target: number;
  deadline: Date;
  status: "active" | "completed" | "paused";
}

export const GoalTracker = ({ preview = false }: GoalTrackerProps) => {
  const [newGoal, setNewGoal] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);

  const mockGoals: Goal[] = [
    {
      id: "1",
      title: "Daily Journaling",
      description: "Write in journal every day for mental wellness",
      category: "health",
      progress: 18,
      target: 30,
      deadline: new Date(2024, 1, 15),
      status: "active",
    },
    {
      id: "2",
      title: "Learn Spanish",
      description: "Practice Spanish for 30 minutes daily",
      category: "education",
      progress: 12,
      target: 60,
      deadline: new Date(2024, 3, 1),
      status: "active",
    },
    {
      id: "3",
      title: "Read 12 Books",
      description: "Read one book per month this year",
      category: "personal",
      progress: 2,
      target: 12,
      deadline: new Date(2024, 11, 31),
      status: "active",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "paused":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      console.log(`Adding goal: ${newGoal}`);
      setNewGoal("");
      setShowAddGoal(false);
    }
  };

  const displayedGoals = preview ? mockGoals.slice(0, 2) : mockGoals;

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.div
              className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 10 }}
            >
              <Target className="h-4 w-4 text-background" />
            </motion.div>
            Goal Tracker
          </CardTitle>
          <Badge variant="outline" className="bg-foreground text-background border-foreground text-xs">
            <Trophy className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!preview && !showAddGoal && (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={() => setShowAddGoal(true)}
              variant="outline"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          {showAddGoal && (
            <motion.div
              className="p-4 bg-muted rounded-xl border border-border space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Goal</span>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowAddGoal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              <Input
                placeholder="Enter your goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="bg-background"
              />
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  onClick={addGoal}
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                >
                  Add Goal
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {displayedGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              className="p-4 bg-muted/50 border border-border rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{goal.title}</h3>
                    {getStatusIcon(goal.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{goal.description}</p>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {goal.category}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{goal.progress}/{goal.target}</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: {goal.deadline.toLocaleDateString()}
                  </div>
                  <span>{Math.round((goal.progress / goal.target) * 100)}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {preview && (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button variant="outline" className="w-full">
              View All Goals
            </Button>
          </motion.div>
        )}

        {!preview && (
          <motion.div
            className="p-4 bg-muted rounded-xl border border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center mb-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="h-6 w-6" />
              </motion.div>
            </div>
            <h3 className="font-medium text-center mb-3">Achievement Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: "3", label: "Active" },
                { value: "67%", label: "Avg Progress" },
                { value: "5", label: "Completed" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
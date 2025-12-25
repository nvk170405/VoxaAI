"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { VoiceRecorder } from "@/components/voiceRecorder";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { JournalEntries } from "@/components/JournalEnteries";
import { DailyPrompts } from "@/components/DailyPrompts";
import { MoodTracker } from "@/components/MoodTracker";
import { SearchFilters } from "@/components/searchFilter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useJournals } from "@/hooks/useJournals";
import { useMoods } from "@/hooks/useMoods";
import {
  FileText,
  Heart,
  TrendingUp,
  Calendar,
  Sparkles,
  Target,
  Mic
} from "lucide-react";
import type { SubscriptionPlan } from "@/types";

// Lazy load heavy components
const GoalTracker = dynamic(() => import("@/components/goalTracking").then(mod => ({ default: mod.GoalTracker })), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

const Analytics = dynamic(() => import("@/components/analyticsview").then(mod => ({ default: mod.Analytics })), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

const SettingsView = dynamic(() => import("@/components/SettingsView").then(mod => ({ default: mod.SettingsView })), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

// Skeleton component for loading states
const CardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-5 w-32" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

// Stats Card Component
const StatsCard = React.memo(({
  icon: Icon,
  label,
  value,
  subtext,
  gradient
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  gradient: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2 }}
    className="relative overflow-hidden"
  >
    <Card className="border-border bg-card/80 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtext && (
              <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

StatsCard.displayName = "StatsCard";

// Greeting component with time-based message
const WelcomeSection = React.memo(({ userName }: { userName?: string }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to capture your thoughts today?",
      "What's on your mind today?",
      "Let's make today meaningful",
      "Your journey continues here",
      "Take a moment to reflect"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <span className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <h1 className="text-3xl font-bold">
        {getGreeting()}{userName ? `, ${userName.split(' ')[0]}` : ''}! 👋
      </h1>
      <p className="text-muted-foreground mt-1">{getMotivationalMessage()}</p>
    </motion.div>
  );
});

WelcomeSection.displayName = "WelcomeSection";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Memoized dashboard content component
const DashboardContent = React.memo(({
  userPlan,
  isRecording,
  setIsRecording,
  userName
}: {
  userPlan: SubscriptionPlan;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  userName?: string;
}) => {
  const { journals, stats: journalStats } = useJournals();
  const { stats: moodStats } = useMoods();

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <WelcomeSection userName={userName} />

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        <StatsCard
          icon={FileText}
          label="Total Journals"
          value={journalStats?.totalJournals || journals.length}
          subtext="All time entries"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatsCard
          icon={Calendar}
          label="This Week"
          value={journalStats?.journalsThisWeek || 0}
          subtext="New entries"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatsCard
          icon={Heart}
          label="Mood Streak"
          value={moodStats?.streak || 0}
          subtext="Days in a row"
          gradient="bg-gradient-to-br from-pink-500 to-rose-500"
        />
        <StatsCard
          icon={TrendingUp}
          label="Positive Days"
          value={`${moodStats?.positivePercentage || 0}%`}
          subtext="Based on mood logs"
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
        />
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main features */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <VoiceRecorder isRecording={isRecording} onToggleRecording={setIsRecording} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <JournalEntries userPlan={userPlan} preview />
          </motion.div>
        </div>

        {/* Right column - Widgets */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <MoodTracker userPlan={userPlan} preview />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DailyPrompts userPlan={userPlan} preview />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SearchFilters userPlan={userPlan} />
          </motion.div>
          {userPlan === "premium" && (
            <motion.div variants={itemVariants}>
              <GoalTracker preview />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

DashboardContent.displayName = "DashboardContent";

// Premium placeholder component
const PremiumPlaceholder = React.memo(({ feature }: { feature: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border border-border"
  >
    <Target className="h-12 w-12 text-muted-foreground/50 mb-3" />
    <p className="text-muted-foreground font-medium">{feature}</p>
    <p className="text-sm text-muted-foreground mt-1">Available for Premium users</p>
  </motion.div>
));

PremiumPlaceholder.displayName = "PremiumPlaceholder";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isRecording, setIsRecording] = useState(false);
  const [userPlan, setUserPlan] = useState<SubscriptionPlan>("basic");
  const { user } = useAuth();

  // Memoize view change handler
  const handleViewChange = useCallback((view: string) => {
    setActiveView(view);
  }, []);

  // Memoize plan change handler
  const handlePlanChange = useCallback((plan: SubscriptionPlan) => {
    setUserPlan(plan);
  }, []);

  // Memoize recording toggle handler
  const handleToggleRecording = useCallback((recording: boolean) => {
    setIsRecording(recording);
  }, []);

  // Memoize main content rendering
  const renderMainContent = useMemo(() => {
    switch (activeView) {
      case "entries":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <JournalEntries userPlan={userPlan} />
          </motion.div>
        );
      case "prompts":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DailyPrompts userPlan={userPlan} />
          </motion.div>
        );
      case "mood":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MoodTracker userPlan={userPlan} />
          </motion.div>
        );
      case "goals":
        return userPlan === "premium" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GoalTracker />
          </motion.div>
        ) : (
          <PremiumPlaceholder feature="Goal tracking" />
        );
      case "analytics":
        return userPlan === "premium" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Analytics />
          </motion.div>
        ) : (
          <PremiumPlaceholder feature="Analytics" />
        );
      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SettingsView userPlan={userPlan} onPlanChange={handlePlanChange} />
          </motion.div>
        );
      default:
        return (
          <DashboardContent
            userPlan={userPlan}
            isRecording={isRecording}
            setIsRecording={handleToggleRecording}
            userName={user?.displayName || undefined}
          />
        );
    }
  }, [activeView, userPlan, isRecording, handlePlanChange, handleToggleRecording, user?.displayName]);

  return (
    <div className="min-h-screen bg-background font-montserrat">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/20 pointer-events-none" />

      <div className="relative flex">
        {/* Sidebar - fixed on desktop, sheet drawer on mobile */}
        <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
          <DashboardSidebar
            activeView={activeView}
            onViewChange={handleViewChange}
            userPlan={userPlan}
          />
        </div>

        {/* Mobile sidebar trigger */}
        <div className="lg:hidden">
          <DashboardSidebar
            activeView={activeView}
            onViewChange={handleViewChange}
            userPlan={userPlan}
          />
        </div>

        {/* Main content area - full width on mobile, with margin on desktop */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Sticky Header */}
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
            <DashboardHeader userPlan={userPlan} />
          </div>

          {/* Scrollable content */}
          <main className="flex-1 p-4 lg:p-8 overflow-auto">
            {renderMainContent}
          </main>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
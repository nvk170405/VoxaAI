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
import { Skeleton } from "@/components/ui/skeleton";
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

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
  setIsRecording
}: {
  userPlan: SubscriptionPlan;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
}) => (
  <motion.div
    className="space-y-6"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {/* Main content grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Main features */}
      <div className="lg:col-span-2 space-y-6">
        <motion.div variants={itemVariants}>
          <VoiceRecorder isRecording={isRecording} onToggleRecording={setIsRecording} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SearchFilters userPlan={userPlan} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <JournalEntries userPlan={userPlan} preview />
        </motion.div>
      </div>

      {/* Right column - Widgets */}
      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <DailyPrompts userPlan={userPlan} preview />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MoodTracker userPlan={userPlan} preview />
        </motion.div>
        {userPlan === "premium" && (
          <motion.div variants={itemVariants}>
            <GoalTracker preview />
          </motion.div>
        )}
      </div>
    </div>
  </motion.div>
));

DashboardContent.displayName = "DashboardContent";

// Premium placeholder component
const PremiumPlaceholder = React.memo(({ feature }: { feature: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center justify-center h-64 bg-card rounded-xl border border-border"
  >
    <p className="text-muted-foreground">{feature} is available for Premium users only</p>
  </motion.div>
));

PremiumPlaceholder.displayName = "PremiumPlaceholder";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isRecording, setIsRecording] = useState(false);
  const [userPlan, setUserPlan] = useState<SubscriptionPlan>("basic");

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
          />
        );
    }
  }, [activeView, userPlan, isRecording, handlePlanChange, handleToggleRecording]);

  return (
    <div className="min-h-screen bg-background font-montserrat">
      <div className="flex">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 h-screen z-40">
          <DashboardSidebar
            activeView={activeView}
            onViewChange={handleViewChange}
            userPlan={userPlan}
          />
        </div>

        {/* Main content area with left margin to account for fixed sidebar */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {/* Fixed Header */}
          <div className="sticky top-0 z-30">
            <DashboardHeader userPlan={userPlan} />
          </div>

          {/* Scrollable content */}
          <main className="flex-1 p-6 overflow-auto">
            {renderMainContent}
          </main>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
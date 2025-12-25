"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { VoiceRecorder } from "@/components/voiceRecorder";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { JournalEntries } from "@/components/JournalEnteries";
import { DailyPrompts } from "@/components/DailyPrompts";
import { MoodTracker } from "@/components/MoodTracker";
import { GoalTracker } from "@/components/goalTracking";
import { Analytics } from "@/components/analyticsview";
import { SettingsView } from "@/components/SettingsView";
import { SearchFilters } from "@/components/searchFilter";

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

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isRecording, setIsRecording] = useState(false);
  const [userPlan, setUserPlan] = useState<"basic" | "premium">("basic");

  const renderMainContent = () => {
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-64 bg-card rounded-xl border border-border"
          >
            <p className="text-muted-foreground">Goal tracking is available for Premium users only</p>
          </motion.div>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-64 bg-card rounded-xl border border-border"
          >
            <p className="text-muted-foreground">Analytics are available for Premium users only</p>
          </motion.div>
        );
      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SettingsView userPlan={userPlan} onPlanChange={setUserPlan} />
          </motion.div>
        );
      default:
        return (
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
        );
    }
  };

  return (
    <div className="min-h-screen bg-background font-montserrat">
      <div className="flex">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 h-screen z-40">
          <DashboardSidebar
            activeView={activeView}
            onViewChange={setActiveView}
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
            {renderMainContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
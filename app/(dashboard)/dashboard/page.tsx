"use client";

import  {useState } from "react";
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

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isRecording, setIsRecording] = useState(false);
  const [userPlan, setUserPlan] = useState<"basic" | "premium">("basic");

  const renderMainContent = () => {
    switch (activeView) {
      case "entries":
        return <JournalEntries userPlan={userPlan} />;
      case "prompts":
        return <DailyPrompts userPlan={userPlan} />;
      case "mood":
        return <MoodTracker userPlan={userPlan} />;
      case "goals":
        return userPlan === "premium" ? <GoalTracker /> : <div className="p-8 text-center text-muted-foreground">Goal tracking is available for Premium users only</div>;
      case "analytics":
        return userPlan === "premium" ? <Analytics /> : <div className="p-8 text-center text-muted-foreground">Analytics are available for Premium users only</div>;
      case "settings":
        return <SettingsView userPlan={userPlan} onPlanChange={setUserPlan} />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <VoiceRecorder isRecording={isRecording} onToggleRecording={setIsRecording} />
                <SearchFilters userPlan={userPlan} />
                <JournalEntries userPlan={userPlan} preview />
              </div>
              <div className="space-y-6">
                <DailyPrompts userPlan={userPlan} preview />
                <MoodTracker userPlan={userPlan} preview />
                {userPlan === "premium" && <GoalTracker preview />}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background font-montserrat">
      <div className="flex">
        <DashboardSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          userPlan={userPlan}
        />
        <div className="flex-1">
          <DashboardHeader userPlan={userPlan} />
          <main className="p-6">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
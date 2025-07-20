import { 
  Home, 
  FileText, 
  MessageSquare, 
  Heart, 
  Target, 
  BarChart3, 
  Settings,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userPlan: "basic" | "premium";
}

export const DashboardSidebar = ({ activeView, onViewChange, userPlan }: DashboardSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "entries", label: "Journal Entries", icon: FileText },
    { id: "prompts", label: "Daily Prompts", icon: MessageSquare },
    { id: "mood", label: "Mood Tracker", icon: Heart },
    { id: "goals", label: "Goal Tracker", icon: Target, premium: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, premium: true },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">VoiceJournal</span>
        </div>
        
        <div className="mb-4">
          <Badge 
            variant={userPlan === "premium" ? "default" : "secondary"}
            className={userPlan === "premium" ? "tier-premium" : "tier-basic"}
          >
            {userPlan === "premium" && <Crown className="h-3 w-3 mr-1" />}
            {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
          </Badge>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isDisabled = item.premium && userPlan !== "premium";
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${isDisabled ? "opacity-50" : ""}`}
                onClick={() => !isDisabled && onViewChange(item.id)}
                disabled={isDisabled}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.premium && userPlan !== "premium" && (
                  <Crown className="h-3 w-3 ml-auto text-muted-foreground" />
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
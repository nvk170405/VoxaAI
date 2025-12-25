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
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-background" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">Voxa</span>
            <p className="text-xs text-muted-foreground">Voice Journal</p>
          </div>
        </div>
      </div>

      {/* Plan Badge */}
      <div className="px-6 py-4">
        <Badge
          variant="outline"
          className={`w-full justify-center py-1.5 ${userPlan === "premium"
              ? "bg-foreground text-background border-foreground"
              : "bg-muted text-muted-foreground border-border"
            }`}
        >
          {userPlan === "premium" && <Crown className="h-3 w-3 mr-1.5" />}
          {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const isDisabled = item.premium && userPlan !== "premium";
          const isActive = activeView === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start gap-3 h-11 px-4 transition-all duration-200 ${isActive
                  ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                  : "hover:bg-muted"
                } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
              onClick={() => !isDisabled && onViewChange(item.id)}
              disabled={isDisabled}
            >
              <item.icon className={`h-4 w-4 ${isActive ? "" : "text-muted-foreground"}`} />
              <span className="font-medium">{item.label}</span>
              {item.premium && userPlan !== "premium" && (
                <Crown className="h-3 w-3 ml-auto text-muted-foreground" />
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © 2024 Voxa
        </p>
      </div>
    </aside>
  );
};
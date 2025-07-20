import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sun, 
  Moon, 
  Crown, 
  Zap,
  Palette,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  userPlan: "basic" | "premium";
}

export const DashboardHeader = ({ userPlan }: DashboardHeaderProps) => {
  const [theme, setTheme] = useState<"light" | "dark" | "ocean" | "sunset" | "forest">("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const setPremiumTheme = (themeName: "ocean" | "sunset" | "forest") => {
    if (userPlan === "premium") {
      setTheme(themeName);
      document.documentElement.className = `theme-${themeName}`;
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Voice Journal Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Palette className="h-4 w-4 mr-2" />
              Themes
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "light" ? (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  Light Mode
                </>
              )}
            </DropdownMenuItem>
            
            {userPlan === "premium" && (
              <>
                <DropdownMenuItem onClick={() => setPremiumTheme("ocean")}>
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
                  Ocean Theme
                  <Crown className="h-3 w-3 ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPremiumTheme("sunset")}>
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-2" />
                  Sunset Theme
                  <Crown className="h-3 w-3 ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPremiumTheme("forest")}>
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                  Forest Theme
                  <Crown className="h-3 w-3 ml-auto" />
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Plan Badge */}
        <Badge 
          variant={userPlan === "premium" ? "default" : "secondary"}
          className={userPlan === "premium" ? "tier-premium" : "tier-basic"}
        >
          {userPlan === "premium" && <Crown className="h-3 w-3 mr-1" />}
          {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
        </Badge>

        {/* Upgrade Button for Basic Users */}
        {userPlan === "basic" && (
          <Button size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        )}

        {/* Profile */}
        <Button variant="outline" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
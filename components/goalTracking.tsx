import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Plus, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Trophy,
  Calendar
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

  const getCategoryColor = (category: string) => {
    const colors = {
      health: "bg-green-100 text-green-800",
      career: "bg-blue-100 text-blue-800",
      personal: "bg-purple-100 text-purple-800",
      education: "bg-orange-100 text-orange-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "paused":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Goal Tracker
          <Badge className="tier-premium">
            <Trophy className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!preview && !showAddGoal && (
          <Button 
            onClick={() => setShowAddGoal(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
        )}

        {showAddGoal && (
          <div className="p-4 border border-border rounded-lg space-y-3">
            <Input
              placeholder="Enter your goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={addGoal} size="sm">
                Add Goal
              </Button>
              <Button 
                onClick={() => setShowAddGoal(false)} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {displayedGoals.map((goal) => (
            <div key={goal.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(goal.status)}
                  <Badge 
                    variant="outline" 
                    className={getCategoryColor(goal.category)}
                  >
                    {goal.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{goal.progress}/{goal.target}</span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: {goal.deadline.toLocaleDateString()}
                  </div>
                  <span>{Math.round((goal.progress / goal.target) * 100)}% complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {preview && (
          <Button variant="outline" className="w-full">
            View All Goals
          </Button>
        )}

        {!preview && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Goal Achievement Stats</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-lg font-bold text-primary">3</div>
                  <div className="text-muted-foreground">Active Goals</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">67%</div>
                  <div className="text-muted-foreground">Avg Progress</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">5</div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Crown, 
  TrendingUp, 
  Brain, 
  Calendar,
  Heart,
  Target,
  MessageSquare
} from "lucide-react";

export const Analytics = () => {
  const mockStats = {
    totalEntries: 47,
    streakDays: 12,
    averageMood: 7.2,
    wordsWritten: 15840,
    mostActiveDay: "Tuesday",
    moodTrend: "improving",
    completedGoals: 8,
  };

  const moodData = [
    { mood: "Happy", count: 15, percentage: 32 },
    { mood: "Calm", count: 12, percentage: 25 },
    { mood: "Grateful", count: 10, percentage: 21 },
    { mood: "Excited", count: 6, percentage: 13 },
    { mood: "Anxious", count: 4, percentage: 9 },
  ];

  const weeklyProgress = [
    { week: "Week 1", entries: 6, mood: 6.8 },
    { week: "Week 2", entries: 7, mood: 7.1 },
    { week: "Week 3", entries: 5, mood: 6.9 },
    { week: "Week 4", entries: 7, mood: 7.5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <Badge className="tier-premium">
          <Crown className="h-3 w-3 mr-1" />
          Premium Feature
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockStats.totalEntries}</div>
            <div className="text-sm text-muted-foreground">Journal Entries</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockStats.streakDays}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockStats.averageMood}/10</div>
            <div className="text-sm text-muted-foreground">Avg Mood</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockStats.completedGoals}</div>
            <div className="text-sm text-muted-foreground">Goals Completed</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodData.map((item) => (
                <div key={item.mood} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full mood-${item.mood.toLowerCase()}`} />
                    <span className="font-medium">{item.mood}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyProgress.map((week) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{week.week}</span>
                    <div className="flex gap-4">
                      <span>{week.entries} entries</span>
                      <span>Mood: {week.mood}/10</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="progress-track">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(week.entries / 7) * 100}%` }}
                      />
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(week.mood / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Mood Coach Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Positive Trend</span>
                </div>
                <p className="text-sm text-green-700">
                  Your mood has improved 15% over the past month. Keep up the great work with your journaling routine!
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Peak Performance</span>
                </div>
                <p className="text-sm text-blue-700">
                  Tuesdays are your most productive journaling days. Your entries are 20% longer and more reflective.
                </p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">Goal Alignment</span>
                </div>
                <p className="text-sm text-purple-700">
                  Your journaling about gratitude correlates with 90% of your completed personal goals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-sm ${
                  Math.random() > 0.3 
                    ? Math.random() > 0.7 
                      ? "bg-primary" 
                      : "bg-primary/60"
                    : "bg-muted"
                }`}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-muted rounded-sm" />
              <div className="w-3 h-3 bg-primary/30 rounded-sm" />
              <div className="w-3 h-3 bg-primary/60 rounded-sm" />
              <div className="w-3 h-3 bg-primary rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
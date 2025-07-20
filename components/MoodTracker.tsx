import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  Crown,
  TrendingUp,
  Brain
} from "lucide-react";

interface MoodTrackerProps {
  userPlan: "basic" | "premium";
  preview?: boolean;
}

interface MoodEntry {
  date: Date;
  mood: string;
  intensity: number;
  sentiment?: "positive" | "negative" | "neutral";
}

export const MoodTracker = ({ userPlan, preview = false }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState(5);

  const moods = [
    { name: "happy", icon: Smile, color: "mood-happy", label: "Happy" },
    { name: "calm", icon: Meh, color: "mood-calm", label: "Calm" },
    { name: "excited", icon: Smile, color: "mood-excited", label: "Excited" },
    { name: "sad", icon: Frown, color: "mood-sad", label: "Sad" },
    { name: "angry", icon: Frown, color: "mood-angry", label: "Angry" },
    { name: "anxious", icon: Frown, color: "mood-anxious", label: "Anxious" },
    { name: "grateful", icon: Heart, color: "mood-grateful", label: "Grateful" },
  ];

  const mockMoodHistory: MoodEntry[] = [
    { date: new Date(2024, 0, 15), mood: "grateful", intensity: 8, sentiment: userPlan === "premium" ? "positive" : undefined },
    { date: new Date(2024, 0, 14), mood: "anxious", intensity: 6, sentiment: userPlan === "premium" ? "negative" : undefined },
    { date: new Date(2024, 0, 13), mood: "excited", intensity: 9, sentiment: userPlan === "premium" ? "positive" : undefined },
    { date: new Date(2024, 0, 12), mood: "calm", intensity: 7, sentiment: userPlan === "premium" ? "neutral" : undefined },
  ];

  const logMood = () => {
    if (selectedMood) {
      console.log(`Logged mood: ${selectedMood} with intensity ${moodIntensity}`);
      setSelectedMood(null);
      setMoodIntensity(5);
    }
  };

  const getMoodStats = () => {
    if (userPlan !== "premium") return null;
    
    const positiveCount = mockMoodHistory.filter(entry => 
      ["happy", "excited", "grateful", "calm"].includes(entry.mood)
    ).length;
    
    const percentage = Math.round((positiveCount / mockMoodHistory.length) * 100);
    
    return {
      positivePercentage: percentage,
      averageIntensity: Math.round(mockMoodHistory.reduce((sum, entry) => sum + entry.intensity, 0) / mockMoodHistory.length),
      streak: 3, // Mock streak
    };
  };

  const stats = getMoodStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Mood Tracker
          {userPlan === "premium" && (
            <Badge className="tier-premium">
              <Crown className="h-3 w-3 mr-1" />
              AI Analysis
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!preview && (
          <>
            <div>
              <p className="text-sm font-medium mb-2">How are you feeling today?</p>
              <div className="grid grid-cols-4 gap-2">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.name;
                  
                  return (
                    <Button
                      key={mood.name}
                      variant={isSelected ? "default" : "outline"}
                      className={`h-16 flex-col gap-1 ${isSelected ? mood.color : ""}`}
                      onClick={() => setSelectedMood(mood.name)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{mood.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {selectedMood && (
              <div>
                <p className="text-sm font-medium mb-2">Intensity (1-10)</p>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={moodIntensity}
                    onChange={(e) => setMoodIntensity(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{moodIntensity}</span>
                </div>
                <Button onClick={logMood} className="w-full mt-2">
                  Log Mood
                </Button>
              </div>
            )}
          </>
        )}

        {userPlan === "premium" && stats && (
          <div className="p-3 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Insights</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-primary">{stats.positivePercentage}%</div>
                <div className="text-xs text-muted-foreground">Positive</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">{stats.averageIntensity}/10</div>
                <div className="text-xs text-muted-foreground">Avg Intensity</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">{stats.streak} days</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Recent Moods</p>
          <div className="space-y-2">
            {mockMoodHistory.slice(0, preview ? 3 : 5).map((entry, index) => {
              const mood = moods.find(m => m.name === entry.mood);
              const Icon = mood?.icon || Heart;
              
              return (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${mood?.color || "bg-gray-400"}`} />
                    <span className="text-sm capitalize">{entry.mood}</span>
                    <span className="text-xs text-muted-foreground">
                      {entry.date.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{entry.intensity}/10</span>
                    {userPlan === "premium" && entry.sentiment && (
                      <Badge variant="outline" className="text-xs">
                        AI: {entry.sentiment}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {userPlan === "basic" && (
          <div className="p-3 bg-secondary/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <Crown className="h-3 w-3 inline mr-1" />
              Upgrade to Premium for AI sentiment analysis and detailed mood insights.
            </p>
          </div>
        )}

        {preview && (
          <Button variant="outline" className="w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Detailed Mood Analytics
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
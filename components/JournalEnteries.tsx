import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Play, 
  Pause, 
  Calendar, 
  Hash, 
  Share,
  Trash2,
  Edit,
  Crown
} from "lucide-react";

interface JournalEntriesProps {
  userPlan: "basic" | "premium";
  preview?: boolean;
}

interface JournalEntry {
  id: string;
  title: string;
  transcription: string;
  audioUrl?: string;
  date: Date;
  mood?: string;
  tags: string[];
  sentiment?: "positive" | "negative" | "neutral";
}

export const JournalEntries = ({ userPlan, preview = false }: JournalEntriesProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const mockEntries: JournalEntry[] = [
    {
      id: "1",
      title: "Morning Reflections",
      transcription: "Today feels like a fresh start. I woke up feeling grateful for the opportunities ahead...",
      date: new Date(2024, 0, 15),
      mood: "grateful",
      tags: ["morning", "gratitude"],
      sentiment: userPlan === "premium" ? "positive" : undefined,
    },
    {
      id: "2", 
      title: "Challenging Day",
      transcription: "Work was overwhelming today. I need to find better ways to manage stress...",
      date: new Date(2024, 0, 14),
      mood: "anxious",
      tags: ["work", "stress"],
      sentiment: userPlan === "premium" ? "negative" : undefined,
    },
    {
      id: "3",
      title: "Weekend Plans",
      transcription: "Excited about the weekend. Planning to visit the new art gallery downtown...",
      date: new Date(2024, 0, 13),
      mood: "excited",
      tags: ["weekend", "art"],
      sentiment: userPlan === "premium" ? "positive" : undefined,
    },
  ];

  const displayedEntries = preview ? mockEntries.slice(0, 2) : mockEntries;

  const playAudio = (entryId: string) => {
    if (playingId === entryId) {
      setPlayingId(null);
    } else {
      setPlayingId(entryId);
      // Simulate audio playback
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  const getMoodColor = (mood: string) => {
    const moodColors: Record<string, string> = {
      happy: "mood-happy",
      calm: "mood-calm", 
      excited: "mood-excited",
      sad: "mood-sad",
      angry: "mood-angry",
      anxious: "mood-anxious",
      grateful: "mood-grateful",
    };
    return moodColors[mood] || "bg-gray-400";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Journal Entries
          {preview && (
            <Badge variant="outline" className="ml-auto">
              Recent
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedEntries.map((entry) => (
            <div key={entry.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium">{entry.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    {entry.date.toLocaleDateString()}
                    {entry.mood && (
                      <div className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood)}`} />
                        <span className="capitalize">{entry.mood}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playAudio(entry.id)}
                  >
                    {playingId === entry.id ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  {userPlan === "premium" && (
                    <Button variant="outline" size="sm">
                      <Share className="h-3 w-3" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {entry.transcription}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Hash className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
                
                {userPlan === "premium" && entry.sentiment && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getSentimentColor(entry.sentiment)}`}
                  >
                    <Crown className="h-2 w-2 mr-1" />
                    AI: {entry.sentiment}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          
          {preview && (
            <Button variant="outline" className="w-full">
              View All Entries
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
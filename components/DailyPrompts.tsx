import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  RefreshCw, 
  Sparkles, 
  Crown,
  ArrowRight
} from "lucide-react";

interface DailyPromptsProps {
  userPlan: "basic" | "premium";
  preview?: boolean;
}

export const DailyPrompts = ({ userPlan, preview = false }: DailyPromptsProps) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const basicPrompts = [
    "What are you grateful for today?",
    "Describe your mood in three words.",
    "What was the highlight of your day?",
    "What challenge did you overcome today?",
    "How did you show kindness today?",
  ];

  const premiumPrompts = [
    "Reflecting on your recent journal entries, what patterns do you notice in your emotional responses to stress?",
    "Based on your goals, what small action could you take today to move closer to your aspirations?",
    "Considering your mood trends this week, what activities or thoughts seem to boost your wellbeing?",
    "How has your perspective on [personal challenge] evolved over the past month?",
    "What would you tell your past self from a year ago, given what you've learned about yourself?",
  ];

  const prompts = userPlan === "premium" ? premiumPrompts : basicPrompts;

  const generateNewPrompt = () => {
    if (userPlan === "premium") {
      setIsGenerating(true);
      // Simulate AI prompt generation
      setTimeout(() => {
        setCurrentPrompt((prev) => (prev + 1) % prompts.length);
        setIsGenerating(false);
      }, 1500);
    } else {
      setCurrentPrompt((prev) => (prev + 1) % prompts.length);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Daily Prompts
          {userPlan === "premium" && (
            <Badge className="tier-premium">
              <Crown className="h-3 w-3 mr-1" />
              AI-Generated
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg min-h-[100px] flex items-center">
          {isGenerating ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-spin" />
              Generating personalized prompt...
            </div>
          ) : (
            <p className="text-lg font-medium leading-relaxed">
              {prompts[currentPrompt]}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateNewPrompt}
            variant="outline"
            disabled={isGenerating}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            {userPlan === "premium" ? "Generate New" : "Next Prompt"}
          </Button>
          
          {!preview && (
            <Button>
              <ArrowRight className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          )}
        </div>

        {userPlan === "basic" && (
          <div className="p-3 bg-secondary/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <Crown className="h-3 w-3 inline mr-1" />
              Upgrade to Premium for AI-generated personalized prompts based on your journal history and goals.
            </p>
          </div>
        )}

        {preview && (
          <Button variant="outline" className="w-full">
            View All Prompts
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
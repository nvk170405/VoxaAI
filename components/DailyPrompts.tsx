"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  RefreshCw,
  Crown,
  ArrowRight,
  Sparkles
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
      setTimeout(() => {
        setCurrentPrompt((prev) => (prev + 1) % prompts.length);
        setIsGenerating(false);
      }, 1500);
    } else {
      setCurrentPrompt((prev) => (prev + 1) % prompts.length);
    }
  };

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.div
              className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <MessageSquare className="h-4 w-4 text-background" />
            </motion.div>
            Daily Prompts
          </CardTitle>
          {userPlan === "premium" && (
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge variant="outline" className="bg-foreground text-background border-foreground text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Badge>
            </motion.div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt Display */}
        <motion.div
          className="p-5 bg-muted rounded-xl border border-border min-h-[100px] flex items-center"
          key={currentPrompt}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isGenerating ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <motion.div
                className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Generating personalized prompt...</span>
            </div>
          ) : (
            <p className="text-lg font-medium leading-relaxed">
              {prompts[currentPrompt]}
            </p>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={generateNewPrompt}
              variant="outline"
              disabled={isGenerating}
              className="w-full"
            >
              <motion.div
                animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
                transition={isGenerating ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
              </motion.div>
              {userPlan === "premium" ? "Generate New" : "Next Prompt"}
            </Button>
          </motion.div>

          {!preview && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                <ArrowRight className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            </motion.div>
          )}
        </div>

        {/* Upgrade CTA for Basic */}
        {userPlan === "basic" && (
          <motion.div
            className="p-4 bg-muted rounded-xl border border-border text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Crown className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium for AI-generated personalized prompts
            </p>
          </motion.div>
        )}

        {preview && (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button variant="outline" className="w-full">
              View All Prompts
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
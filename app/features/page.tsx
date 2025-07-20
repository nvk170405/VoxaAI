"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CheckCircle2 } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI-Powered Journaling",
      description:
        "Let AI help you document and reflect effortlessly with intelligent insights and organization.",
      icon: <CheckCircle2 className="text-blue-500 w-6 h-6" />,
    },
    {
      title: "Voice-to-Text Conversion",
      description: "Turn your thoughts into text seamlessly with real-time transcription.",
      icon: <CheckCircle2 className="text-green-500 w-6 h-6" />,
    },
    {
      title: "Cloud Sync",
      description: "Access your journal from anywhere with secure cloud synchronization.",
      icon: <CheckCircle2 className="text-purple-500 w-6 h-6" />,
    },
    {
      title: "Customizable Themes",
      description: "Personalize your journaling experience with unique themes and layouts.",
      icon: <CheckCircle2 className="text-yellow-500 w-6 h-6" />,
    },
    {
      title: "Insights & Analytics",
      description: "Track your progress with mood analysis, word clouds, and trends.",
      icon: <CheckCircle2 className="text-pink-500 w-6 h-6" />,
    },
    {
      title: "Collaboration Tools",
      description: "Share specific entries or collaborate on thoughts with friends or teams.",
      icon: <CheckCircle2 className="text-red-500 w-6 h-6" />,
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="text-center py-16 bg-gray-50 dark:bg-background">
        <h1 className="text-4xl font-bold mb-4 font-montserrat">Discover Our Features</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore the tools that make journaling with Voxa effortless, engaging, and transformative.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center gap-4 pb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-background rounded-full">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gray-50 dark:bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Sign up today and transform the way you journal.
          </p>
          <Button className="p-6 bg-primary text-lg">Get Started</Button>
        </div>
      </section>
    </main>
  );
}

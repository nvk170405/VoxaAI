"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { cn } from "@/lib/utils"

type PricingSwitchProps = {
  onSwitch: (value: string) => void
}

type PricingCardProps = {
  isYearly?: boolean
  title: string
  monthlyPrice?: number
  yearlyPrice?: number
  description: string
  features: string[]
  actionLabel: string
  popular?: boolean
  exclusive?: boolean
}

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="text-center font-montserrat">
    <h2 className="text-3xl font-bold">{title}</h2>
    <p className="text-xl pt-1">{subtitle}</p>
    <br />
  </section>
)

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto font-montserrat" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">
        Monthly
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        Yearly
      </TabsTrigger>
    </TabsList>
  </Tabs>
)

const PricingCard = ({ isYearly, title, monthlyPrice, yearlyPrice, description, features, actionLabel, popular, exclusive }: PricingCardProps) => (
  <Card
    className={cn(`w-72 flex flex-col font-montserrat justify-between py-1 ${popular ? "border-indigo-500" : "border-zinc-700"} mx-auto sm:mx-0`, {
      "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
        exclusive,
    })}>
    <div>
      <CardHeader className="pb-8 pt-4 bg-transparent">
        {isYearly && yearlyPrice && monthlyPrice ? (
          <div className="flex justify-between">
            <CardTitle className="text-zinc-700 bg-transparent dark:text-zinc-300 text-lg">{title}</CardTitle>
            <div
              className={cn("px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white", {
                "bg-gradient-to-r from-blue-500 to-pink-500 dark:text-black ": popular,
              })}>
              Save ${monthlyPrice * 12 - yearlyPrice}
            </div>
          </div>
        ) : (
          <CardTitle className="text-zinc-700 bg-transparent dark:text-zinc-300 text-lg">{title}</CardTitle>
        )}
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">{yearlyPrice && isYearly ? "$" + yearlyPrice : monthlyPrice ? "$" + monthlyPrice : "Custom"}</h3>
          <span className="flex flex-col justify-end text-sm mb-1">{yearlyPrice && isYearly ? "/year" : monthlyPrice ? "/month" : null}</span>
        </div>
        <CardDescription className="pt-1.5 bg-transparent h-12">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 bg-transparent">
        {features.map((feature: string) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className="mt-2">
      <Button className="relative inline-flex w-full items-center justify-center rounded-md bg-primary text-white dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
        {actionLabel}
      </Button>
    </CardFooter>
  </Card>
)

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
)

export default function page() {
  const [isYearly, setIsYearly] = useState(false)
  const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1)

  const plans = [
    {
      title: "Basic",
      monthlyPrice: 10,
      yearlyPrice: 100,
      description: "Essential features you need to get started",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      actionLabel: "Get Started",
    },
    {
      title: "Pro",
      monthlyPrice: 25,
      yearlyPrice: 250,
      description: "Perfect for owners of small & medium businessess",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      actionLabel: "Get Started",
      popular: true,
    },
    
  ]
    const features = [
      { feature: "Voice-to-Text (Single Language) 🎤", basic: true, premium: true },
      { feature: "Multi-Language Transcription", basic: false, premium: true },
      { feature: "Search by Keywords and Dates 🔎", basic: true, premium: true },
      { feature: "Advanced Search Filters", basic: false, premium: true },
      { feature: "Audio Playback 🔉", basic: true, premium: true },
      { feature: "Daily Prompts 🌼", basic: true, premium: true },
      { feature: "AI Personalized Prompts 🤖", basic: false, premium: true },
      { feature: "Themes (Basic) 🏁", basic: true, premium: true },
      { feature: "Premium Themes 🎁", basic: false, premium: true },
      { feature: "Offline Mode 🛜", basic: false, premium: true },
      { feature: "Google Calendar Integration 🗓️", basic: false, premium: true },
      { feature: "Mood and Emotion Tags 😊", basic: true, premium: true },
      { feature: "AI Sentiment Analysis 👨‍🏫", basic: false, premium: true },
      { feature: "Achievements and Rewards 🥇", basic: false, premium: true },
      { feature: "Cloud Backup (10 GB) ⛅", basic: false, premium: true },
    ]
  
  return (
    <>
    <div className="py-8">
      <PricingHeader title="Pricing Plans" subtitle="Choose the plan that's right for you" />
      <PricingSwitch onSwitch={togglePricingPeriod} />
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
        {plans.map((plan) => {
          return <PricingCard key={plan.title} {...plan} isYearly={isYearly} />
        })}
      </section>
    </div>

    <section className="py-48">
    <div className="overflow-x-auto m-4 rounded-md font-montserrat mx-32">
      <table className="min-w-full border-collapse border border-gray-300 rounded-md dark:bg-transparent">
        <thead className="bg-gray-100 dark:bg-background dark:text-[var(--text-light)]">
          <tr>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left rounded-t-md">
              Feature
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
              Basic Plan
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center rounded-t-md">
              Pro Plan 
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((item, index) => (
            <tr
              key={index}
              className="odd:bg-white even:bg-gray-50 dark:bg-background"
            >
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {item.feature}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
                {item.basic ? (
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="h-4 w-4 text-green-500 dark:text-green-400 rounded-md"
                  />
                ) : (
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 text-gray-300 dark:text-gray-600 rounded-md"
                  />
                )}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
                {item.premium ? (
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="h-4 w-4 text-green-500 dark:text-green-400 rounded-md"
                  />
                ) : (
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 text-gray-300 dark:text-gray-600 rounded-md"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </section>
    
  </>
  );
}
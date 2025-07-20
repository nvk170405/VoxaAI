"use client";

import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import React from "react";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Corrected import
import { Compare } from "@/components/ui/compare";

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CircleCheck />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-base">{text}</p>
  </div>
);

const PricingComponent = () => {
  const router = useRouter();

  // Redirects to Signup with plan selection
  const handleSubscribe = (plan: string) => {
    router.push(`/signup?plan=${plan}`);
  };

  const PricingCard = ({ title, price, features, plan }: { title: string; price: string; features: string[]; plan: string }) => (
    <div className="bg-white shadow-md rounded-2xl p-10 w-96 font-montserrat">
      <h2 className="text-xl font-medium text-gray-600 mb-6">{title}</h2>
      <p className="text-5xl font-bold mb-6">
        ${price}
        <span className="text-lg font-normal text-gray-500"> p/month</span>
      </p>
      <ul className="mb-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-600">
            <CheckItem text={feature} />
          </li>
        ))}
      </ul>
      <button onClick={() => handleSubscribe(plan)} className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-300 hover:text-black transition duration-500 ease-in-out">
        Get Started
      </button>
    </div>
  );

  const plans = [
    {
      title: "Professional",
      price: "10",
      features: ["1GB Cloud Backup", "Basic Themes", "Basic Encryption", "Simple Prompts"],
      plan: "basic",
    },
    {
      title: "Business",
      price: "25",
      features: ["10GB Cloud Backup", "Multiple Themes", "Two-Factor Encryption", "AI Personalized Prompts"],
      plan: "premium",
    },
  ];

  return (
    <section className="bg-white relative min-h-screen flex items-center justify-center font-montserrat">
      <div className="relative z-30 flex flex-col items-center w-full px-4">
        <div className="flex justify-center gap-10 py-10">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
        <button className="bg-black text-white px-8 py-4 rounded-lg absolute -bottom-32 p-6 font-montserrat text-md shadow-300 shadow-black hover:bg-gray-300 hover:text-black transition duration-500 ease-in-out">
          <Link href="/pricing">Learn More</Link>
        </button>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="bg-white">
      <section className="font-montserrat text-center mx-auto pt-40 pb-96 bg-white">
        <h1 className="heading text-4xl mb-6 z-40 font-montserrat text-gray-400">
          <span className="text-black">capture</span> your moments <br />
          <span className="text-black">track</span> your growth <span className="text-black">reflect</span> with ease
        </h1>
        <p className="sub-heading text-lg text-gray-500 mb-10 max-w-3xl mx-auto z-40 font-montserrat">
          Voxa: Your AI-powered journaling companion, where thoughts flow effortlessly from voice to text.
        </p>
        <div className="flex justify-center gap-8 z-0">
          <Button className="py-6 z-10 text-lg font-montserrat bg-black text-white font-semibold shadow-md hover:bg-white hover:text-black hover:border-black hover:border-2 hover:shadow-2xl transition-all duration-500 ease-in-out">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button className="py-6 z-10 text-lg font-montserrat bg-gray-200 text-black font-semibold shadow-md hover:bg-black hover:text-white hover:border-white-100 hover:border-2 hover:shadow-2xl transition-all duration-500 ease-in-out">
            <Link href="/features">Learn More</Link>
          </Button>
        </div>
        <section className="bg-white pt-40 -mb-80">
          <div className="max-w-7xl mx-auto px-6">
            <img src="./wavy2.png" className="w-full" alt="Background" />
          </div>
        </section>
      </section>
      <PricingComponent />


      <section className="font-montserrat pb-60 pt-60 mb-72 gap-10 relative bg-white ">
        
          
          <div className="my-20 mx-18 md:mx-20 lg:mx-72 md:text-left">
            <h2 className="absolute pr-96 mr-72 pb-40 text-6xl font-bold text-gray-900">
              Goal Tracking Made Easy
            </h2>
            <div className="pr-96 mr-96 mt-40 absolute text-lg text-wrap text-gray-600">
            Keeping track of your personal and professional goals has never been easier. Our AI-powered system analyzes your journal entries and automatically extracts key tasks, milestones, and objectives.<br/>
            <br/>
              📌 Automated Task Extraction – No need to manually write down tasks. The AI identifies actionable goals and organizes them for you.<br/>
              <br/>
              ⏳ Progress Monitoring – View your achievements over time and track your consistency.<br/>
              <br/>
              🎯 Personalized Recommendations – Get AI-driven insights on how to optimize your daily workflow based on your past entries.<br/>
              <br/>
              
            </div>
            
          </div>
       
      <div className=" absolute right-36 p-4 border rounded-3xl dark:bg-neutral-900 bg-black border-neutral-200 dark:border-neutral-800 ">
      <Compare
        firstImage="https://assets.aceternity.com/code-problem.png"
        secondImage="https://assets.aceternity.com/code-solution.png"
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="h-[450px] w-[400px] md:h-[400px] md:w-[350px]"
        slideMode="hover"
      />
      </div>
      </section>


      <section></section>
      <section className="bg-transparent relative min-h-fit pt-72 flex items-center justify-center">
        <Footer />
      </section>
    </div>
  );
}

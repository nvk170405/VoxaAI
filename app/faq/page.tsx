"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background font-montserrat text-gray-900 dark:text-gray-100">
      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-500 dark:text-gray-300 mb-12">
          Find answers to some common questions below. If you need more information, feel free to reach out to us!
        </p>

        {/* Accordion for FAQ */}
        <Accordion type="single" collapsible className="space-y-4 bg-background dark:bg-background rounded-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-gray-100 dark:bg-background text-lg font-semibold p-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              What is Voxa?
            </AccordionTrigger>
            <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
              Voxa is an AI-powered journaling platform that helps you capture your thoughts, track your growth, and reflect on your life effortlessly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="bg-gray-100 dark:bg-background text-lg font-semibold p-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              How does Voxa work?
            </AccordionTrigger>
            <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
              Voxa uses advanced AI technology to transcribe your voice to text, allowing you to quickly capture your thoughts and organize them in a meaningful way.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="bg-gray-100 dark:bg-background text-lg font-semibold p-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              Is there a mobile app available?
            </AccordionTrigger>
            <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
              Yes, Voxa is available on both Android and iOS, providing you with a seamless journaling experience on the go.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="bg-gray-100 dark:bg-background text-lg font-semibold p-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              Can I export my journal entries?
            </AccordionTrigger>
            <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
              Yes, you can export your journal entries as PDF or text files for easy sharing and printing.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="bg-gray-100 dark:bg-background text-lg font-semibold p-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              What subscription plans do you offer?
            </AccordionTrigger>
            <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
              Voxa offers both monthly and yearly subscription plans, each with a range of features designed to meet your needs. Check out our pricing page for more details.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Call to Action Button */}
        <div className="mt-12">
          <Button className="p-6 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition">
            Contact Support
          </Button>
        </div>
      </section>
    </div>
  );
}

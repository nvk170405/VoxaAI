'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  FileText,
  MessageSquare,
  Heart,
  Target,
  BarChart3,
  Settings,
  Crown,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { SubscriptionPlan } from "@/types";

interface DashboardSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userPlan: SubscriptionPlan;
}

// Sidebar content component (shared between desktop and mobile)
const SidebarContent = ({
  activeView,
  onViewChange,
  userPlan,
  onItemClick
}: DashboardSidebarProps & { onItemClick?: () => void }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "entries", label: "Journal Entries", icon: FileText },
    { id: "prompts", label: "Daily Prompts", icon: MessageSquare },
    { id: "mood", label: "Mood Tracker", icon: Heart },
    { id: "goals", label: "Goal Tracker", icon: Target, premium: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, premium: true },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-background" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">Voxa</span>
            <p className="text-xs text-muted-foreground">Voice Journal</p>
          </div>
        </div>
      </div>

      {/* Plan Badge */}
      <div className="px-6 py-4">
        <Badge
          variant="outline"
          className={`w-full justify-center py-1.5 ${userPlan === "premium"
            ? "bg-foreground text-background border-foreground"
            : "bg-muted text-muted-foreground border-border"
            }`}
        >
          {userPlan === "premium" && <Crown className="h-3 w-3 mr-1.5" />}
          {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const isDisabled = item.premium && userPlan !== "premium";
          const isActive = activeView === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start gap-3 h-11 px-4 transition-all duration-200 ${isActive
                ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                : "hover:bg-muted"
                } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!isDisabled) {
                  onViewChange(item.id);
                  onItemClick?.();
                }
              }}
              disabled={isDisabled}
            >
              <item.icon className={`h-4 w-4 ${isActive ? "" : "text-muted-foreground"}`} />
              <span className="font-medium">{item.label}</span>
              {item.premium && userPlan !== "premium" && (
                <Crown className="h-3 w-3 ml-auto text-muted-foreground" />
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © 2024 Voxa
        </p>
      </div>
    </div>
  );
};

// Mobile hamburger button (exported for use in header)
export const MobileMenuButton = ({
  isOpen,
  onClick
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <Button
    variant="ghost"
    size="icon"
    className="lg:hidden"
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={isOpen ? "close" : "open"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </motion.div>
    </AnimatePresence>
  </Button>
);

// Main sidebar component
export const DashboardSidebar = ({ activeView, onViewChange, userPlan }: DashboardSidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border h-screen flex-col">
        <SidebarContent
          activeView={activeView}
          onViewChange={onViewChange}
          userPlan={userPlan}
        />
      </aside>

      {/* Mobile Sidebar - Sheet drawer */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <MobileMenuButton
            isOpen={isMobileOpen}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent
            activeView={activeView}
            onViewChange={onViewChange}
            userPlan={userPlan}
            onItemClick={() => setIsMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};
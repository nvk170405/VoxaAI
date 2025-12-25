"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Calendar,
  Hash,
  Crown,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  FileText,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubscriptionPlan, JournalEntry, MoodType } from "@/types";
import { useJournals } from "@/hooks/useJournals";
import { MOOD_CONFIG } from "@/lib/constants";

interface SearchFiltersProps {
  userPlan: SubscriptionPlan;
}

// Search result item component
const SearchResultItem = ({ entry }: { entry: JournalEntry }) => {
  const router = useRouter();

  const getMoodColor = (mood: string) => {
    const config = MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG];
    return config?.color || "bg-neutral-400";
  };

  return (
    <motion.div
      className="p-3 bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      onClick={() => router.push(`/journal/${entry.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{entry.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {new Date(entry.date).toLocaleDateString()}
            </span>
            {entry.mood && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood)}`} />
                <span className="text-xs text-muted-foreground capitalize">{entry.mood}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {entry.transcription}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
      {entry.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {entry.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Hash className="h-2 w-2 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const SearchFilters = ({ userPlan }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JournalEntry[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { journals, loading, fetchJournals } = useJournals();

  const moods: MoodType[] = ["happy", "calm", "excited", "sad", "angry", "anxious", "grateful"];
  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "Last 3 Months" },
    { value: "year", label: "This Year" },
  ];

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() && !selectedMood && !dateRange) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Calculate date range
      let startDate: string | undefined;
      const now = new Date();

      switch (dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case "quarter":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
          break;
      }

      // Use the journals from hook and filter locally
      // This prevents re-fetching which causes flickering
      let results = [...journals];

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          (entry) =>
            entry.title.toLowerCase().includes(query) ||
            entry.transcription.toLowerCase().includes(query) ||
            entry.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      if (selectedMood) {
        results = results.filter((entry) => entry.mood === selectedMood);
      }

      if (startDate) {
        const startDateTime = new Date(startDate).getTime();
        results = results.filter((entry) => new Date(entry.date).getTime() >= startDateTime);
      }

      setSearchResults(results.slice(0, 10));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, selectedMood, dateRange, journals]);

  // Debounced search on query change - only depends on filter values, not handleSearch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2 || selectedMood || dateRange) {
        // Inline filter logic to avoid dependency issues
        let results = [...journals];

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          results = results.filter(
            (entry) =>
              entry.title.toLowerCase().includes(query) ||
              entry.transcription.toLowerCase().includes(query) ||
              entry.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        if (selectedMood) {
          results = results.filter((entry) => entry.mood === selectedMood);
        }

        if (dateRange) {
          const now = new Date();
          let startDateTime = 0;

          switch (dateRange) {
            case "today":
              startDateTime = new Date(now.setHours(0, 0, 0, 0)).getTime();
              break;
            case "week":
              startDateTime = now.getTime() - 7 * 24 * 60 * 60 * 1000;
              break;
            case "month":
              startDateTime = now.getTime() - 30 * 24 * 60 * 60 * 1000;
              break;
            case "quarter":
              startDateTime = now.getTime() - 90 * 24 * 60 * 60 * 1000;
              break;
            case "year":
              startDateTime = now.getTime() - 365 * 24 * 60 * 60 * 1000;
              break;
          }

          if (startDateTime > 0) {
            results = results.filter((entry) => new Date(entry.date).getTime() >= startDateTime);
          }
        }

        setSearchResults(results.slice(0, 10));
        setHasSearched(true);
      } else if (!searchQuery.trim() && !selectedMood && !dateRange) {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedMood, dateRange, journals]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedMood("");
    setDateRange("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const hasActiveFilters = searchQuery || selectedMood || dateRange;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.div
              className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Search className="h-4 w-4 text-background" />
            </motion.div>
            Search Entries
          </CardTitle>
          {userPlan === "premium" && (
            <Badge variant="outline" className="bg-foreground text-background border-foreground text-xs">
              <SlidersHorizontal className="h-3 w-3 mr-1" />
              Advanced
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your journal entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-border"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Filter Options */}
        <div className="flex gap-2 flex-wrap">
          {/* Mood Filter */}
          <Select value={selectedMood || "all"} onValueChange={(val) => setSelectedMood(val === "all" ? "" : val)}>
            <SelectTrigger className="w-[140px] bg-muted border-border">
              <SelectValue placeholder="Mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Moods</SelectItem>
              {moods.map((mood) => (
                <SelectItem key={mood} value={mood} className="capitalize">
                  {mood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Select value={dateRange || "all"} onValueChange={(val) => setDateRange(val === "all" ? "" : val)}>
            <SelectTrigger className="w-[150px] bg-muted border-border">
              <Calendar className="h-3 w-3 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              {dateRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filters (Premium) */}
          {userPlan === "premium" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-1"
            >
              <SlidersHorizontal className="h-3 w-3" />
              Advanced
              {showAdvanced ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              className="flex gap-2 flex-wrap"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                </Badge>
              )}
              {selectedMood && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  Mood: {selectedMood}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedMood("")} />
                </Badge>
              )}
              {dateRange && (
                <Badge variant="secondary" className="gap-1">
                  Date: {dateRanges.find(d => d.value === dateRange)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDateRange("")} />
                </Badge>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <div className="space-y-2">
          {isSearching ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <>
                <p className="text-xs text-muted-foreground">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {searchResults.map((entry) => (
                    <SearchResultItem
                      key={entry.id}
                      entry={entry}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No entries found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                Search for entries by title, content, or tags
              </p>
            </div>
          )}
        </div>

        {/* Premium Upsell */}
        {userPlan === "basic" && (
          <motion.div
            className="p-3 bg-muted rounded-lg border border-border text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Crown className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Upgrade for sentiment search & AI-powered insights
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
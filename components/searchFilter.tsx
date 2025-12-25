import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  Hash,
  Crown,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  userPlan: "basic" | "premium";
}

export const SearchFilters = ({ userPlan }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const moods = ["happy", "calm", "excited", "sad", "angry", "anxious", "grateful"];
  const themes = ["work", "family", "health", "goals", "travel", "relationships", "growth"];

  const handleSearch = () => {
    console.log("Searching with:", { searchQuery, selectedMood, selectedTheme, dateRange });
  };

  const addFilter = (type: string, value: string) => {
    const filter = `${type}:${value}`;
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
    setSelectedMood("");
    setSelectedTheme("");
    setDateRange("");
  };

  const getFilterLabel = (filter: string) => {
    const [type, value] = filter.split(":");
    return `${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`;
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Search className="h-4 w-4 text-background" />
            </div>
            Search & Filter
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
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Search
          </Button>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">Mood</label>
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                      <span className="capitalize">{mood}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters Toggle (Premium) */}
        {userPlan === "premium" && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-between hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
              </span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showAdvanced && (
              <div className="p-4 bg-muted rounded-xl border border-border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">Themes</label>
                    <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            <div className="flex items-center gap-2">
                              <Hash className="h-3 w-3" />
                              <span className="capitalize">{theme}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">Sentiment</label>
                    <Select>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="AI sentiment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">Word Count</label>
                    <Select>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Entry length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (&lt; 100 words)</SelectItem>
                        <SelectItem value="medium">Medium (100-300 words)</SelectItem>
                        <SelectItem value="long">Long (&gt; 300 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">Audio Available</label>
                    <Select>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Has audio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">With Audio</SelectItem>
                        <SelectItem value="no">Text Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Active Filters</h4>
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs">
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="outline" className="gap-1.5 bg-muted">
                  {getFilterLabel(filter)}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-foreground"
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addFilter("mood", "grateful")}
            className="text-xs"
          >
            <Hash className="h-3 w-3 mr-1" />
            Grateful
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addFilter("date", "week")}
            className="text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            This week
          </Button>
          {userPlan === "premium" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addFilter("sentiment", "positive")}
              className="text-xs"
            >
              <Crown className="h-3 w-3 mr-1" />
              Positive
            </Button>
          )}
        </div>

        {/* Upgrade CTA for Basic */}
        {userPlan === "basic" && (
          <div className="p-4 bg-muted rounded-xl border border-border text-center">
            <Crown className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium for advanced filters and AI sentiment analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
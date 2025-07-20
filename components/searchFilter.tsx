import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Calendar, 
  Hash, 
  Crown,
  X,
  SlidersHorizontal
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search & Filter
          {userPlan === "premium" && (
            <Badge className="tier-premium">
              <Crown className="h-3 w-3 mr-1" />
              Advanced
            </Badge>
          )}
        </CardTitle>
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
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
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
            <label className="text-sm font-medium mb-2 block">Mood</label>
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full mood-${mood}`} />
                      <span className="capitalize">{mood}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters (Premium) */}
        {userPlan === "premium" && (
          <>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              <Crown className="h-4 w-4 text-primary" />
            </div>

            {showAdvanced && (
              <div className="p-4 bg-muted rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Themes</label>
                    <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                      <SelectTrigger>
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
                    <label className="text-sm font-medium mb-2 block">Sentiment</label>
                    <Select>
                      <SelectTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Word Count</label>
                    <Select>
                      <SelectTrigger>
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
                    <label className="text-sm font-medium mb-2 block">Audio Available</label>
                    <Select>
                      <SelectTrigger>
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
              <h4 className="text-sm font-medium">Active Filters:</h4>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="gap-1">
                  {getFilterLabel(filter)}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
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
          >
            <Hash className="h-3 w-3 mr-1" />
            Grateful entries
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => addFilter("date", "week")}
          >
            <Calendar className="h-3 w-3 mr-1" />
            This week
          </Button>
          {userPlan === "premium" && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addFilter("sentiment", "positive")}
            >
              <Crown className="h-3 w-3 mr-1" />
              Positive vibes
            </Button>
          )}
        </div>

        {userPlan === "basic" && (
          <div className="p-3 bg-secondary/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <Crown className="h-3 w-3 inline mr-1" />
              Upgrade to Premium for advanced filters including themes, AI sentiment analysis, and custom search operators.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
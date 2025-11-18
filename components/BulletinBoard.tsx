'use client';
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";
import { ShareDialog } from "./ShareDialog";
import { availableActivities } from "@/data/mockData";
import { AvailableActivity, SDG_GOALS } from "@/types";
import {
  Search,
  BookOpen,
  Users,
  Calendar,
  MapPin,
  Award,
  User2,
  Clock,
  CheckCircle2,
  ChevronDown,
  Filter,
  Heart,
  Info,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { LoginDialog } from "./LoginDialog";
import { SignupDialog, UserSignupData } from "./SignupDialog";

const FAVORITES_STORAGE_KEY = 'sdg-favorite-events';

export function BulletinBoard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "coursework" | "society" | "event"
  >("all");
  const [selectedActivity, setSelectedActivity] =
    useState<AvailableActivity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [registeredActivities, setRegisteredActivities] =
    useState<Set<string>>(new Set());
  const [selectedSDGs, setSelectedSDGs] = useState<Set<number>>(
    new Set()
  );
  const [favoriteActivityIds, setFavoriteActivityIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    }
    return new Set();
  });
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | undefined>(undefined);
  const [showSignupDialog, setShowSignupDialog] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteActivityIds)));
    }
  }, [favoriteActivityIds]);

  const toggleFavorite = (activityId: string) => {
    setFavoriteActivityIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
        toast.success('Removed from favorites');
      } else {
        newSet.add(activityId);
        toast.success('Added to favorites');
      }
      return newSet;
    });
  };

  const isFavorite = (activityId: string) => favoriteActivityIds.has(activityId);

  const filteredActivities = availableActivities.filter(
    (activity) => {
      const matchesCategory =
        categoryFilter === "all" ||
        activity.category === categoryFilter;

      // SDG filter logic
      const matchesSDG =
        selectedSDGs.size === 0 ||
        activity.sdgGoals.some((goalNum) =>
          selectedSDGs.has(goalNum)
        );

      // Enhanced search logic
      const query = searchQuery.toLowerCase().trim();

      // Check if query is a number (SDG goal number)
      const isNumericQuery = /^\d+$/.test(query);

      let matchesSearch = false;

      if (isNumericQuery) {
        // Search by SDG number
        const sdgNumber = parseInt(query);
        matchesSearch = activity.sdgGoals.includes(sdgNumber);

        // Also check if the SDG goal name is in title/description
        const sdgGoal = SDG_GOALS.find(
          (g) => g.number === sdgNumber,
        );
        if (sdgGoal) {
          matchesSearch =
            matchesSearch ||
            activity.title
              .toLowerCase()
              .includes(sdgGoal.name.toLowerCase()) ||
            activity.description
              .toLowerCase()
              .includes(sdgGoal.name.toLowerCase());
        }
      } else {
        // Regular text search
        matchesSearch =
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.organizer.toLowerCase().includes(query);

        // Also search by SDG goal names
        const matchingGoals = SDG_GOALS.filter((goal) =>
          goal.name.toLowerCase().includes(query),
        );

        if (matchingGoals.length > 0) {
          matchesSearch =
            matchesSearch ||
            activity.sdgGoals.some((goalNum) =>
              matchingGoals.some((g) => g.number === goalNum),
            );
        }
      }

      return matchesCategory && matchesSDG && matchesSearch;
    },
  );

  // Check if user is signed in (respects demo mode toggle)
  const DEMO_MODE_STORAGE_KEY = 'sdg-demo-mode-signed-in';
  const demoSignedIn = typeof window !== 'undefined'
    ? (localStorage.getItem(DEMO_MODE_STORAGE_KEY) ?? 'true') === 'true' // Default to signed in
    : true;
  const isGuest = !demoSignedIn; // Demo toggle controls guest state

  const handleRegister = (activity: AvailableActivity) => {
    if (isGuest) {
      setLoginMessage('Please sign in to register for events');
      setShowLoginDialog(true);
      return;
    }
    setSelectedActivity(activity);
    setIsDialogOpen(true);
  };

  const handleLogin = () => {
    // In a real app, this would handle actual login
    // For now, we'll just show a message
    toast.info('Please complete signup to register for events');
  };

  const handleSignup = (data: UserSignupData) => {
    // In a real app, this would create the user account
    // For demo purposes, we'll store it and show a toast
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'sdg-platform-signup',
        JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
      );
    }
    toast.success('Account created successfully!');
    setShowSignupDialog(false);
    // Reload to update the app state
    window.location.reload();
  };

  const confirmRegistration = () => {
    if (selectedActivity) {
      setRegisteredActivities((prev) =>
        new Set(prev).add(selectedActivity.id),
      );
      const pointsToEarn = selectedActivity.pointsBreakdown?.total ?? selectedActivity.points;
      toast.success(
        `Successfully registered for ${selectedActivity.title}!`,
        {
          description: `You will earn ${pointsToEarn} SDG points upon completion.`,
        },
      );
      setIsDialogOpen(false);
      setSelectedActivity(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "coursework":
        return <BookOpen className="h-4 w-4" />;
      case "society":
        return <Users className="h-4 w-4" />;
      case "event":
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "coursework":
        return "bg-blue-500";
      case "society":
        return "bg-purple-500";
      case "event":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAvailabilityStatus = (
    activity: AvailableActivity,
  ) => {
    if (!activity.capacity)
      return { text: "Open", color: "text-green-700 dark:text-green-500" };
    const spotsLeft =
      activity.capacity - (activity.enrolled || 0);
    if (spotsLeft <= 0)
      return { text: "Full", color: "text-red-600" };
    if (spotsLeft <= 5)
      return {
        text: `${spotsLeft} spots left`,
        color: "text-orange-700 dark:text-orange-500",
      };
    return { text: "Available", color: "text-green-700 dark:text-green-500" };
  };

  const toggleSDG = (sdgNumber: number) => {
    setSelectedSDGs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sdgNumber)) {
        newSet.delete(sdgNumber);
      } else {
        newSet.add(sdgNumber);
      }
      return newSet;
    });
  };

  const clearAllSDGs = () => {
    setSelectedSDGs(new Set());
  };

  const selectAllSDGs = () => {
    setSelectedSDGs(new Set(SDG_GOALS.map((g) => g.number)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            SDG Activities
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Discover and register for sustainable development activities 🎯
          </p>
        </div>
      </div>

      {/* Search and Filters Card */}
      <Card className="p-4 md:p-6 shadow-md">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, SDG number, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Activity Type Filter */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                variant={categoryFilter === "all" ? "default" : "outline"}
                onClick={() => setCategoryFilter("all")}
                className="gap-2"
                size="sm"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">All</span>
              </Button>
              <Button
                variant={categoryFilter === "coursework" ? "default" : "outline"}
                onClick={() => setCategoryFilter("coursework")}
                className="gap-2"
                size="sm"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Coursework</span>
              </Button>
              <Button
                variant={categoryFilter === "society" ? "default" : "outline"}
                onClick={() => setCategoryFilter("society")}
                className="gap-2"
                size="sm"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Society</span>
              </Button>
              <Button
                variant={categoryFilter === "event" ? "default" : "outline"}
                onClick={() => setCategoryFilter("event")}
                className="gap-2"
                size="sm"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Event</span>
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 shrink-0">
                  <Filter className="h-4 w-4" />
                  SDG Filters
                  {selectedSDGs.size > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedSDGs.size}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-[500px] overflow-y-auto" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Filter by SDG Goals</span>
                  {selectedSDGs.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllSDGs}
                      className="h-auto p-1 text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    if (selectedSDGs.size === SDG_GOALS.length) {
                      clearAllSDGs();
                    } else {
                      selectAllSDGs();
                    }
                  }}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <div className="inline-flex h-5 w-5 items-center justify-center rounded border-2 text-xs">
                      {selectedSDGs.size === SDG_GOALS.length && "✓"}
                    </div>
                    {selectedSDGs.size === SDG_GOALS.length
                      ? "Deselect All"
                      : "Select All"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {SDG_GOALS.map((sdg) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={sdg.number}
                      checked={selectedSDGs.has(sdg.number)}
                      onCheckedChange={() => toggleSDG(sdg.number)}
                      onSelect={(e) => e.preventDefault()}
                      className="capitalize cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded text-xs font-medium shrink-0 shadow-md ${sdg.textColor === 'black' ? 'text-black' : 'text-white'
                            }`}
                          style={{
                            backgroundColor: sdg.color,
                            textShadow: sdg.textColor === 'white' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(255,255,255,0.5)'
                          }}
                        >
                          {sdg.number}
                        </span>
                        <span className="text-sm">{sdg.name}</span>
                      </span>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Results and Active Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="font-semibold">
                {filteredActivities.length} {filteredActivities.length === 1 ? "activity" : "activities"}
              </Badge>
              {categoryFilter !== "all" && (
                <Badge variant="outline" className="font-semibold capitalize">
                  {getCategoryIcon(categoryFilter)}
                  <span className="ml-1">{categoryFilter}</span>
                </Badge>
              )}
              {selectedSDGs.size > 0 && (
                <span className="text-sm text-muted-foreground">
                  with {selectedSDGs.size} SDG {selectedSDGs.size === 1 ? "filter" : "filters"}
                </span>
              )}
            </div>

            {/* Active Filter Pills */}
            {selectedSDGs.size > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from(selectedSDGs).sort((a, b) => a - b).slice(0, 3).map((sdgNum) => {
                  const goal = SDG_GOALS.find((g) => g.number === sdgNum);
                  return (
                    <Badge
                      key={sdgNum}
                      variant="outline"
                      className="gap-1 pl-1"
                      style={{ borderColor: goal?.color }}
                    >
                      <span
                        className="inline-flex h-4 w-4 items-center justify-center rounded text-xs text-white font-bold"
                        style={{ backgroundColor: goal?.color }}
                      >
                        {sdgNum}
                      </span>
                      <button
                        onClick={() => toggleSDG(sdgNum)}
                        className="ml-1 hover:bg-accent rounded-full p-0.5"
                        aria-label={`Toggle filter for SDG ${sdgNum}`}
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
                {selectedSDGs.size > 3 && (
                  <Badge variant="outline">+{selectedSDGs.size - 3} more</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllSDGs}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Activities by Category Sections */}
      <div className="space-y-8">
        {(categoryFilter === "all"
          ? (['coursework', 'society', 'event'] as const)
          : [categoryFilter] as const
        ).map((category) => {
          const categoryActivities = filteredActivities.filter(
            (activity) => activity.category === category
          );

          if (categoryActivities.length === 0) {
            return null;
          }

          return (
            <div key={category} className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-2">
                <div className={`p-2.5 rounded-xl ${getCategoryColor(category)} text-white shadow-md`}>
                  {getCategoryIcon(category)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold capitalize">{category}</h2>
                  <p className="text-sm text-muted-foreground">
                    {categoryActivities.length} available {categoryActivities.length === 1 ? 'activity' : 'activities'}
                  </p>
                </div>
              </div>

              {/* Activities Grid for this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryActivities.map((activity) => {
                  const availability = getAvailabilityStatus(activity);
                  const isRegistered = registeredActivities.has(
                    activity.id,
                  );
                  const isFull =
                    activity.capacity &&
                    activity.enrolled &&
                    activity.enrolled >= activity.capacity;

                  return (
                    <Card
                      key={activity.id}
                      className="group overflow-hidden transition-all shadow-md"
                      style={{ borderLeftColor: getCategoryColor(activity.category).replace('bg-', '#').replace('yellow-500', '#eab308').replace('blue-500', '#3b82f6').replace('purple-500', '#a855f7') }}
                    >
                      {/* Image */}
                      {activity.imageUrl && (
                        <div className="relative h-40 overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={activity.imageUrl}
                            alt={activity.title}
                            className="w-full h-full object-cover  transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(activity.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors shadow-md z-10"
                            aria-label={isFavorite(activity.id) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Heart
                              className={`h-4 w-4 ${isFavorite(activity.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-muted-foreground'
                                }`}
                            />
                          </button>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        {/* Title and Description */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base line-clamp-2 mb-1">
                              {activity.title}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-start gap-2">
                            <Badge className="bg-[#FFE600] hover:bg-[#ffd700] text-[#231F20] shadow-lg">
                              <Award className="w-3 h-3 mr-1" aria-hidden="true" />
                              {activity.pointsBreakdown?.total ?? activity.points} pts
                            </Badge>
                            {activity.pointsBreakdown && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors shadow-md"
                                      aria-label={`View points breakdown for ${activity.title}`}
                                    >
                                      <Info className="h-3.5 w-3.5 text-[#231F20]" aria-hidden="true" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className="max-w-xs bg-white shadow-lg text-black"
                                    arrowStyle={{ backgroundColor: "#FFFFFF", fill: "#FFFFFF" }}>
                                    <div className="space-y-2 text-xs">
                                      <p className="font-semibold">Points Breakdown:</p>
                                      <div className="space-y-1">
                                        <div className="flex justify-between">
                                          <span>Time ({Math.round((activity.pointsBreakdown.timeCommitment / 15) * 10) / 10}h):</span>
                                          <span className="font-semibold">{activity.pointsBreakdown.timeCommitment} pts</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Difficulty (Level {activity.pointsBreakdown.difficulty / 5}):</span>
                                          <span className="font-semibold">{activity.pointsBreakdown.difficulty} pts</span>
                                        </div>
                                        <div className="border-t pt-1 flex justify-between font-bold">
                                          <span>Total:</span>
                                          <span>{activity.pointsBreakdown.total} pts</span>
                                        </div>
                                      </div>
                                      {activity.pointsBreakdown.explanation && (
                                        <p className="text-muted-foreground italic pt-1 border-t">
                                          {activity.pointsBreakdown.explanation}
                                        </p>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                          </div>
                        </div>

                        {/* SDG Goals - Compact */}
                        <div className="flex flex-wrap gap-1.5">
                          {[...activity.sdgGoals].sort((a, b) => a - b).map((goalNum) => {
                            const goal = SDG_GOALS.find((g) => g.number === goalNum);
                            return (
                              <TooltipProvider key={goalNum}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`h-8 w-8 rounded flex items-center justify-center text-sm font-bold shrink-0 shadow-md hover:scale-110 transition-transform cursor-help ${goal?.textColor === 'black' ? 'text-black' : 'text-white'
                                        }`}
                                      style={{
                                        backgroundColor: goal?.color,
                                        textShadow: goal?.textColor === 'white' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(255,255,255,0.5)'
                                      }}
                                    >
                                      {goalNum}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    className="border-0"
                                    style={{ backgroundColor: goal?.color }}
                                    arrowStyle={{ backgroundColor: goal?.color, fill: goal?.color }}
                                  >
                                    <p className={`text-xs font-medium ${goal?.textColor === 'black' ? 'text-black' : 'text-white'}`}>SDG {goalNum}: {goal?.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
                        </div>

                        {/* Info - Compact */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <User2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{activity.organizer}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{activity.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {new Date(activity.startDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Capacity Bar - Compact */}
                        {activity.capacity && (
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">
                                {activity.enrolled || 0}/{activity.capacity}
                              </span>
                              <span className={`font-medium ${availability.color}`}>
                                {availability.text}
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${isFull
                                  ? "bg-red-500"
                                  : (activity.enrolled || 0) / activity.capacity > 0.8
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                                  }`}
                                style={{
                                  width: `${Math.min(((activity.enrolled || 0) / activity.capacity) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1">
                          {isRegistered ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8"
                              disabled
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                              Registered
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleRegister(activity)}
                              size="sm"
                              className="flex-1 h-8 bg-linear-to-r from-[#FFE600] to-[#ffd700] hover:from-[#ffd700] hover:to-[#FFE600] text-[#231F20] font-semibold"
                              disabled={Boolean(isFull)}
                            >
                              {isFull ? "Full" : "Register"}
                            </Button>
                          )}
                          <ShareDialog
                            title={activity.title}
                            description={`${activity.category} activity - ${activity.pointsBreakdown?.total ?? activity.points} SDG points`}
                            url={`https://sdggo.edu/activities/${activity.id}`}
                            iconOnly
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirm Registration</DialogTitle>
            <DialogDescription>
              Review the activity details and confirm your registration
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-4 py-2">
              {/* Image */}
              {selectedActivity.imageUrl && (
                <div className="relative h-48 rounded-xl overflow-hidden border">
                  <ImageWithFallback
                    src={selectedActivity.imageUrl}
                    alt={selectedActivity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <Badge className={`${getCategoryColor(selectedActivity.category)} text-white border-0 capitalize`}>
                      {getCategoryIcon(selectedActivity.category)}
                      <span className="ml-1.5">{selectedActivity.category}</span>
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-0">
                        <Award className="w-3 h-3 mr-1" aria-hidden="true" />
                        {selectedActivity.pointsBreakdown?.total ?? selectedActivity.points} points
                      </Badge>
                      {selectedActivity.pointsBreakdown && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="p-1 bg-amber-600/20 backdrop-blur-sm rounded-full hover:bg-amber-600/30 transition-colors"
                                aria-label={`View points breakdown for ${selectedActivity.title}`}
                              >
                                <Info className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">View points breakdown below</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Title and Description */}
              <div>
                <h3 className="text-xl font-bold mb-2">{selectedActivity.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Points Breakdown */}
              {selectedActivity.pointsBreakdown && (
                <Card className="p-4 bg-amber-50/50 border-amber-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-amber-600" />
                      <p className="text-sm font-semibold">How Points Are Calculated</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Time Commitment ({selectedActivity.pointsBreakdown.timeCommitment / 15} hours)
                        </span>
                        <Badge variant="secondary">{selectedActivity.pointsBreakdown.timeCommitment} pts</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Difficulty (Level {selectedActivity.pointsBreakdown.difficulty / 5})
                        </span>
                        <Badge variant="secondary">{selectedActivity.pointsBreakdown.difficulty} pts</Badge>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between items-center font-semibold">
                        <span>Total Points</span>
                        <Badge className="bg-amber-600 text-white">{selectedActivity.pointsBreakdown.total} pts</Badge>
                      </div>
                      {selectedActivity.pointsBreakdown.explanation && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground italic">
                            {selectedActivity.pointsBreakdown.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* SDG Goals */}
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Related SDG Goals
                </p>
                <div className="flex flex-wrap gap-2">
                  {[...selectedActivity.sdgGoals].sort((a, b) => a - b).map((goalNum) => {
                    const goal = SDG_GOALS.find((g) => g.number === goalNum);
                    return (
                      <div
                        key={goalNum}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-background/50 hover:bg-background transition-colors"
                      >
                        <div
                          className={`h-5 w-5 rounded flex items-center justify-center text-xs font-bold shadow-md ${goal?.textColor === 'black' ? 'text-black' : 'text-white'
                            }`}
                          style={{
                            backgroundColor: goal?.color,
                            textShadow: goal?.textColor === 'white' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(255,255,255,0.5)'
                          }}
                        >
                          {goalNum}
                        </div>
                        <span className="text-sm font-medium">{goal?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Start Date
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(selectedActivity.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </Card>
                {selectedActivity.endDate && (
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      End Date
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(selectedActivity.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </Card>
                )}
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Location
                  </p>
                  <p className="text-sm font-medium">{selectedActivity.location}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                    <User2 className="h-3.5 w-3.5" />
                    Organizer
                  </p>
                  <p className="text-sm font-medium">{selectedActivity.organizer}</p>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmRegistration}
              className="bg-[#FFE600] hover:bg-[#ffd700] text-[#231F20] font-semibold"
            >
              Confirm Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
        onSignUp={() => {
          setShowLoginDialog(false);
          setShowSignupDialog(true);
        }}
        message={loginMessage}
      />

      <SignupDialog
        open={showSignupDialog}
        onOpenChange={setShowSignupDialog}
        onSignup={handleSignup}
        onSkip={() => {
          setShowSignupDialog(false);
        }}
      />
    </div>
  );
}
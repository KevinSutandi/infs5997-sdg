"use client";
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { MyVouchersDialog } from "./MyVouchersDialog";
import { rewardsCatalog, currentUser } from '@/data/mockData';
import { Reward } from '@/types';
import {
  Gift,
  Tag,
  Package,
  Calendar,
  AlertCircle,
  Sparkles,
  Ticket,
  Trophy,
  Search,
  X,
  ArrowDown,
  Minus,
} from "lucide-react";
import { toast } from "sonner";

export function RedeemStore() {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedReward, setSelectedReward] =
    useState<Reward | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState(false);
  const [isVouchersDialogOpen, setIsVouchersDialogOpen] =
    useState(false);

  const categories = [
    { id: "all", label: "All Rewards", icon: Gift },
    { id: "discount", label: "Discount", icon: Tag },
    { id: "food", label: "Food & Beverage", icon: Package },
    { id: "merchandise", label: "Merchandise", icon: Sparkles },
    { id: "experience", label: "Experiences", icon: Calendar },
  ];

  const filteredRewards = rewardsCatalog.filter((reward) => {
    // Category filter
    const matchesCategory =
      selectedCategory === "all" || reward.category === selectedCategory;

    // Search filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      reward.title.toLowerCase().includes(query) ||
      reward.description.toLowerCase().includes(query) ||
      reward.merchantName.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;

    if (
      currentUser.totalPoints < selectedReward.pointsRequired
    ) {
      toast.error("Insufficient Points", {
        description: `You need ${selectedReward.pointsRequired - currentUser.totalPoints} more points to redeem this reward.`,
      });
      setIsConfirmDialogOpen(false);
      return;
    }

    // Simulate redemption
    toast.success("Reward Redeemed!", {
      description: `${selectedReward.title} has been added to your vouchers.`,
    });
    setIsConfirmDialogOpen(false);
    setSelectedReward(null);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "discount":
        return "bg-blue-600 text-white border-2 border-blue-700 shadow-lg";
      case "food":
        return "bg-orange-600 text-white border-2 border-orange-700 shadow-lg";
      case "merchandise":
        return "bg-purple-600 text-white border-2 border-purple-700 shadow-lg";
      case "experience":
        return "bg-green-600 text-white border-2 border-green-700 shadow-lg";
      default:
        return "bg-gray-600 text-white border-2 border-gray-700 shadow-lg";
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const remainingPoints = selectedReward
    ? currentUser.totalPoints - selectedReward.pointsRequired
    : currentUser.totalPoints;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            Redeem Store
          </h1>
          <p className="text-muted-foreground mt-1">
            Exchange your SDG points for exclusive rewards 🎁
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsVouchersDialogOpen(true)}
            className="flex items-center gap-2 hover:bg-accent transition-colors"
          >
            <Ticket className="h-4 w-4" />
            My Vouchers
          </Button>
          <Card className="p-4 hover:shadow-lg transition-all bg-linear-to-br from-amber-500/10 via-amber-500/5 to-background border-amber-500/20 border-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Available Points
                </p>
                <p className="text-3xl font-black bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                  {currentUser.totalPoints.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Search and Category Filters */}
      <Card className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search rewards by name, description, or merchant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 transition-all ${isActive
                  ? "bg-linear-to-r from-amber-600 to-yellow-500 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-accent"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
            <span>Showing {filteredRewards.length} reward{filteredRewards.length !== 1 ? 's' : ''}</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-foreground"
                  aria-label="Clear search"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Category: {categories.find(c => c.id === selectedCategory)?.label}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="ml-1 hover:text-foreground"
                  aria-label="Clear category filter"
                >
                  <X className="h-4 w-4" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </Card>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const canAfford =
            currentUser.totalPoints >= reward.pointsRequired;
          const isLowStock = reward.stock <= 5;

          return (
            <Card
              key={reward.id}
              className="overflow-hidden transition-all group  border-l-amber-500"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-muted">
                <img
                  src={reward.imageUrl}
                  alt={reward.title}
                  className="w-full h-full object-cover transition-transform duration-500 aspect-video"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0" />
                {isLowStock && (
                  <Badge
                    variant="destructive"
                    className="absolute top-3 right-3 shadow-lg font-semibold"
                  >
                    Only {reward.stock} left
                  </Badge>
                )}
                <Badge
                  className={`absolute top-3 left-3 ${getCategoryBadgeColor(reward.category)} capitalize px-3 py-1.5 text-sm font-semibold shadow-lg`}
                >
                  {reward.category === "food"
                    ? "Food & Beverage"
                    : reward.category}
                </Badge>
                {/* Points Badge Overlay */}
                <div className="absolute bottom-3 right-3">
                  <Badge className="flex items-center gap-1.5 bg-background/95 backdrop-blur-sm border-2 border-amber-500 shadow-lg px-3 py-1.5">
                    <Trophy className="h-3.5 w-3.5 text-amber-600" />
                    <span className="font-bold text-amber-600">{reward.pointsRequired} pts</span>
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{reward.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {reward.description}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-md bg-muted/50">
                    <span className="text-muted-foreground font-medium">
                      Merchant
                    </span>
                    <span className="font-semibold">{reward.merchantName}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-md bg-muted/50">
                    <span className="text-muted-foreground font-medium">
                      Stock
                    </span>
                    <span
                      className={`font-semibold ${isLowStock ? "text-destructive" : "text-green-600"
                        }`}
                    >
                      {reward.stock} available
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-md bg-muted/50">
                    <span className="text-muted-foreground font-medium">
                      Valid Until
                    </span>
                    <span className="font-semibold">
                      {formatExpiryDate(reward.expiryDate)}
                    </span>
                  </div>
                </div>

                {/* Redeem Button */}
                <Button
                  className={`w-full font-semibold transition-all cursor-pointer ${canAfford && reward.stock > 0
                    ? "bg-linear-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white shadow-md hover:shadow-lg"
                    : ""
                    }`}
                  disabled={!canAfford || reward.stock === 0}
                  onClick={() => handleRedeemClick(reward)}
                >
                  {reward.stock === 0
                    ? "Out of Stock"
                    : !canAfford
                      ? `Need ${reward.pointsRequired - currentUser.totalPoints} more points`
                      : "Redeem Now"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredRewards.length === 0 && (
        <Card className="p-16 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Gift className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Rewards Found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search or filters to see more rewards"
              : "No rewards available at the moment"}
          </p>
          {(searchQuery || selectedCategory !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          )}
        </Card>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-2">
              <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Gift className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
              Confirm Redemption
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Please review the details before confirming your redemption
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedReward && (
            <div className="space-y-2 py-4">
              {/* Reward Image Preview */}
              <div className="relative h-32 overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedReward.imageUrl}
                  alt={selectedReward.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-white font-bold text-lg">{selectedReward.title}</h4>
                </div>
              </div>

              {/* Reward Details */}
              <Card className="p-4">
                <div className="flex items-center justify-between px-3 rounded-md">
                  <span className="text-sm text-muted-foreground font-medium">
                    Points Required
                  </span>
                  <span className="text-lg font-bold bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                    {selectedReward.pointsRequired.toLocaleString()}
                  </span>
                </div>

                {/* Points Calculation Flow */}
                <div className="space-y-1 py-1 px-3 rounded-md bg-muted/20">
                  {/* Current Points */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">
                      Your Current Points
                    </span>
                    <span className="text-lg font-bold">{currentUser.totalPoints.toLocaleString()}</span>
                  </div>

                  {/* Arrow with subtraction */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex-1 h-px bg-border"></div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 border border-amber-200">
                      <Minus className="h-3 w-3 text-amber-700" />
                      <span className="text-xs font-semibold text-amber-700">
                        {selectedReward.pointsRequired.toLocaleString()}
                      </span>
                    </div>
                    <ArrowDown className="h-4 w-4 text-amber-600" />
                    <div className="flex-1 h-px bg-border"></div>
                  </div>

                  {/* Remaining Points */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-muted-foreground font-medium">
                      Remaining Points
                    </span>
                    <span
                      className={`text-lg font-bold ${remainingPoints < 0
                        ? "text-destructive"
                        : "text-green-600"
                        }`}
                    >
                      {remainingPoints.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground font-medium">
                    Valid Until
                  </span>
                  <span className="text-sm font-semibold">
                    {formatExpiryDate(selectedReward.expiryDate)}
                  </span>
                </div>
              </Card>

              {/* Warning Notice */}
              <div className="flex gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-amber-900">
                    Important Notice
                  </p>
                  <p className="text-sm text-amber-800">
                    Redemptions are non-refundable. Points cannot be returned once the reward is redeemed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRedeem}
              className="w-full sm:w-auto bg-linear-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-semibold shadow-md hover:shadow-lg"
            >
              Confirm & Redeem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* My Vouchers Dialog */}
      <MyVouchersDialog
        open={isVouchersDialogOpen}
        onOpenChange={setIsVouchersDialogOpen}
      />
    </div>
  );
}
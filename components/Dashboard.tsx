"use client";
import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./ui/avatar";
import { FriendsList } from "./FriendsList";
import { PointsDetailsDialog } from "./PointsDetailsDialog";
import { currentUser, allStudents } from "@/data/mockData";
import { SDG_GOALS } from "@/types";
import {
  Trophy,
  BookOpen,
  Users as UsersIcon,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { ShareDialog } from "./ShareDialog";
import { Award, Share2 } from "lucide-react";

export function Dashboard() {
  const badges = currentUser.badges || [];

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate badge progress based on requirement
  const calculateBadgeProgress = (badge: typeof badges[0]) => {
    const requirement = badge.requirement.toLowerCase();

    // Mock progress data - in real app, this would calculate from user's actual data
    if (requirement.includes('all 17 sdgs') || requirement.includes('17 sdg')) {
      // User has participated in 5 out of 17 SDGs
      return { current: 5, target: 17, percentage: Math.round((5 / 17) * 100) };
    }

    // Event enthusiast badge make the requirement to be 10 events
    if (requirement.includes('events')) {
      return { current: 5, target: 10, percentage: 50 };
    }

    // Academic excellence badge make the requirement to be 5 courses
    if (requirement.includes('courses')) {
      return { current: 3, target: 5, percentage: 60 };
    }

    if (requirement.includes('climate')) {
      // User has completed 3 out of 5 climate activities
      const match = requirement.match(/(\d+)/);
      const target = match ? parseInt(match[1]) : 5;
      return { current: 3, target, percentage: Math.round((3 / target) * 100) };
    }

    if (requirement.includes('points')) {
      // User has 1500 out of 2000 points
      const match = requirement.match(/(\d+)/);
      const target = match ? parseInt(match[1]) : 2000;
      return { current: 1500, target, percentage: Math.round((1500 / target) * 100) };
    }

    if (requirement.includes('societ')) {
      // User has joined 2 out of 3 societies
      const match = requirement.match(/(\d+)/);
      const target = match ? parseInt(match[1]) : 3;
      return { current: 2, target, percentage: Math.round((2 / target) * 100) };
    }

    if (requirement.includes('top') || requirement.includes('rank')) {
      // User is rank 15, needs top 10
      return { current: 15, target: 10, percentage: 0 }; // Can't show progress for ranking
    }

    // Default: show some progress
    return { current: 1, target: 2, percentage: 50 };
  };

  const [followedUserIds, setFollowedUserIds] = useState<
    string[]
  >(currentUser.followedUsers || []);
  const followerIds = currentUser.followers || [];
  const [pointsDialogOpen, setPointsDialogOpen] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "coursework" | "society" | "event"
  >("coursework");

  const handleUnfollow = (userId: string) => {
    setFollowedUserIds(
      followedUserIds.filter((id) => id !== userId),
    );
  };

  const handleOpenPointsDetails = (
    category: "coursework" | "society" | "event",
  ) => {
    setSelectedCategory(category);
    setPointsDialogOpen(true);
  };
  const courseworkPoints = currentUser.activities
    .filter((a) => a.category === "coursework")
    .reduce((sum, a) => sum + a.points, 0);

  const societyPoints = currentUser.activities
    .filter((a) => a.category === "society")
    .reduce((sum, a) => sum + a.points, 0);

  const eventPoints = currentUser.activities
    .filter((a) => a.category === "event")
    .reduce((sum, a) => sum + a.points, 0);

  const sdgParticipation = currentUser.activities
    .flatMap((a) => a.sdgGoals)
    .reduce(
      (acc, goal) => {
        acc[goal] = (acc[goal] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

  // Get followed users
  const followedUsers = allStudents
    .filter((s) => followedUserIds.includes(s.id))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Welcome back, {currentUser.name.split(" ")[0]}! 👋
          </p>
        </div>
        <Card className="p-3 md:p-4 hover:shadow-lg transition-all bg-linear-to-br from-amber-500/10 via-amber-500/5 to-background border-amber-500/20 border-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">
            Total Points
          </p>
              <p className="text-2xl md:text-3xl font-black bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                {currentUser.totalPoints.toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="p-4 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all group border-l-4 border-l-blue-500"
          onClick={() => handleOpenPointsDetails("coursework")}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-linear-to-br from-blue-500/20 to-blue-500/10 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Coursework
              </p>
              <p className="text-2xl font-black text-amber-600">{courseworkPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">points</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all group border-l-4 border-l-purple-500"
          onClick={() => handleOpenPointsDetails("society")}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-linear-to-br from-purple-500/20 to-purple-500/10 group-hover:from-purple-500/30 group-hover:to-purple-500/20 transition-all">
              <UsersIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Society
              </p>
              <p className="text-2xl font-black text-amber-600">{societyPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">points</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all group border-l-4 border-l-green-500"
          onClick={() => handleOpenPointsDetails("event")}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-linear-to-br from-green-500/20 to-green-500/10 group-hover:from-green-500/30 group-hover:to-green-500/20 transition-all">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Events
              </p>
              <p className="text-2xl font-black text-amber-600">{eventPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">points</p>
            </div>
          </div>
        </Card>
      </div>
      {/* Badges Section */}
      <Card className="p-4 md:p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Award className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Badges</h2>
              <p className="text-xs text-muted-foreground">Your achievements and progress</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm px-2.5 py-0.5">
            {earnedBadges.length} / {badges.length}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {/* Earned Badges */}
          {earnedBadges.map((badge) => (
            <Card
              key={badge.id}
              className="p-4 text-center hover:shadow-lg hover:scale-[1.01] transition-all group border-2 border-transparent hover:border-primary/20"
            >
              <div
                className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-md"
                style={{ backgroundColor: badge.color + "30" }}
              >
                {badge.icon}
              </div>
              <h4 className="mb-1.5 font-bold text-sm">{badge.name}</h4>
              <p className="text-xs text-muted-foreground mb-2.5 line-clamp-2 min-h-[32px]">
                {badge.description}
              </p>
              {badge.earnedDate && (
                <Badge variant="secondary" className="mb-2.5 text-xs">
                  🎉 {formatDate(badge.earnedDate)}
                </Badge>
              )}
              <ShareDialog
                title={`${badge.name} Badge`}
                description={badge.description}
                url={`https://sdggo.edu/badges/${badge.id}`}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                }
              />
            </Card>
          ))}

          {/* Locked Badges */}
          {lockedBadges.map((badge) => {
            const progress = calculateBadgeProgress(badge);
            const showProgress = progress.percentage > 0 && progress.percentage < 100;

            return (
            <Card
              key={badge.id}
                className="p-4 text-center opacity-60 grayscale hover:opacity-80 hover:grayscale-0 transition-all border-2 border-muted"
            >
                <div className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-3xl bg-muted/50">
                {badge.icon}
              </div>
                <h4 className="mb-1.5 font-semibold text-sm">{badge.name}</h4>
                <p className="text-xs text-muted-foreground mb-2.5 line-clamp-2 min-h-[32px]">
                {badge.description}
              </p>

                {showProgress && (
                  <div className="mb-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="font-bold text-amber-600">{progress.percentage}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-amber-500/10">
                      <div
                        className="h-full bg-linear-to-r from-amber-500 to-yellow-500 transition-all rounded-full"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {progress.current} / {progress.target}
                    </p>
                  </div>
                )}

                <Badge variant="outline" className="text-xs w-full justify-center">
                {badge.requirement}
              </Badge>
            </Card>
            );
          })}
        </div>
      </Card>

      {/* My Friends Section */}
      <Card className="p-4 md:p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <UsersIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold">My Friends</h2>
              <p className="text-xs text-muted-foreground">Connect with peers and see their progress</p>
            </div>
          </div>
          <FriendsList
            followedUserIds={followedUserIds}
            followerIds={followerIds}
            onUnfollow={handleUnfollow}
          />
        </div>

        {followedUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {followedUsers.map((user) => (
              <Card
                key={user.id}
                className="p-4 hover:shadow-lg hover:scale-[1.01] transition-all group border-2 border-transparent hover:border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-background group-hover:ring-primary/30 transition-all">
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                    />
                    <AvatarFallback className="font-semibold text-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate font-bold text-sm group-hover:text-primary transition-colors">{user.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.faculty}
                    </p>
                    <Badge variant="secondary" className="mt-1.5 text-xs font-semibold">
                      <Trophy className="h-3 w-3 mr-1 text-amber-600" />
                      {user.totalPoints.toLocaleString()} pts
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="bg-muted/30 rounded-full h-16 w-16 mx-auto mb-3 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm mb-1.5">No friends followed yet</h3>
            <p className="text-xs text-muted-foreground">
              Go to Rankings to find and follow peers
            </p>
          </div>
        )}
      </Card>

      {/* Recent Activities */}
      <Card className="p-4 md:p-5 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Recent Activities</h2>
            <p className="text-xs text-muted-foreground">Your latest SDG contributions</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {currentUser.activities
            .slice(0, 5)
            .map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all group border border-transparent hover:border-primary/20"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm group-hover:text-primary transition-colors mb-1">{activity.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="capitalize font-medium text-xs"
                    >
                      {activity.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                      {new Date(
                        activity.date,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Badge variant="secondary" className="flex items-center gap-1 px-2.5 py-1 font-semibold text-xs">
                    <Award className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-amber-600">
                      +{activity.points.toLocaleString()}
                    </span>
                  </Badge>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* SDG Goals Progress */}
      <Card className="p-4 md:p-5 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Award className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Your SDG Impact</h2>
            <p className="text-xs text-muted-foreground">Track your contribution across all goals</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SDG_GOALS.map((goal) => {
            const count = sdgParticipation[goal.number] || 0;
            if (count === 0) return null;

            return (
              <div
                key={goal.number}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 transition-all border border-transparent hover:border-primary/20 group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-base shadow-md group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: goal.color }}
                >
                  {goal.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-1.5 truncate">
                    {goal.name}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1">
                    <Progress
                      value={Math.min(count * 20, 100)}
                      className="h-2"
                    />
                    </div>
                    <Badge variant="secondary" className="text-xs font-semibold whitespace-nowrap">
                      {count} {count === 1 ? "activity" : "activities"}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {Object.keys(sdgParticipation).length === 0 && (
          <div className="text-center py-10">
            <div className="bg-muted/30 rounded-full h-16 w-16 mx-auto mb-3 flex items-center justify-center">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm mb-1.5">No SDG activities yet</h3>
            <p className="text-xs text-muted-foreground">
              Start participating in activities to see your impact here
            </p>
          </div>
        )}
      </Card>

      {/* Points Details Dialog */}
      <PointsDetailsDialog
        open={pointsDialogOpen}
        onOpenChange={setPointsDialogOpen}
        category={selectedCategory}
        activities={currentUser.activities}
      />
    </div>
  );
}
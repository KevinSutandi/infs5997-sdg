import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge as BadgeUI } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Student, Badge } from '@/types';
import { currentUser } from '@/data/mockData';
import { Trophy } from 'lucide-react';

interface UserProfileProps {
  user: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCurrentUser?: boolean;
}

export function UserProfile({ user, open, onOpenChange, isCurrentUser = false }: UserProfileProps) {
  if (!user) return null;

  // When viewing own profile, use currentUser.badges to ensure sync with MyRewards
  const badges = isCurrentUser ? (currentUser.badges || []) : (user.badges || []);
  const earnedBadges = badges.filter((b: Badge) => b.earned);

  // Show only first 5 earned badges
  const visibleBadges = earnedBadges.slice(0, 5);
  const remainingCount = earnedBadges.length - 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{user.name}&apos;s Profile</DialogTitle>
          <DialogDescription>
            View {isCurrentUser ? 'your' : user.name + "'s"} profile including badges and achievements
          </DialogDescription>
        </DialogHeader>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4 pb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-3">
            <h2 className="text-2xl">{user.name}</h2>
            <p className="text-muted-foreground">{user.faculty}</p>

            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                <span className="text-xl font-bold text-yellow-600">{user.totalPoints} points</span>
              </div>
              {user.rank && (
                <BadgeUI variant="secondary">
                  Rank #{user.rank}
                </BadgeUI>
              )}
            </div>

            {/* Compact Badge Strip */}
            {earnedBadges.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                {visibleBadges.map(badge => (
                  <TooltipProvider key={badge.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: badge.color + '20' }}
                        >
                          {badge.icon}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{badge.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {remainingCount > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm bg-muted cursor-pointer hover:scale-110 transition-transform">
                          +{remainingCount}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{remainingCount} more {remainingCount === 1 ? 'badge' : 'badges'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

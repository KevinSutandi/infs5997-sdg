import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { UserProfile } from './UserProfile';
import { allStudents, currentUser } from '@/data/mockData';
import { Student } from '@/types';
import { Trophy, Users, UserMinus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface FriendsListProps {
  followedUserIds: string[];
  followerIds: string[];
  onUnfollow: (userId: string) => void;
}

export function FriendsList({ followedUserIds, followerIds, onUnfollow }: FriendsListProps) {
  const [selectedUser, setSelectedUser] = useState<Student | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [friendsDialogOpen, setFriendsDialogOpen] = useState(false);

  const followedUsers = allStudents.filter(s => followedUserIds.includes(s.id));
  const followers = allStudents.filter(s => followerIds.includes(s.id));

  const handleUnfollow = (userId: string, userName: string) => {
    onUnfollow(userId);
    toast.success('Unfollowed', {
      description: `Removed ${userName} from your friends list`
    });
  };

  const handleViewProfile = (user: Student) => {
    setSelectedUser(user);
    setFriendsDialogOpen(false); // Close friends dialog
    setProfileOpen(true); // Open profile dialog
  };

  return (
    <>
      <Dialog open={friendsDialogOpen} onOpenChange={setFriendsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
            <Users className="h-4 w-4 ml-1" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Friends
            </DialogTitle>
            <DialogDescription>
              Manage your followers and following
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="following" className="mt-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="following">
                Following ({followedUsers.length})
              </TabsTrigger>
              <TabsTrigger value="followers">
                Followers ({followers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="following" className="space-y-3 mt-4">
              {followedUsers.length > 0 ? (
                followedUsers.map(user => (
                  <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleViewProfile(user)}
                      >
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h4 className="hover:text-primary transition-colors">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.faculty}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-yellow-600 fill-yellow-600" />
                              <span className="text-sm font-semibold text-yellow-600">{user.totalPoints} points</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Rank #{user.rank}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfollow(user.id, user.name)}
                        className="shrink-0"
                      >
                        <UserMinus className="h-4 w-4 mr-1" />
                        Unfollow
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-2">Not following anyone yet</p>
                  <p className="text-sm text-muted-foreground">
                    Go to Rankings to find and follow peers
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="followers" className="space-y-3 mt-4">
              {followers.length > 0 ? (
                followers.map(user => {
                  const isFollowingBack = followedUserIds.includes(user.id);
                  return (
                    <Card
                      key={user.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewProfile(user)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h4 className="hover:text-primary transition-colors">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.faculty}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-yellow-600 fill-yellow-600" />
                              <span className="text-sm font-semibold text-yellow-600">{user.totalPoints} points</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Rank #{user.rank}
                            </Badge>
                            {isFollowingBack && (
                              <Badge variant="outline" className="text-xs">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Mutual
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-2">No followers yet</p>
                  <p className="text-sm text-muted-foreground">
                    Keep participating in SDG activities to gain visibility!
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* User Profile Dialog - Outside to avoid nesting */}
      <UserProfile
        user={selectedUser}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        isCurrentUser={selectedUser?.id === currentUser.id}
      />
    </>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { UserProfile } from './UserProfile';
import { allStudents, currentUser } from '@/data/mockData';
import { Student } from '@/types';
import { Trophy, Medal, Award, Building2, GraduationCap, Users, Search, UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

type ScopeFilter = 'global' | 'faculty' | 'friends';
type TimeFilter = 'alltime' | 'monthly' | 'weekly';

export function Ranking() {
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('global');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('alltime');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedUsers, setFollowedUsers] = useState<string[]>(currentUser.followedUsers || []);
  const [selectedUser, setSelectedUser] = useState<Student | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [anonymousOnLeaderboard, setAnonymousOnLeaderboard] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('anonymousOnLeaderboard') === 'true';
    }
    return false;
  });

  // Listen for storage changes (when settings are updated)
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        setAnonymousOnLeaderboard(localStorage.getItem('anonymousOnLeaderboard') === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for same-tab updates
    window.addEventListener('anonymousSettingsChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('anonymousSettingsChanged', handleStorageChange);
    };
  }, []);

  // Generate a fun generic name based on user ID (deterministic)
  const generateAnonymousName = (userId: string): string => {
    const adjectives = [
      'Fun', 'Happy', 'Cool', 'Bright', 'Swift', 'Bold', 'Kind', 'Wise',
      'Calm', 'Eager', 'Gentle', 'Jolly', 'Lively', 'Merry', 'Peppy', 'Zesty',
      'Cheerful', 'Dynamic', 'Radiant', 'Vibrant', 'Playful', 'Sunny', 'Breezy', 'Cozy'
    ];

    const animals = [
      'Giraffe', 'Penguin', 'Dolphin', 'Tiger', 'Eagle', 'Panda', 'Koala', 'Owl',
      'Fox', 'Bear', 'Lion', 'Wolf', 'Deer', 'Rabbit', 'Swan', 'Hawk',
      'Seal', 'Otter', 'Badger', 'Hedgehog', 'Falcon', 'Jaguar', 'Lynx', 'Moose'
    ];

    // Create a simple hash from the user ID to get consistent values
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const adjIndex = Math.abs(hash) % adjectives.length;
    const animalIndex = Math.abs(hash >> 8) % animals.length;

    return `${adjectives[adjIndex]} ${animals[animalIndex]}`;
  };

  // Helper function to get display name (anonymous if enabled and is current user)
  const getDisplayName = (student: Student) => {
    if (student.id === currentUser.id && anonymousOnLeaderboard) {
      return generateAnonymousName(student.id);
    }
    return student.name;
  };

  // Helper function to get display avatar (anonymous if enabled and is current user)
  const getDisplayAvatar = (student: Student) => {
    if (student.id === currentUser.id && anonymousOnLeaderboard) {
      return undefined; // Return undefined to use fallback
    }
    return student.avatar;
  };

  // Helper function to get avatar fallback initials
  const getAvatarFallback = (student: Student) => {
    if (student.id === currentUser.id && anonymousOnLeaderboard) {
      const anonymousName = generateAnonymousName(student.id);
      return anonymousName.split(' ').map(n => n[0]).join(''); // e.g., "FG" for "Fun Giraffe"
    }
    return student.name.split(' ').map(n => n[0]).join('');
  };

  const handleFollow = (userId: string) => {
    if (followedUsers.includes(userId)) {
      setFollowedUsers(followedUsers.filter(id => id !== userId));
      toast.success('Unfollowed', {
        description: 'User removed from your friends list'
      });
    } else {
      setFollowedUsers([...followedUsers, userId]);
      toast.success('Following!', {
        description: 'User added to your friends list'
      });
    }
  };

  const handleViewProfile = (student: Student) => {
    setSelectedUser(student);
    setProfileOpen(true);
  };

  const getFilteredStudents = () => {
    let filtered = [...allStudents];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(s =>
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply scope filter
    if (scopeFilter === 'faculty') {
      filtered = filtered.filter(s => s.faculty === currentUser.faculty);
    } else if (scopeFilter === 'friends') {
      filtered = filtered.filter(s => followedUsers.includes(s.id) || s.id === currentUser.id);
    }

    // Sort by selected time period
    filtered.sort((a, b) => {
      if (timeFilter === 'weekly') {
        return (b.weeklyPoints || 0) - (a.weeklyPoints || 0);
      } else if (timeFilter === 'monthly') {
        return (b.monthlyPoints || 0) - (a.monthlyPoints || 0);
      }
      return b.totalPoints - a.totalPoints;
    });

    // Update ranks based on filter
    return filtered.map((student, index) => ({
      ...student,
      rank: index + 1
    }));
  };

  const filteredStudents = getFilteredStudents();

  const getPointsForTimeFilter = (student: Student) => {
    if (timeFilter === 'weekly') return student.weeklyPoints || 0;
    if (timeFilter === 'monthly') return student.monthlyPoints || 0;
    return student.totalPoints;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-yellow-600 fill-yellow-600" />;
      case 3:
        return <Award className="h-6 w-6 text-yellow-600 fill-yellow-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-linear-to-br from-yellow-400 to-amber-600 text-white shadow-lg shadow-yellow-500/50';
      case 2:
        return 'bg-linear-to-br from-slate-300 to-slate-500 text-white shadow-md shadow-slate-400/40';
      case 3:
        return 'bg-linear-to-br from-orange-400 to-orange-600 text-white shadow-md shadow-orange-500/40';
      default:
        return rank <= 10 ? 'bg-linear-to-br from-primary/20 to-primary/10 text-foreground font-bold' : 'bg-muted text-muted-foreground';
    }
  };

  const getTimePeriodLabel = () => {
    if (timeFilter === 'weekly') return 'This Week';
    if (timeFilter === 'monthly') return 'This Month';
    return 'All Time';
  };

  const currentUserInFiltered = filteredStudents.find(s => s.id === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Top contributors to sustainable development goals 🏆
          </p>
        </div>
      </div>

      {/* Search and Filters Card */}
      <Card className="p-6 shadow-md">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Student ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border-t pt-4 space-y-4">
            {/* Filters in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scope Filter */}
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-amber-600" />
                  View Rankings
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={scopeFilter === 'global' ? 'default' : 'outline'}
                    onClick={() => setScopeFilter('global')}
                    className="flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    University
                  </Button>
                  <Button
                    variant={scopeFilter === 'faculty' ? 'default' : 'outline'}
                    onClick={() => setScopeFilter('faculty')}
                    className="flex items-center gap-2"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Faculty
                  </Button>
                  <Button
                    variant={scopeFilter === 'friends' ? 'default' : 'outline'}
                    onClick={() => setScopeFilter('friends')}
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Friends
                  </Button>
                </div>
              </div>

              {/* Time Period Filter */}
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-amber-600" />
                  Time Period
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={timeFilter === 'alltime' ? 'default' : 'outline'}
                    onClick={() => setTimeFilter('alltime')}
                  >
                    All-time
                  </Button>
                  <Button
                    variant={timeFilter === 'monthly' ? 'default' : 'outline'}
                    onClick={() => setTimeFilter('monthly')}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={timeFilter === 'weekly' ? 'default' : 'outline'}
                    onClick={() => setTimeFilter('weekly')}
                  >
                    Weekly
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filter Info */}
            <div className="flex items-center gap-2 flex-wrap text-sm pt-3 border-t">
              <span className="text-muted-foreground">Showing:</span>
              <Badge variant="secondary" className="font-semibold">
                {scopeFilter === 'global' ? 'University-wide' : scopeFilter === 'faculty' ? currentUser.faculty : 'Friends Only'}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <Badge variant="secondary" className="font-semibold">
                {getTimePeriodLabel()}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <Badge variant="secondary" className="font-semibold">
                {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Top 3 Podium */}
      {filteredStudents.length >= 3 && (
        <div>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
              🏆 Top Contributors
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Leading the way in sustainable development</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-end">
            {filteredStudents.slice(0, 3).map((student, index) => {
              const heightClass = index === 0 ? 'md:min-h-[380px]' : index === 1 ? 'md:min-h-[340px]' : 'md:min-h-[320px]';
              const ringColor = index === 0 ? 'ring-yellow-500/50' : index === 1 ? 'ring-slate-400/50' : 'ring-orange-600/50';

              return (
                <Card
                  key={student.id}
                  className={`${heightClass} p-6 pt-12 text-center cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden ${student.id === currentUser.id ? 'ring-2 ring-primary' : ''
                    } ${index === 0
                      ? 'md:order-2 bg-linear-to-br from-amber-500/20 via-amber-500/10 to-background border-amber-500/40 border-2 shadow-lg shadow-amber-500/20'
                      : ''
                    } ${index === 1
                      ? 'md:order-1 bg-linear-to-br from-slate-400/10 to-background border-slate-400/30 border-2'
                      : ''
                    } ${index === 2
                      ? 'md:order-3 bg-linear-to-br from-orange-600/10 to-background border-orange-600/30 border-2'
                      : ''
                    }`}
                  onClick={() => handleViewProfile(student)}
                >
                  {/* Rank Badge at Top */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-1/4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getRankBadgeColor(student.rank!)} shadow-lg`}>
                      <span className="text-lg font-bold">#{student.rank}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 mt-6">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full blur-xl ${index === 0 ? 'bg-amber-500/30' : index === 1 ? 'bg-slate-400/20' : 'bg-orange-600/20'
                        }`} />
                      <Avatar className={`h-24 w-24 ring-4 ${ringColor} relative`}>
                        <AvatarImage src={getDisplayAvatar(student)} alt={getDisplayName(student)} />
                        <AvatarFallback className="text-lg">{getAvatarFallback(student)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 drop-shadow-lg">
                        {getRankIcon(student.rank!)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                        {getDisplayName(student)}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{student.faculty}</p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className={`text-4xl font-black ${index === 0 ? 'bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent' : 'text-amber-600'
                        }`}>
                        {getPointsForTimeFilter(student).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {timeFilter === 'weekly' ? 'pts this week' : timeFilter === 'monthly' ? 'pts this month' : 'total points'}
                      </p>
                    </div>

                    {student.id === currentUser.id && (
                      <Badge className="bg-primary hover:bg-primary shadow-md">
                        🎯 You
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Ranking Table */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Complete Rankings</h3>
            <p className="text-sm text-muted-foreground mt-1">
              All participants ranked by performance
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const isTopThree = student.rank! <= 3;
            const isCurrentUser = student.id === currentUser.id;

            return (
              <div
                key={student.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all group ${isCurrentUser
                  ? 'bg-linear-to-r from-primary/10 to-primary/5 border-2 border-primary hover:shadow-lg hover:shadow-primary/20'
                  : isTopThree
                    ? 'bg-linear-to-r from-amber-500/5 to-background border border-amber-500/20 hover:shadow-lg hover:border-amber-500/40'
                    : 'bg-accent/20 hover:bg-accent/40 hover:shadow-md border border-transparent'
                  }`}
              >
                {/* Rank Badge */}
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg transition-transform group-hover:scale-110 ${getRankBadgeColor(student.rank!)}`}>
                  {student.rank}
                </div>

                {/* Avatar and Student Info - Clickable */}
                <div
                  className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleViewProfile(student)}
                >
                  <div className="relative">
                    <Avatar className="h-14 w-14 shrink-0 ring-2 ring-background group-hover:ring-primary/30 transition-all">
                      <AvatarImage src={getDisplayAvatar(student)} alt={getDisplayName(student)} />
                      <AvatarFallback className="font-semibold">{getAvatarFallback(student)}</AvatarFallback>
                    </Avatar>
                    {isTopThree && (
                      <div className="absolute -bottom-1 -right-1">
                        {getRankIcon(student.rank!)}
                      </div>
                    )}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold group-hover:text-primary transition-colors">
                        {getDisplayName(student)}
                      </h4>
                      {isCurrentUser && (
                        <Badge className="bg-primary hover:bg-primary">
                          🎯 You
                        </Badge>
                      )}
                      {followedUsers.includes(student.id) && !isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          ⭐ Following
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {student.faculty}
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right shrink-0 min-w-[100px]">
                  <p className={`text-2xl font-black transition-colors ${isTopThree ? 'text-amber-600' : 'text-foreground'
                    }`}>
                    {getPointsForTimeFilter(student).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    {timeFilter === 'weekly' ? 'this week' : timeFilter === 'monthly' ? 'this month' : 'total'}
                  </p>
                </div>

                {/* Follow Button */}
                {!isCurrentUser && (
                  <div className="shrink-0">
                    <Button
                      variant={followedUsers.includes(student.id) ? 'outline' : 'default'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(student.id);
                      }}
                      className="transition-all hover:scale-105"
                    >
                      {followedUsers.includes(student.id) ? (
                        <UserCheck className="h-4 w-4" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-muted/30 rounded-full h-24 w-24 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Rankings Found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </Card>


      {/* User Profile Dialog */}
      <UserProfile
        user={selectedUser}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        isCurrentUser={selectedUser?.id === currentUser.id}
      />
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { currentUser } from '@/data/mockData';
import {
  User,
  Shield,
  Bell,
  Camera,
  Save,
  X,
  EyeOff,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';

const FACULTIES = [
  'UNSW Business School',
  'Faculty of Engineering',
  'Faculty of Science',
  'Faculty of Arts, Design & Architecture',
  'Faculty of Law & Justice',
  'Faculty of Medicine & Health',
  'Faculty of Built Environment',
  'School of Computer Science & Engineering',
];

export default function SettingsPage() {
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Privacy settings state
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);
  const [anonymousOnLeaderboard, setAnonymousOnLeaderboard] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('anonymousOnLeaderboard') === 'true';
    }
    return false;
  });

  // Notification settings state
  const [activityReminders, setActivityReminders] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Persist anonymous settings to localStorage and notify other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anonymousOnLeaderboard', anonymousOnLeaderboard.toString());
      window.dispatchEvent(new Event('anonymousSettingsChanged'));
    }
  }, [anonymousOnLeaderboard]);

  // Edit profile state
  const [editName, setEditName] = useState(currentUser.name);
  const [editStudentId] = useState('z5352065');
  const [editFaculty, setEditFaculty] = useState(currentUser.faculty);

  const handleSaveProfile = () => {
    toast.success('Profile Updated', {
      description: 'Your profile changes have been saved.'
    });
    setEditProfileOpen(false);
  };

  const handlePrivacyChange = (setting: string, value: boolean) => {
    if (setting === 'analytics') {
      setAnalyticsEnabled(value);
      toast.success(value ? 'Analytics Enabled' : 'Analytics Disabled', {
        description: value
          ? 'Helping us improve the platform'
          : 'Analytics data collection disabled'
      });
    } else if (setting === 'personalization') {
      setPersonalizationEnabled(value);
      toast.success(value ? 'Personalization Enabled' : 'Personalization Disabled', {
        description: value
          ? 'Receive personalized recommendations'
          : 'Personalized recommendations disabled'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Profile</h2>
            <p className="text-xs text-muted-foreground">Manage your personal information</p>
          </div>
        </div>

        <Card className="p-4 md:p-5">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md">
                <Camera className="h-3 w-3" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-2.5 w-full sm:w-auto">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="mt-1 text-sm font-medium">{currentUser.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Student ID</Label>
                <p className="mt-1 text-sm font-medium">z5352065</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Faculty</Label>
                <p className="mt-1 text-sm font-medium">{currentUser.faculty}</p>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditProfileOpen(true)}
              className="w-full sm:w-auto"
            >
              Edit Profile
            </Button>
          </div>
        </Card>
      </section>

      <Separator />

      {/* Privacy Section */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Privacy</h2>
            <p className="text-xs text-muted-foreground">Control your data and privacy settings</p>
          </div>
        </div>

        <Card className="divide-y">
          {/* Essential Data */}
          <div className="p-3 md:p-4 bg-muted/30">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label>Essential Data</Label>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    Required
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Needed for authentication, SDG point tracking, and activity registration.
                </p>
              </div>
              <Switch checked disabled className="mt-1" />
            </div>
          </div>

          {/* Analytics & Performance */}
          <div className="p-3 md:p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <Label className="mb-1 block text-sm">Analytics & Performance</Label>
                <p className="text-xs text-muted-foreground">
                  Help us improve the platform by sharing usage data and understanding engagement patterns.
                </p>
              </div>
              <Switch
                checked={analyticsEnabled}
                onCheckedChange={(checked) => handlePrivacyChange('analytics', checked)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Personalization */}
          <div className="p-3 md:p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <Label className="mb-1 block text-sm">Personalization</Label>
                <p className="text-xs text-muted-foreground">
                  Receive personalized activity recommendations based on your interests and past participation.
                </p>
              </div>
              <Switch
                checked={personalizationEnabled}
                onCheckedChange={(checked) => handlePrivacyChange('personalization', checked)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Anonymous on Leaderboard */}
          <div className="p-3 md:p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  <Label className="text-sm">Anonymous on Leaderboard</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Display a generic anonymous name and avatar instead of your real name and profile picture on the leaderboard.
                </p>
              </div>
              <Switch
                checked={anonymousOnLeaderboard}
                onCheckedChange={(checked) => {
                  setAnonymousOnLeaderboard(checked);
                  toast.success(checked ? 'Anonymous Mode Enabled' : 'Anonymous Mode Disabled', {
                    description: checked
                      ? 'Your name and profile picture will appear as anonymous on the leaderboard'
                      : 'Your real name and profile picture will be displayed on the leaderboard'
                  });
                }}
                className="mt-1"
              />
            </div>
          </div>
        </Card>
      </section>

      <Separator />

      {/* Notifications Section */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Bell className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Notifications</h2>
            <p className="text-xs text-muted-foreground">Manage your notification preferences</p>
          </div>
        </div>

        <Card className="divide-y">
          {/* Activity Reminders */}
          <div className="p-3 md:p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <Label className="mb-1 block text-sm">Activity Reminders</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified before upcoming activities you&apos;ve registered for.
                </p>
              </div>
              <Switch
                checked={activityReminders}
                onCheckedChange={setActivityReminders}
                className="mt-1"
              />
            </div>
          </div>

          {/* Achievement Alerts */}
          <div className="p-3 md:p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <Label className="mb-1 block text-sm">Achievement Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Celebrate when you earn new badges or reach milestones.
                </p>
              </div>
              <Switch
                checked={achievementAlerts}
                onCheckedChange={setAchievementAlerts}
                className="mt-1"
              />
            </div>
          </div>

          {/* Weekly Digest */}
          <div className="p-3 md:p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <Label className="mb-1 block text-sm">Weekly Digest</Label>
                <p className="text-xs text-muted-foreground">
                  Receive a summary of your SDG activities and points every week.
                </p>
              </div>
              <Switch
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
                className="mt-1"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* App Info */}
      <div className="text-center text-xs text-muted-foreground pt-4">
        UNSW SDGgo! Platform v1.0.0
        <br />
        UNSW Sustainable Development Goals Engagement System
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-student-id">Student ID</Label>
              <Input
                id="edit-student-id"
                value={editStudentId}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Student ID cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-faculty">Faculty</Label>
              <Select value={editFaculty} onValueChange={setEditFaculty}>
                <SelectTrigger id="edit-faculty" className="w-full">
                  <SelectValue placeholder="Select your faculty" />
                </SelectTrigger>
                <SelectContent>
                  {FACULTIES.map((fac) => (
                    <SelectItem key={fac} value={fac}>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        {fac}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


'use client';

import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import {
  TrendingUp,
  Users,
  Calendar,
  Award,
  Building2,
  ArrowUp,
  ArrowDown,
  Target,
  Activity,
} from 'lucide-react';
import { getDashboardOverview, getSDGAnalytics, getEventAnalytics } from '@/lib/adminAnalytics';

export function AdminOverview() {
  const overview = getDashboardOverview();
  const sdgData = getSDGAnalytics();
  const eventData = getEventAnalytics();

  // Calculate trends (mock data - in real app would compare with previous period)
  const trends = {
    students: 12, // +12% from last month
    activities: 8,
    points: 15,
    engagement: 5,
  };

  // Get top SDGs
  const topSDGs = sdgData.slice(0, 5);

  // Calculate engagement rate
  const engagementRate = (overview.totalStudents > 0
    ? ((overview.totalActivities / overview.totalStudents) * 100).toFixed(1)
    : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor key metrics and platform performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${trends.students > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trends.students > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trends.students)}%
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">{overview.totalStudents}</p>
          <p className="text-sm text-muted-foreground">Total Students</p>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${trends.activities > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trends.activities > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trends.activities)}%
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">{overview.totalActivities}</p>
          <p className="text-sm text-muted-foreground">Total Activities</p>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${trends.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trends.points > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trends.points)}%
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">{overview.totalPoints.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Points Awarded</p>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${trends.engagement > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trends.engagement > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trends.engagement)}%
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">{overview.averageEngagement}</p>
          <p className="text-sm text-muted-foreground">Avg Activities/Student</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 columns wide */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top SDGs Performance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">SDG Performance</h3>
                <p className="text-sm text-muted-foreground">Top 5 most engaged SDGs</p>
              </div>
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {topSDGs.map((sdg) => (
                <div key={sdg.number} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: sdg.color }}
                      >
                        {sdg.number}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{sdg.name}</p>
                        <p className="text-xs text-muted-foreground">{sdg.participants} participants</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{sdg.totalPoints.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                  <Progress
                    value={(sdg.participants / topSDGs[0].participants) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Event Statistics */}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Most Active Faculty</p>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-semibold">{overview.mostActiveFaculty}</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-semibold">{engagementRate}%</p>
                <Progress value={Number(engagementRate)} className="h-2 mt-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Points This Week</p>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-semibold">{overview.weeklyPoints.toLocaleString()}</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Points This Month</p>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-semibold">{overview.monthlyPoints.toLocaleString()}</p>
              </div>
            </div>
          </Card>

        </div>
        <Card className="p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Event Statistics</h3>
              <p className="text-sm text-muted-foreground">Recent event performance</p>
            </div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold">{overview.totalRegistered}</p>
              <p className="text-xs text-muted-foreground mt-1">Registered</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold">{overview.totalAttended}</p>
              <p className="text-xs text-muted-foreground mt-1">Attended</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold">
                {overview.totalRegistered > 0
                  ? ((overview.totalAttended / overview.totalRegistered) * 100).toFixed(0)
                  : 0}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Attendance Rate</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold">{eventData.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Events</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


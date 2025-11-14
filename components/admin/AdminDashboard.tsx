'use client';

import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  Award,
  Building2,
  FileText,
  Settings
} from 'lucide-react';
import { getDashboardOverview } from '@/lib/adminAnalytics';
import { SDGAnalytics } from './Analytics/SDGAnalytics';
import { EventAnalytics } from './Analytics/EventAnalytics';
import { FacultyComparison } from './Analytics/FacultyComparison';
import { ActivityManagement } from './Management/ActivityManagement';

export function AdminDashboard() {
  const overview = getDashboardOverview();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and management for the SDG platform
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Students</p>
              <p className="text-2xl font-bold ">{overview.totalStudents}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 " />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Activities</p>
              <p className="text-2xl font-bold ">{overview.totalActivities}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 " />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Points</p>
              <p className="text-2xl font-bold ">{overview.totalPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Weekly: {overview.weeklyPoints.toLocaleString()} | Monthly: {overview.monthlyPoints.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Award className="h-6 w-6 " />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Engagement</p>
              <p className="text-2xl font-bold ">{overview.averageEngagement}</p>
              <p className="text-xs text-muted-foreground mt-1">activities per student</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 " />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 " />
            <div>
              <p className="text-sm text-muted-foreground">Most Active Faculty</p>
              <p className="font-semibold">{overview.mostActiveFaculty}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 " />
            <div>
              <p className="text-sm text-muted-foreground">Top SDG Goals</p>
              <div className="flex gap-1 mt-1">
                {overview.topSDGs.map((sdg, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {sdg}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 " />
            <div>
              <p className="text-sm text-muted-foreground">Event Registrations</p>
              <p className="font-semibold">
                {overview.totalRegistered} registered, {overview.totalAttended} attended
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Content Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <Tabs defaultValue="sdg" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sdg" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                SDG Analytics
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Event Analytics
              </TabsTrigger>
              <TabsTrigger value="faculty" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Faculty Comparison
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sdg">
              <SDGAnalytics />
            </TabsContent>

            <TabsContent value="events">
              <EventAnalytics />
            </TabsContent>

            <TabsContent value="faculty">
              <FacultyComparison />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <Tabs defaultValue="activities" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activities" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Activities & Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activities">
              <ActivityManagement />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}


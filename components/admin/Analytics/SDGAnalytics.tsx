'use client';

import { useState } from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Progress } from '../../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { getSDGAnalytics } from '@/lib/adminAnalytics';
import { Download, Search, TrendingUp, Users, Award, Target, BarChart3 } from 'lucide-react';

export function SDGAnalytics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'participants' | 'points' | 'activities'>('participants');

  const sdgData = getSDGAnalytics();

  // Filter and sort
  const filteredData = sdgData.filter(sdg => {
    const matchesSearch = sdg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sdg.number.toString().includes(searchQuery);
    return matchesSearch;
  });

  // Sort
  filteredData.sort((a, b) => {
    if (sortBy === 'participants') return b.participants - a.participants;
    if (sortBy === 'points') return b.totalPoints - a.totalPoints;
    return b.activityCount - a.activityCount;
  });

  const handleExport = () => {
    // Mock export - in real app would generate CSV/PDF
    const csv = [
      ['SDG Number', 'SDG Name', 'Participants', 'Total Points', 'Activities'],
      ...filteredData.map(sdg => [
        sdg.number,
        sdg.name,
        sdg.participants,
        sdg.totalPoints,
        sdg.activityCount,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sdg-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate summary statistics
  const totalParticipants = filteredData.reduce((sum, sdg) => sum + sdg.participants, 0);
  const totalPoints = filteredData.reduce((sum, sdg) => sum + sdg.totalPoints, 0);
  const avgParticipantsPerSDG = filteredData.length > 0 ? Math.round(totalParticipants / filteredData.length) : 0;
  const mostPopularSDG = filteredData[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">SDG Analytics</h1>
          <p className="text-muted-foreground">
            Analyze SDG engagement and identify trends across the platform
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <Badge variant="secondary">{filteredData.length} SDGs</Badge>
          </div>
          <p className="text-2xl font-bold">{totalParticipants}</p>
          <p className="text-sm text-muted-foreground">Total Participants</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Points Awarded</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold">{avgParticipantsPerSDG}</p>
          <p className="text-sm text-muted-foreground">Avg Participants/SDG</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-500" />
          </div>
          <p className="text-2xl font-bold">SDG {mostPopularSDG?.number}</p>
          <p className="text-sm text-muted-foreground">Most Popular</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-muted/30">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search SDGs by name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center gap-2 justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Table</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <Select value={sortBy} onValueChange={(v: 'participants' | 'points' | 'activities') => setSortBy(v)} >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="participants">Most Participants</SelectItem>
              <SelectItem value="points">Most Points</SelectItem>
              <SelectItem value="activities">Most Activities</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 SDGs with Progress */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top 5 SDGs by Engagement</h3>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {filteredData.slice(0, 5).map((sdg) => (
                  <div key={sdg.number} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ backgroundColor: sdg.color }}
                        >
                          {sdg.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{sdg.name}</p>
                          <p className="text-xs text-muted-foreground">{sdg.participants} participants</p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm ml-2">{sdg.totalPoints.toLocaleString()}</p>
                    </div>
                    <Progress
                      value={(sdg.participants / filteredData[0].participants) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Activity Distribution */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Activity Distribution</h3>
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {filteredData.slice(0, 5).map((sdg) => (
                  <div key={sdg.number} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-md flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: sdg.color }}
                      >
                        {sdg.number}
                      </div>
                      <span className="text-sm font-medium">{sdg.name}</span>
                    </div>
                    <Badge variant="secondary">{sdg.activityCount} activities</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Participation Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Participation Metrics by SDG</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredData.slice(0, 6).map((sdg) => (
                <div key={sdg.number} className="text-center p-4 bg-muted/30 rounded-lg">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto mb-2"
                    style={{ backgroundColor: sdg.color }}
                  >
                    {sdg.number}
                  </div>
                  <p className="text-xl font-bold">{sdg.participants}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{sdg.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-semibold">SDG</th>
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-right p-4 font-semibold">Participants</th>
                    <th className="text-right p-4 font-semibold">Total Points</th>
                    <th className="text-right p-4 font-semibold">Activities</th>
                    <th className="text-left p-4 font-semibold">Top Faculties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((sdg) => {
                    const topFaculties = Array.from(sdg.facultyBreakdown.entries())
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([faculty]) => faculty);

                    return (
                      <tr key={sdg.number} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div
                            className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: sdg.color }}
                          >
                            {sdg.number}
                          </div>
                        </td>
                        <td className="p-4 font-medium">{sdg.name}</td>
                        <td className="p-4 text-right font-semibold">{sdg.participants}</td>
                        <td className="p-4 text-right font-semibold">{sdg.totalPoints.toLocaleString()}</td>
                        <td className="p-4 text-right font-medium">{sdg.activityCount}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {topFaculties.map((faculty, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {faculty.split(' ')[0]}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Points vs Participants */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Points vs Participants</h3>
              <div className="space-y-3">
                {filteredData.slice(0, 8).map((sdg) => {
                  const avgPointsPerParticipant = sdg.participants > 0
                    ? Math.round(sdg.totalPoints / sdg.participants)
                    : 0;
                  return (
                    <div key={sdg.number} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-md flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: sdg.color }}
                        >
                          {sdg.number}
                        </div>
                        <span className="text-sm font-medium">{sdg.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{avgPointsPerParticipant}</p>
                        <p className="text-xs text-muted-foreground">pts/participant</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Faculty Engagement */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top SDGs by Faculty Count</h3>
              <div className="space-y-3">
                {filteredData
                  .sort((a, b) => b.facultyBreakdown.size - a.facultyBreakdown.size)
                  .slice(0, 8)
                  .map((sdg) => (
                    <div key={sdg.number} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-md flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: sdg.color }}
                        >
                          {sdg.number}
                        </div>
                        <span className="text-sm font-medium">{sdg.name}</span>
                      </div>
                      <Badge variant="outline">{sdg.facultyBreakdown.size} faculties</Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


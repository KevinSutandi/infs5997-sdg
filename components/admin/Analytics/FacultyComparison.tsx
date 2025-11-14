'use client';

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { getFacultyAnalytics } from '@/lib/adminAnalytics';
import { SDG_GOALS } from '@/types';
import { Download, Building2, Users, Award, TrendingUp, Target, Trophy } from 'lucide-react';

export function FacultyComparison() {
  const facultyData = getFacultyAnalytics();

  const handleExport = () => {
    const csv = [
      ['Faculty', 'Total Students', 'Total Points', 'Avg Points', 'Total Activities', 'Avg Activities'],
      ...facultyData.map(faculty => [
        faculty.faculty,
        faculty.totalStudents,
        faculty.totalPoints,
        faculty.averagePoints.toFixed(1),
        faculty.totalActivities,
        faculty.averageActivities.toFixed(1),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faculty-comparison-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate metrics
  const totalStudents = facultyData.reduce((sum, f) => sum + f.totalStudents, 0);
  const totalPoints = facultyData.reduce((sum, f) => sum + f.totalPoints, 0);
  const avgPointsPerStudent = facultyData.length > 0
    ? (facultyData.reduce((sum, f) => sum + f.averagePoints, 0) / facultyData.length)
    : 0;
  const maxPoints = Math.max(...facultyData.map(f => f.totalPoints), 1);
  const maxAvgPoints = Math.max(...facultyData.map(f => f.averagePoints), 1);
  const maxActivities = Math.max(...facultyData.map(f => f.averageActivities), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Faculty Comparison</h1>
          <p className="text-muted-foreground">
            Compare faculty performance and identify engagement patterns
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{facultyData.length}</p>
          <p className="text-sm text-muted-foreground">Total Faculties</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold">{totalStudents}</p>
          <p className="text-sm text-muted-foreground">Total Students</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Points</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold">{avgPointsPerStudent.toFixed(0)}</p>
          <p className="text-sm text-muted-foreground">Avg Points/Student</p>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Analysis</TabsTrigger>
          <TabsTrigger value="details">Detailed Table</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Faculties by Total Points */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Faculties by Total Points</h3>
                <Trophy className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {facultyData.slice(0, 5).map((faculty, idx) => (
                  <div key={faculty.faculty} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Badge variant={idx === 0 ? "default" : "secondary"} className="shrink-0">
                          #{idx + 1}
                        </Badge>
                        <span className="font-medium text-sm truncate">{faculty.faculty}</span>
                      </div>
                      <span className="font-semibold ml-2">{faculty.totalPoints.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(faculty.totalPoints / maxPoints) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {faculty.totalStudents} students • {faculty.averagePoints.toFixed(0)} avg pts/student
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Faculties by Average Points per Student */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top by Avg Points/Student</h3>
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {[...facultyData]
                  .sort((a, b) => b.averagePoints - a.averagePoints)
                  .slice(0, 5)
                  .map((faculty, idx) => (
                    <div key={faculty.faculty} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Badge variant={idx === 0 ? "default" : "secondary"} className="shrink-0">
                            #{idx + 1}
                          </Badge>
                          <span className="font-medium text-sm truncate">{faculty.faculty}</span>
                        </div>
                        <span className="font-semibold ml-2">{faculty.averagePoints.toFixed(0)}</span>
                      </div>
                      <Progress
                        value={(faculty.averagePoints / maxAvgPoints) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {faculty.totalStudents} students • {faculty.totalPoints.toLocaleString()} total pts
                      </p>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          {/* Faculty Performance Grid */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Faculty Performance at a Glance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facultyData.map((faculty) => {
                const topSDGs = Array.from(faculty.sdgParticipation.entries())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([sdgNum]) => SDG_GOALS.find(s => s.number === sdgNum))
                  .filter(Boolean);

                return (
                  <div key={faculty.faculty} className="p-4 bg-muted/30 rounded-lg space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{faculty.faculty}</h4>
                      <p className="text-xs text-muted-foreground">{faculty.totalStudents} students</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Total Points</p>
                        <p className="font-semibold">{faculty.totalPoints.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Points</p>
                        <p className="font-semibold">{faculty.averagePoints.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Activities</p>
                        <p className="font-semibold">{faculty.totalActivities}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Activities</p>
                        <p className="font-semibold">{faculty.averageActivities.toFixed(1)}</p>
                      </div>
                    </div>
                    {topSDGs.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Top SDGs</p>
                        <div className="flex flex-wrap gap-1">
                          {topSDGs.map((sdg) => (
                            <div
                              key={sdg!.number}
                              className="h-6 w-6 rounded flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: sdg!.color }}
                            >
                              {sdg!.number}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Rankings Tab */}
        <TabsContent value="rankings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By Total Points */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Rankings by Total Points</h3>
              <div className="space-y-2">
                {facultyData.map((faculty, idx) => (
                  <div key={faculty.faculty} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-500 text-white' :
                        idx === 1 ? 'bg-slate-400 text-white' :
                          idx === 2 ? 'bg-orange-600 text-white' :
                            'bg-muted text-muted-foreground'
                        }`}>
                        {idx + 1}
                      </div>
                      <span className="font-medium text-sm">{faculty.faculty}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{faculty.totalPoints.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{faculty.totalStudents} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* By Average Points per Student */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Rankings by Avg Points/Student</h3>
              <div className="space-y-2">
                {[...facultyData]
                  .sort((a, b) => b.averagePoints - a.averagePoints)
                  .map((faculty, idx) => (
                    <div key={faculty.faculty} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-500 text-white' :
                          idx === 1 ? 'bg-slate-400 text-white' :
                            idx === 2 ? 'bg-orange-600 text-white' :
                              'bg-muted text-muted-foreground'
                          }`}>
                          {idx + 1}
                        </div>
                        <span className="font-medium text-sm">{faculty.faculty}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{faculty.averagePoints.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">per student</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* By Average Activities per Student */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Rankings by Avg Activities/Student</h3>
              <div className="space-y-2">
                {[...facultyData]
                  .sort((a, b) => b.averageActivities - a.averageActivities)
                  .map((faculty, idx) => (
                    <div key={faculty.faculty} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-500 text-white' :
                          idx === 1 ? 'bg-slate-400 text-white' :
                            idx === 2 ? 'bg-orange-600 text-white' :
                              'bg-muted text-muted-foreground'
                          }`}>
                          {idx + 1}
                        </div>
                        <span className="font-medium text-sm">{faculty.faculty}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{faculty.averageActivities.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">activities/student</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* By Total Activities */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Rankings by Total Activities</h3>
              <div className="space-y-2">
                {[...facultyData]
                  .sort((a, b) => b.totalActivities - a.totalActivities)
                  .map((faculty, idx) => (
                    <div key={faculty.faculty} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-500 text-white' :
                          idx === 1 ? 'bg-slate-400 text-white' :
                            idx === 2 ? 'bg-orange-600 text-white' :
                              'bg-muted text-muted-foreground'
                          }`}>
                          {idx + 1}
                        </div>
                        <span className="font-medium text-sm">{faculty.faculty}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{faculty.totalActivities}</p>
                        <p className="text-xs text-muted-foreground">activities</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Analysis Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Engagement Rate Comparison</h3>
            <div className="space-y-4">
              {[...facultyData]
                .sort((a, b) => b.averageActivities - a.averageActivities)
                .map((faculty) => (
                  <div key={faculty.faculty} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{faculty.faculty}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {faculty.averageActivities.toFixed(1)} activities/student
                        </span>
                        <span className="font-semibold text-sm w-16 text-right">
                          {faculty.totalActivities}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={(faculty.averageActivities / maxActivities) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
            </div>
          </Card>

          {/* SDG Participation by Faculty */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">SDG Focus by Faculty</h3>
            <div className="space-y-4">
              {facultyData.map((faculty) => {
                const topSDGs = Array.from(faculty.sdgParticipation.entries())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([sdgNum, count]) => ({
                    sdg: SDG_GOALS.find(s => s.number === sdgNum),
                    count
                  }))
                  .filter(item => item.sdg);

                return (
                  <div key={faculty.faculty} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm">{faculty.faculty}</h4>
                      <Badge variant="secondary">{topSDGs.length} SDGs</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {topSDGs.map((item) => (
                        <div key={item.sdg!.number} className="flex items-center gap-2 p-2 bg-background rounded">
                          <div
                            className="h-8 w-8 rounded flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: item.sdg!.color }}
                          >
                            {item.sdg!.number}
                          </div>
                          <div>
                            <p className="text-xs font-medium">{item.sdg!.name.split(' ').slice(0, 2).join(' ')}</p>
                            <p className="text-xs text-muted-foreground">{item.count} activities</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Detailed Table Tab */}
        <TabsContent value="details">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold">Faculty</th>
                    <th className="text-right p-3 font-semibold">Students</th>
                    <th className="text-right p-3 font-semibold">Total Points</th>
                    <th className="text-right p-3 font-semibold">Avg Points</th>
                    <th className="text-right p-3 font-semibold">Total Activities</th>
                    <th className="text-right p-3 font-semibold">Avg Activities</th>
                    <th className="text-left p-3 font-semibold">Top SDGs</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyData.map((faculty) => {
                    const topSDGs = Array.from(faculty.sdgParticipation.entries())
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([sdgNum]) => SDG_GOALS.find(s => s.number === sdgNum))
                      .filter(Boolean);

                    return (
                      <tr key={faculty.faculty} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium">{faculty.faculty}</td>
                        <td className="p-3 text-right font-semibold">{faculty.totalStudents}</td>
                        <td className="p-3 text-right font-semibold">{faculty.totalPoints.toLocaleString()}</td>
                        <td className="p-3 text-right font-medium">{faculty.averagePoints.toFixed(0)}</td>
                        <td className="p-3 text-right font-medium">{faculty.totalActivities}</td>
                        <td className="p-3 text-right font-medium">{faculty.averageActivities.toFixed(1)}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {topSDGs.map((sdg) => (
                              <div
                                key={sdg!.number}
                                className="h-7 w-7 rounded flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: sdg!.color }}
                                title={sdg!.name}
                              >
                                {sdg!.number}
                              </div>
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
      </Tabs>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Progress } from '../../ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { getEventAnalytics, getAllRegisteredEvents } from '@/lib/adminAnalytics';
import { Download, Search, Star, Users, Heart, TrendingUp, Award, Target, AlertCircle, MessageSquare, ThumbsUp, ThumbsDown, QrCode } from 'lucide-react';
import { QRCodeDialog } from '../QRCodeDialog';

export function EventAnalytics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [qrCodeEvent, setQrCodeEvent] = useState<{ id: string; title: string } | null>(null);

  const eventData = getEventAnalytics();
  const allEvents = getAllRegisteredEvents();

  // Collect all feedback
  const allFeedback = allEvents
    .filter((event) => event.status === 'attended' && event.feedback)
    .map((event) => ({
      ...event.feedback!,
      eventTitle: event.title,
      eventId: event.activityId,
      organizer: event.organizer,
      attendedDate: event.attendedDate || '',
    }));

  // Filter feedback
  const filteredFeedback = allFeedback.filter((feedback) => {
    if (feedbackFilter === 'positive') return feedback.overallRating >= 4;
    if (feedbackFilter === 'negative') return feedback.overallRating < 4;
    return true;
  });

  // Filter and sort
  const filteredData = eventData.filter(event => {
    return event.title.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
    return b.favoriteCount - a.favoriteCount;
  });

  const handleExport = () => {
    const csv = [
      ['Event Title', 'Organizer', 'Registered', 'Attended', 'Attendance Rate', 'Avg Rating', 'Favorites', 'Capacity', 'Enrolled'],
      ...filteredData.map(event => [
        event.title,
        event.organizer,
        event.registered,
        event.attended,
        `${event.attendanceRate.toFixed(1)}%`,
        event.averageRating > 0 ? event.averageRating.toFixed(1) : 'N/A',
        event.favoriteCount,
        event.capacity || 'Unlimited',
        event.enrolled || 0,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate summary stats
  const totalRegistered = filteredData.reduce((sum, e) => sum + e.registered, 0);
  const totalAttended = filteredData.reduce((sum, e) => sum + e.attended, 0);
  const avgAttendanceRate = filteredData.length > 0
    ? filteredData.reduce((sum, e) => sum + e.attendanceRate, 0) / filteredData.length
    : 0;
  const avgRating = filteredData.filter(e => e.averageRating > 0).length > 0
    ? filteredData.filter(e => e.averageRating > 0).reduce((sum, e) => sum + e.averageRating, 0) /
    filteredData.filter(e => e.averageRating > 0).length
    : 0;

  // Categorize events by attendance rate
  const highPerformers = filteredData.filter(e => e.attendanceRate >= 80);
  const needsImprovement = filteredData.filter(e => e.attendanceRate < 60);

  // Get organizer performance
  const organizerStats = new Map<string, { events: number; totalRegistered: number; totalAttended: number; avgRating: number }>();
  filteredData.forEach(event => {
    const existing = organizerStats.get(event.organizer) || { events: 0, totalRegistered: 0, totalAttended: 0, avgRating: 0 };
    existing.events++;
    existing.totalRegistered += event.registered;
    existing.totalAttended += event.attended;
    existing.avgRating += event.averageRating;
    organizerStats.set(event.organizer, existing);
  });

  const topOrganizers = Array.from(organizerStats.entries())
    .map(([organizer, stats]) => ({
      organizer,
      ...stats,
      avgAttendanceRate: stats.totalRegistered > 0 ? (stats.totalAttended / stats.totalRegistered) * 100 : 0,
      avgRating: stats.avgRating / stats.events
    }))
    .sort((a, b) => b.totalAttended - a.totalAttended)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Analytics</h1>
          <p className="text-muted-foreground">
            Monitor event performance and identify opportunities for improvement
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
            <Users className="h-5 w-5 text-blue-600" />
            <Badge variant="secondary">{filteredData.length} events</Badge>
          </div>
          <p className="text-2xl font-bold">{totalRegistered}</p>
          <p className="text-sm text-muted-foreground">Total Registered</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-500" />
          </div>
          <p className="text-2xl font-bold">{totalAttended}</p>
          <p className="text-sm text-muted-foreground">Total Attended</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold">{avgAttendanceRate.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Avg Attendance Rate</p>
          <Progress value={avgAttendanceRate} className="h-2 mt-2" />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold">
            {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
          </p>
          <p className="text-sm text-muted-foreground">Avg Rating</p>
          {avgRating > 0 && <Progress value={(avgRating / 5) * 100} className="h-2 mt-2" />}
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-muted/30">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Feedback ({allFeedback.length})
          </TabsTrigger>
          <TabsTrigger value="organizers">Organizers</TabsTrigger>
          <TabsTrigger value="details">Detailed Table</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Events */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Events by Attendance</h3>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {filteredData
                  .sort((a, b) => b.attended - a.attended)
                  .slice(0, 5)
                  .map((event, idx) => (
                    <div key={event.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.organizer}</p>
                        </div>
                        <Badge variant={idx === 0 ? "default" : "secondary"}>
                          {event.attended} attended
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={event.attendanceRate}
                          className="h-2 flex-1"
                        />
                        <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                          {event.attendanceRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Highest Rated Events or Most Favorited */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {filteredData.filter(e => e.averageRating > 0).length > 0
                    ? 'Highest Rated Events'
                    : 'Most Favorited Events'}
                </h3>
                <Star className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {filteredData.filter(e => e.averageRating > 0).length > 0 ? (
                  // Show highest rated events if ratings exist
                  filteredData
                    .filter(e => e.averageRating > 0)
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 5)
                    .map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.attended} attendees</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-semibold">{event.averageRating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                            <span className="text-xs">{event.favoriteCount}</span>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  // Fallback to most favorited events if no ratings exist
                  filteredData
                    .sort((a, b) => b.favoriteCount - a.favoriteCount)
                    .slice(0, 5)
                    .map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.attended} attendees</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                            <span className="font-semibold">{event.favoriteCount}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {event.registered} registered
                          </Badge>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </Card>
          </div>

          {/* Capacity Utilization */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Capacity Utilization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData
                .filter(e => e.capacity)
                .sort((a, b) => {
                  const aUtil = ((a.enrolled || 0) / (a.capacity || 1)) * 100;
                  const bUtil = ((b.enrolled || 0) / (b.capacity || 1)) * 100;
                  return bUtil - aUtil;
                })
                .slice(0, 6)
                .map((event) => {
                  const utilization = ((event.enrolled || 0) / (event.capacity || 1)) * 100;
                  return (
                    <div key={event.id} className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{event.enrolled || 0} / {event.capacity}</span>
                        <span className="font-semibold">{utilization.toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(utilization, 100)} className="h-2" />
                    </div>
                  );
                })}
            </div>
          </Card>
        </TabsContent>

        {/* Performance Analysis Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* High Performers */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-green-700 dark:text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold">High Performers</h3>
                  <p className="text-sm text-muted-foreground">≥80% attendance rate</p>
                </div>
              </div>
              <div className="space-y-3">
                {highPerformers.length > 0 ? (
                  highPerformers.slice(0, 8).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.attended}/{event.registered} attended</p>
                      </div>
                      <Badge variant="outline" className="text-green-700 border-green-700">
                        {event.attendanceRate.toFixed(0)}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No events with ≥80% attendance</p>
                )}
              </div>
            </Card>

            {/* Needs Improvement */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-orange-700 dark:text-orange-500" />
                <div>
                  <h3 className="text-lg font-semibold">Needs Improvement</h3>
                  <p className="text-sm text-muted-foreground">&lt;60% attendance rate</p>
                </div>
              </div>
              <div className="space-y-3">
                {needsImprovement.length > 0 ? (
                  needsImprovement.slice(0, 8).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.attended}/{event.registered} attended</p>
                      </div>
                      <Badge variant="outline" className="text-orange-700 border-orange-700">
                        {event.attendanceRate.toFixed(0)}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No events with &lt;60% attendance</p>
                )}
              </div>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
            <div className="space-y-3">
              {filteredData
                .sort((a, b) => b.favoriteCount - a.favoriteCount)
                .slice(0, 10)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.organizer}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        <span className="font-semibold text-sm">{event.favoriteCount}</span>
                      </div>
                      {event.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold text-sm">{event.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                      <Badge variant="secondary">{event.attended}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          {/* Feedback Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{allFeedback.length}</p>
              <p className="text-sm text-muted-foreground">Total Feedback Received</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <ThumbsUp className="h-5 w-5 text-green-700 dark:text-green-500" />
              </div>
              <p className="text-2xl font-bold">
                {allFeedback.filter((f) => f.overallRating >= 4).length}
              </p>
              <p className="text-sm text-muted-foreground">Positive Reviews (≥4 stars)</p>
              <Progress
                value={(allFeedback.filter((f) => f.overallRating >= 4).length / allFeedback.length) * 100}
                className="h-2 mt-2"
              />
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <ThumbsDown className="h-5 w-5 text-orange-700 dark:text-orange-500" />
              </div>
              <p className="text-2xl font-bold">
                {allFeedback.filter((f) => f.overallRating < 4).length}
              </p>
              <p className="text-sm text-muted-foreground">Needs Improvement (&lt;4 stars)</p>
              <Progress
                value={(allFeedback.filter((f) => f.overallRating < 4).length / allFeedback.length) * 100}
                className="h-2 mt-2"
              />
            </Card>
          </div>

          {/* Feedback Filter */}
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">Filter by:</p>
              <div className="flex gap-2">
                <Button
                  variant={feedbackFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFeedbackFilter('all')}
                >
                  All ({allFeedback.length})
                </Button>
                <Button
                  variant={feedbackFilter === 'positive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFeedbackFilter('positive')}
                  className={feedbackFilter === 'positive' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <ThumbsUp className="h-3 w-3 mr-1.5" />
                  Positive ({allFeedback.filter((f) => f.overallRating >= 4).length})
                </Button>
                <Button
                  variant={feedbackFilter === 'negative' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFeedbackFilter('negative')}
                  className={feedbackFilter === 'negative' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  <ThumbsDown className="h-3 w-3 mr-1.5" />
                  Needs Attention ({allFeedback.filter((f) => f.overallRating < 4).length})
                </Button>
              </div>
            </div>
          </Card>

          {/* Feedback Cards */}
          <div className="space-y-4">
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map((feedback, index) => (
                <Card key={index} className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{feedback.eventTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feedback.organizer} • Attended: {new Date(feedback.attendedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-amber-700">{feedback.overallRating.toFixed(1)}</span>
                        </div>
                        {feedback.wouldRecommend && (
                          <Badge variant="outline" className="text-green-700 border-green-700">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Content</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-semibold">{feedback.contentRating}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Organization</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-semibold">{feedback.organizationRating}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Speakers</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-semibold">{feedback.speakersRating}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Venue</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-semibold">{feedback.venueRating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Text */}
                    <div className="space-y-3">
                      {feedback.likedMost && (
                        <div>
                          <p className="text-sm font-semibold text-green-700 mb-1">What they liked most:</p>
                          <p className="text-sm text-muted-foreground bg-green-50 p-3 rounded-md">
                            &ldquo;{feedback.likedMost}&rdquo;
                          </p>
                        </div>
                      )}
                      {feedback.improvements && (
                        <div>
                          <p className="text-sm font-semibold text-orange-700 mb-1">Suggested improvements:</p>
                          <p className="text-sm text-muted-foreground bg-orange-50 p-3 rounded-md">
                            &ldquo;{feedback.improvements}&rdquo;
                          </p>
                        </div>
                      )}
                      {feedback.additionalComments && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Additional comments:</p>
                          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                            &ldquo;{feedback.additionalComments}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(feedback.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">No feedback found</p>
                <p className="text-sm text-muted-foreground">
                  {feedbackFilter === 'all'
                    ? 'No feedback has been submitted yet.'
                    : feedbackFilter === 'positive'
                      ? 'No positive feedback found.'
                      : 'No negative feedback found.'}
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Organizers Tab */}
        <TabsContent value="organizers" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Event Organizers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold">Organizer</th>
                    <th className="text-right p-3 font-semibold">Events</th>
                    <th className="text-right p-3 font-semibold">Total Registered</th>
                    <th className="text-right p-3 font-semibold">Total Attended</th>
                    <th className="text-right p-3 font-semibold">Avg Attendance</th>
                    <th className="text-right p-3 font-semibold">Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topOrganizers.map((org) => (
                    <tr key={org.organizer} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{org.organizer}</td>
                      <td className="p-3 text-right">
                        <Badge variant="secondary">{org.events}</Badge>
                      </td>
                      <td className="p-3 text-right font-semibold">{org.totalRegistered}</td>
                      <td className="p-3 text-right font-semibold">{org.totalAttended}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-medium">{org.avgAttendanceRate.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {org.avgRating > 0 ? (
                          <div className="flex items-center justify-end gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{org.avgRating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    <th className="text-left p-3 font-semibold">Event Title</th>
                    <th className="text-left p-3 font-semibold">Organizer</th>
                    <th className="text-right p-3 font-semibold">Registered</th>
                    <th className="text-right p-3 font-semibold">Attended</th>
                    <th className="text-right p-3 font-semibold">Attendance Rate</th>
                    <th className="text-right p-3 font-semibold">Avg Rating</th>
                    <th className="text-right p-3 font-semibold">Favorites</th>
                    <th className="text-right p-3 font-semibold">Capacity</th>
                    <th className="text-center p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{event.title}</td>
                      <td className="p-3 text-muted-foreground">{event.organizer}</td>
                      <td className="p-3 text-right font-semibold">{event.registered}</td>
                      <td className="p-3 text-right font-semibold">{event.attended}</td>
                      <td className="p-3 text-right">
                        <Badge
                          variant="outline"
                          className={
                            event.attendanceRate >= 80
                              ? "text-green-700 border-green-700"
                              : event.attendanceRate < 60
                                ? "text-orange-700 border-orange-700"
                                : ""
                          }
                        >
                          {event.attendanceRate.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        {event.averageRating > 0 ? (
                          <div className="flex items-center justify-end gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{event.averageRating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No ratings</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          <span className="font-medium">{event.favoriteCount}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right text-sm text-muted-foreground">
                        {event.capacity ? `${event.enrolled || 0} / ${event.capacity}` : 'Unlimited'}
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQrCodeEvent({ id: event.id, title: event.title })}
                          className="flex items-center gap-1"
                        >
                          <QrCode className="h-3 w-3" />
                          QR Code
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {qrCodeEvent && (
        <QRCodeDialog
          open={!!qrCodeEvent}
          onOpenChange={(open) => !open && setQrCodeEvent(null)}
          eventId={qrCodeEvent.id}
          eventTitle={qrCodeEvent.title}
        />
      )}
    </div>
  );
}


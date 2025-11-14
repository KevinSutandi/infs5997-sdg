'use client';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { EventFeedbackDialog } from './EventFeedbackDialog';
import { currentUser } from '@/data/mockData';
import { UserEvent, SDG_GOALS, EventFeedback } from '@/types';
import { Calendar, MapPin, Users, Star, MessageSquare, Award, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const FAVORITES_STORAGE_KEY = 'sdg-favorite-events';

export function MyEvents() {
  const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [favoriteEventIds, setFavoriteEventIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    }
    return new Set();
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteEventIds)));
    }
  }, [favoriteEventIds]);

  const events = currentUser.registeredEvents || [];

  // Sort upcoming events by date (ascending - closest first)
  const upcomingEvents = events
    .filter(e => e.status === 'registered')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Sort past events by date (descending - most recent first)
  const pastEvents = events
    .filter(e => e.status === 'attended' || e.status === 'cancelled')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  // Filter favorite events
  const favoriteEvents = events
    .filter(e => favoriteEventIds.has(e.id))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const toggleFavorite = (eventId: string) => {
    setFavoriteEventIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
        toast.success('Removed from favorites');
      } else {
        newSet.add(eventId);
        toast.success('Added to favorites');
      }
      return newSet;
    });
  };

  const isFavorite = (eventId: string) => favoriteEventIds.has(eventId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Group events by date
  const groupEventsByDate = (events: UserEvent[]) => {
    const grouped: { [key: string]: UserEvent[] } = {};

    events.forEach(event => {
      const dateKey = event.startDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  };

  const handleGiveFeedback = (event: UserEvent) => {
    setSelectedEvent(event);
    setIsFeedbackDialogOpen(true);
  };

  const handleFeedbackSubmit = (feedback: EventFeedback) => {
    if (!selectedEvent) return;

    // In a real app, this would update the backend
    console.log('Feedback submitted for event:', selectedEvent.id, feedback);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            My Events
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your registered events and track your attendance 📅
          </p>
        </div>
      </div>

      {/* Tabs for Upcoming, History, and Favorites */}
      <Card className="p-4 md:p-5 shadow-md">
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-4">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming
              <Badge variant="secondary" className="ml-1">
                {upcomingEvents.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              History
              <Badge variant="secondary" className="ml-1">
                {pastEvents.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
              <Badge variant="secondary" className="ml-1">
                {favoriteEvents.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupEventsByDate(upcomingEvents)).map(([date, dateEvents]) => {
                  const daysUntil = getDaysUntil(date);

                  return (
                    <div key={date} className="space-y-4">
                      {/* Date Section Header */}
                      <div className="flex items-center gap-3 pb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-base md:text-lg font-bold">{formatDateHeader(date)}</h2>
                            <div className="flex items-center gap-2 mt-1">
                              {daysUntil === 0 && (
                                <Badge className="bg-primary">Today</Badge>
                              )}
                              {daysUntil === 1 && (
                                <Badge variant="secondary" className="bg-green-500/20 text-green-700">Tomorrow</Badge>
                              )}
                              {daysUntil > 1 && daysUntil <= 7 && (
                                <Badge variant="outline" className="border-amber-500/30 text-amber-700">
                                  In {daysUntil} days
                                </Badge>
                              )}
                              {daysUntil > 7 && (
                                <Badge variant="outline">
                                  {formatDate(date)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Separator className="flex-1" />
                      </div>

                      {/* Events for this date */}
                      <div className="grid grid-cols-1 gap-3">
                        {dateEvents.map((event) => {
                          const isComingSoon = daysUntil <= 7 && daysUntil >= 0;

                          return (
                            <Card key={event.id} className="overflow-hidden  transition-all group border-l-4 border-l-green-500">
                              <div className="flex flex-col md:flex-row">
                                {/* Event Image */}
                                {event.imageUrl && (
                                  <div className="md:w-40 h-32 md:h-auto shrink-0 bg-muted relative overflow-hidden">
                                    <Image
                                      src={event.imageUrl}
                                      alt={event.title}
                                      className="w-full h-full object-cover transition-transform duration-300"
                                      width={160}
                                      height={120}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-black/0" />
                                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFavorite(event.id);
                                        }}
                                        className="p-1 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors shadow-md"
                                        aria-label={isFavorite(event.id) ? 'Remove from favorites' : 'Add to favorites'}
                                      >
                                        <Heart
                                          className={`h-3.5 w-3.5 ${isFavorite(event.id)
                                            ? 'fill-red-500 text-red-500'
                                            : 'text-muted-foreground'
                                            }`}
                                        />
                                      </button>
                                      {isComingSoon && (
                                        <Badge className="bg-amber-600 text-white border-0 shadow-lg text-xs px-1.5 py-0">
                                          Soon
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2">
                                      <Badge variant="secondary" className="flex items-center gap-1 bg-background/90 backdrop-blur-sm text-xs px-1.5 py-0">
                                        <Award className="h-3 w-3 text-amber-600" />
                                        <span className="font-semibold">{event.points}</span>
                                      </Badge>
                                    </div>
                                  </div>
                                )}

                                {/* Event Details */}
                                <div className="flex-1 p-4 space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-base font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">{event.title}</h3>
                                      <p className="text-xs text-muted-foreground line-clamp-1">
                                        {event.description}
                                      </p>
                                    </div>
                                  </div>

                                  {/* SDG Goals and Info Row */}
                                  <div className="flex items-center gap-3 flex-wrap">
                                    {/* SDG Goals */}
                                    <div className="flex flex-wrap gap-1">
                                      {[...event.sdgGoals].sort((a, b) => a - b).map((sdgNumber) => {
                                        const goal = SDG_GOALS.find((g) => g.number === sdgNumber);
                                        return (
                                          <TooltipProvider key={sdgNumber}>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <div
                                                  className="h-5 w-5 rounded flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm hover:scale-110 transition-transform cursor-help"
                                                  style={{ backgroundColor: goal?.color }}
                                                >
                                                  {sdgNumber}
                                                </div>
                                              </TooltipTrigger>
                                              <TooltipContent
                                                className="border-0"
                                                style={{ backgroundColor: goal?.color }}
                                                arrowStyle={{ backgroundColor: goal?.color, fill: goal?.color }}
                                              >
                                                <p className="text-xs font-medium text-white">SDG {sdgNumber}: {goal?.name}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        );
                                      })}
                                    </div>

                                    {/* Event Info - Compact */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span>{event.location}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3 shrink-0" />
                                        <span>{event.organizer}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center shadow-md">
                <div className="bg-muted/30 rounded-full h-16 w-16 mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">No Upcoming Events</h3>
                <p className="text-xs text-muted-foreground">
                  Register for events from the Activities page to see them here
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Past Events / History */}
          <TabsContent value="history" className="space-y-6">
            {pastEvents.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupEventsByDate(pastEvents)).map(([date, dateEvents]) => (
                  <div key={date} className="space-y-4">
                    {/* Date Section Header */}
                    <div className="flex items-center gap-3 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                          <Award className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-muted-foreground">{formatDateHeader(date)}</h2>
                          <Badge variant="outline" className="mt-1">
                            {formatDate(date)}
                          </Badge>
                        </div>
                      </div>
                      <Separator className="flex-1" />
                    </div>

                    {/* Events for this date */}
                    <div className="grid grid-cols-1 gap-3">
                      {dateEvents.map((event) => (
                        <Card key={event.id} className={`overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all group border-l-4 ${event.status === 'attended' ? 'border-l-green-500' : 'border-l-gray-400'
                          }`}>
                          <div className="flex flex-col md:flex-row">

                            {/* Event Details */}
                            <div className="flex-1 p-4 space-y-3">
                              <div>
                                <div className='flex items-center gap-3 mb-1.5'>
                                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                                  <Badge
                                    variant={event.status === 'attended' ? 'default' : 'secondary'}
                                    className={event.status === 'attended' ? 'bg-green-600' : ''}
                                  >
                                    {event.status === 'attended' ? '✓ Attended' : 'Cancelled'}
                                  </Badge>
                                  <Badge className="flex items-center gap-1 bg-green-600 text-white border-0 shadow">
                                    <Award className="h-3 w-3" />
                                    <span className="font-semibold">+{event.points} pts earned</span>
                                  </Badge>
                                </div>

                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {event.description}
                                </p>
                              </div>

                              {/* SDG Goals */}
                              <div className="flex flex-wrap gap-1">
                                {[...event.sdgGoals].sort((a, b) => a - b).map((sdgNumber) => {
                                  const goal = SDG_GOALS.find((g) => g.number === sdgNumber);
                                  return (
                                    <TooltipProvider key={sdgNumber}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div
                                            className="h-5 w-5 rounded flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm hover:scale-110 transition-transform cursor-help"
                                            style={{ backgroundColor: goal?.color }}
                                          >
                                            {sdgNumber}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          className="border-0"
                                          style={{ backgroundColor: goal?.color }}
                                          arrowStyle={{ backgroundColor: goal?.color, fill: goal?.color }}
                                        >
                                          <p className="text-xs font-medium text-white">SDG {sdgNumber}: {goal?.name}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  );
                                })}
                              </div>

                              {/* Event Info */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                                  <span className="">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Users className="h-3.5 w-3.5 shrink-0" />
                                  <span className="">{event.organizer}</span>
                                </div>
                                <Badge className="flex items-center gap-1 bg-green-600 text-white border-0 shadow text-xs">
                                  <Award className="h-3 w-3" />
                                  <span className="font-semibold">+{event.points} pts earned</span>
                                </Badge>
                              </div>

                              {/* Feedback Section */}
                              {event.status === 'attended' && (
                                <div className="pt-3 border-t space-y-3">
                                  {event.feedback ? (
                                    <Card className="p-3 bg-muted/30 border-2">
                                      <div className="space-y-3">
                                        {/* Overall Rating */}
                                        <div className="flex items-center justify-between pb-2 border-b">
                                          <div className="flex items-center gap-3">
                                            <div className="flex">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                  key={star}
                                                  className={`h-4 w-4 ${star <= event.feedback!.overallRating
                                                    ? 'fill-amber-500 text-amber-500'
                                                    : 'text-gray-300'
                                                    }`}
                                                />
                                              ))}
                                            </div>
                                            <span className="text-xs font-semibold">
                                              Overall Rating
                                            </span>
                                          </div>
                                          {event.feedback.wouldRecommend ? (
                                            <Badge className="flex items-center gap-1 bg-green-600">
                                              <ThumbsUp className="h-3 w-3" />
                                              Recommended
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="flex items-center gap-1 border-red-300 text-red-600">
                                              <ThumbsDown className="h-3 w-3" />
                                              Not Recommended
                                            </Badge>
                                          )}
                                        </div>

                                        {/* Category Ratings */}
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-background/50">
                                            <span className="text-muted-foreground font-medium">Content</span>
                                            <div className="flex">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                  key={star}
                                                  className={`h-3 w-3 ${star <= event.feedback!.contentRating
                                                    ? 'fill-amber-500 text-amber-500'
                                                    : 'text-gray-300'
                                                    }`}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-background/50">
                                            <span className="text-muted-foreground font-medium">Organization</span>
                                            <div className="flex">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                  key={star}
                                                  className={`h-3 w-3 ${star <= event.feedback!.organizationRating
                                                    ? 'fill-amber-500 text-amber-500'
                                                    : 'text-gray-300'
                                                    }`}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-background/50">
                                            <span className="text-muted-foreground font-medium">Speakers</span>
                                            <div className="flex">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                  key={star}
                                                  className={`h-3 w-3 ${star <= event.feedback!.speakersRating
                                                    ? 'fill-amber-500 text-amber-500'
                                                    : 'text-gray-300'
                                                    }`}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-background/50">
                                            <span className="text-muted-foreground font-medium">Venue</span>
                                            <div className="flex">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                  key={star}
                                                  className={`h-3 w-3 ${star <= event.feedback!.venueRating
                                                    ? 'fill-amber-500 text-amber-500'
                                                    : 'text-gray-300'
                                                    }`}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Feedback Text */}
                                        <div className="space-y-2 pt-2 border-t">
                                          <div>
                                            <p className="text-xs font-semibold text-muted-foreground mb-1">Liked Most</p>
                                            <p className="text-xs bg-background/50 p-1.5 rounded-lg italic">
                                              &quot;{event.feedback.likedMost}&quot;
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-xs font-semibold text-muted-foreground mb-1">Improvements</p>
                                            <p className="text-xs bg-background/50 p-1.5 rounded-lg italic">
                                              &quot;{event.feedback.improvements}&quot;
                                            </p>
                                          </div>
                                          {event.feedback.additionalComments && (
                                            <div>
                                              <p className="text-xs font-semibold text-muted-foreground mb-1">Additional Comments</p>
                                              <p className="text-xs bg-background/50 p-1.5 rounded-lg italic">
                                                &quot;{event.feedback.additionalComments}&quot;
                                              </p>
                                            </div>
                                          )}
                                        </div>

                                        <p className="text-xs text-muted-foreground pt-2 border-t">
                                          Submitted on {formatDate(event.feedback.submittedDate)}
                                        </p>
                                      </div>
                                    </Card>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleGiveFeedback(event)}
                                      className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                                    >
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Give Feedback
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center shadow-md">
                <div className="bg-muted/30 rounded-full h-16 w-16 mx-auto mb-3 flex items-center justify-center">
                  <Award className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2">No Past Events</h3>
                <p className="text-xs text-muted-foreground">
                  Your attended events will appear here
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            {favoriteEvents.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupEventsByDate(favoriteEvents)).map(([date, dateEvents]) => {
                  const daysUntil = getDaysUntil(date);
                  const isPast = daysUntil < 0;

                  return (
                    <div key={date} className="space-y-4">
                      {/* Date Section Header */}
                      <div className="flex items-center gap-3 pb-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isPast ? 'bg-muted' : 'bg-red-500/10'
                            }`}>
                            <Heart className={`h-4 w-4 ${isPast ? 'text-muted-foreground' : 'text-red-600 fill-red-600'}`} />
                          </div>
                          <div>
                            <h2 className={`text-lg font-bold ${isPast ? 'text-muted-foreground' : 'text-primary'}`}>
                              {formatDateHeader(date)}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                              {!isPast && daysUntil === 0 && (
                                <Badge className="bg-primary">Today</Badge>
                              )}
                              {!isPast && daysUntil === 1 && (
                                <Badge variant="secondary" className="bg-green-500/20 text-green-700">Tomorrow</Badge>
                              )}
                              {!isPast && daysUntil > 1 && daysUntil <= 7 && (
                                <Badge variant="outline" className="border-amber-500/30 text-amber-700">
                                  In {daysUntil} days
                                </Badge>
                              )}
                              {isPast && (
                                <Badge variant="outline">Past Event</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Separator className="flex-1" />
                      </div>

                      {/* Events for this date */}
                      <div className="grid grid-cols-1 gap-3">
                        {dateEvents.map((event) => {
                          const isComingSoon = daysUntil <= 7 && daysUntil >= 0;

                          return (
                            <Card key={event.id} className={`overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all group border-l-4 ${event.status === 'attended' ? 'border-l-green-500' :
                              event.status === 'cancelled' ? 'border-l-gray-400' :
                                'border-l-red-500'
                              }`}>
                              <div className="flex flex-col md:flex-row">
                                {/* Event Image */}
                                {event.imageUrl && (
                                  <div className={`md:w-48 h-40 md:h-auto shrink-0 bg-muted relative overflow-hidden ${isPast ? 'opacity-60' : ''}`}>
                                    <Image
                                      src={event.imageUrl}
                                      alt={event.title}
                                      className={`w-full h-full object-cover transition-transform duration-300 ${isPast ? 'grayscale' : 'group-hover:scale-105'}`}
                                      width={160}
                                      height={120}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-black/0" />
                                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFavorite(event.id);
                                        }}
                                        className="p-1 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors shadow-md"
                                        aria-label="Remove from favorites"
                                      >
                                        <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                                      </button>
                                      {event.status === 'attended' && (
                                        <Badge variant="default" className="bg-green-600 text-xs">✓ Attended</Badge>
                                      )}
                                      {event.status === 'cancelled' && (
                                        <Badge variant="secondary" className="text-xs">Cancelled</Badge>
                                      )}
                                      {event.status === 'registered' && isComingSoon && (
                                        <Badge className="bg-amber-600 text-white border-0 shadow-lg text-xs">
                                          Coming Soon
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2">
                                      {event.status === 'attended' ? (
                                        <Badge className="flex items-center gap-1 bg-green-600 text-white border-0 shadow-lg text-xs">
                                          <Award className="h-3 w-3" />
                                          <span className="font-semibold">+{event.points} pts earned</span>
                                        </Badge>
                                      ) : (
                                        <Badge variant="secondary" className="flex items-center gap-1 bg-background/90 backdrop-blur-sm text-xs">
                                          <Award className="h-3 w-3 text-amber-600" />
                                          <span className="font-semibold">{event.points} pts</span>
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Event Details */}
                                <div className="flex-1 p-4 space-y-3">
                                  <div>
                                    <h3 className="text-lg font-bold mb-1.5 group-hover:text-primary transition-colors">{event.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {event.description}
                                    </p>
                                  </div>

                                  {/* SDG Goals */}
                                  <div className="flex flex-wrap gap-1">
                                    {[...event.sdgGoals].sort((a, b) => a - b).map((sdgNumber) => {
                                      const goal = SDG_GOALS.find((g) => g.number === sdgNumber);
                                      return (
                                        <TooltipProvider key={sdgNumber}>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <div
                                                className="h-5 w-5 rounded flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm hover:scale-110 transition-transform cursor-help"
                                                style={{ backgroundColor: goal?.color }}
                                              >
                                                {sdgNumber}
                                              </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              className="border-0"
                                              style={{ backgroundColor: goal?.color }}
                                              arrowStyle={{ backgroundColor: goal?.color, fill: goal?.color }}
                                            >
                                              <p className="text-xs font-medium text-white">SDG {sdgNumber}: {goal?.name}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      );
                                    })}
                                  </div>

                                  {/* Event Info */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                                      <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                      <Users className="h-3.5 w-3.5 shrink-0" />
                                      <span className="truncate">{event.organizer}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center shadow-md">
                <div className="bg-muted/30 rounded-full h-16 w-16 mx-auto mb-3 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">No Favorite Events</h3>
                <p className="text-xs text-muted-foreground">
                  Click the heart icon on any event to add it to your favorites
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Feedback Dialog */}
      <EventFeedbackDialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
        eventTitle={selectedEvent?.title || ''}
        onSubmit={handleFeedbackSubmit}
      />
    </div >
  );
}

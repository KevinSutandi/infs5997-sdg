'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAvailableActivities } from '@/lib/adminAnalytics';
import { getAllRegisteredEvents } from '@/lib/adminAnalytics';
import { toast } from 'sonner';
import { currentUser } from '@/data/mockData';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EventCheckInPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Compute event and user event status
  const { event, userEvent, canCheckIn } = useMemo(() => {
    if (!eventId) {
      return { event: null, userEvent: null, canCheckIn: false };
    }

    const activities = getAvailableActivities();
    const foundEvent = activities.find(a => a.id === eventId && a.category === 'event');

    if (!foundEvent) {
      return { event: null, userEvent: null, canCheckIn: false };
    }

    const registeredEvents = getAllRegisteredEvents();
    const foundUserEvent = registeredEvents.find(e => e.activityId === eventId && e.studentId === currentUser.id);

    // Can check in if: registered, not already attended, and event hasn't passed
    const isRegistered = foundUserEvent?.status === 'registered';
    const notAttended = foundUserEvent?.status !== 'attended';
    const eventDate = new Date(foundEvent.startDate);
    const now = new Date();
    const eventNotPassed = eventDate >= now || Math.abs(eventDate.getTime() - now.getTime()) < 24 * 60 * 60 * 1000; // Allow check-in on event day or within 24 hours

    return {
      event: foundEvent,
      userEvent: foundUserEvent,
      canCheckIn: isRegistered && notAttended && eventNotPassed,
    };
  }, [eventId]);

  useEffect(() => {
    if (!event) {
      setTimeout(() => toast.error('Event not found'), 0);
    }
  }, [event]);

  const handleCheckIn = async () => {
    if (!event || !canCheckIn) return;

    setIsCheckingIn(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the user's registered event status
      if (typeof window !== 'undefined' && currentUser.registeredEvents) {
        const updatedEvents = currentUser.registeredEvents.map(event => {
          if (event.activityId === eventId) {
            return {
              ...event,
              status: 'attended' as const,
              attendedDate: new Date().toISOString(),
            };
          }
          return event;
        });

        // Update currentUser
        currentUser.registeredEvents = updatedEvents;

        // Save to localStorage
        const userData = localStorage.getItem('sdg-platform-signup');
        if (userData) {
          localStorage.setItem('sdg-user-events', JSON.stringify(updatedEvents));
        }

        toast.success(`Successfully checked in to ${event.title}!`);

        // Redirect to feedback page after a short delay
        setTimeout(() => {
          router.push(`/events/${eventId}/feedback`);
        }, 1500);
      } else {
        toast.error('You must be registered for this event to check in');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error('Failed to check in. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-muted-foreground">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  const isAlreadyAttended = userEvent?.status === 'attended';
  const isNotRegistered = !userEvent || userEvent.status === 'cancelled';

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-[#FFE600]/5 to-background p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <Card className="p-6 md:p-8">
          <div className="text-center space-y-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Event Check-In</h1>
            <h2 className="text-xl font-semibold text-primary">{event.title}</h2>
            {event.organizer && (
              <p className="text-muted-foreground">Organized by {event.organizer}</p>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-3 mb-6 p-4 bg-muted/30 rounded-lg">
            {event.location && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{event.location}</span>
              </div>
            )}
            {event.startDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {new Date(event.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            {event.points && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Points:</span>
                <Badge variant="secondary" className="font-semibold">
                  {event.points} SDG points
                </Badge>
              </div>
            )}
          </div>

          {/* Check-In Status */}
          {isAlreadyAttended ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Already Checked In</h3>
              <p className="text-muted-foreground mb-4">
                You&apos;ve already checked in to this event.
                {userEvent?.attendedDate && (
                  <span className="block mt-2 text-sm">
                    Checked in on {new Date(userEvent.attendedDate).toLocaleDateString()}
                  </span>
                )}
              </p>
              <Button
                onClick={() => router.push(`/events/${eventId}/feedback`)}
                variant="outline"
              >
                Provide Feedback
              </Button>
            </div>
          ) : isNotRegistered ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                  <XCircle className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Not Registered</h3>
              <p className="text-muted-foreground mb-4">
                You must be registered for this event to check in.
              </p>
              <Button
                onClick={() => router.push('/events')}
                variant="outline"
              >
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-6">
                Confirm your attendance at this event. You&apos;ll earn {event.points} SDG points upon check-in.
              </p>
              <Button
                onClick={handleCheckIn}
                disabled={isCheckingIn || !canCheckIn}
                size="lg"
                className="px-8"
              >
                {isCheckingIn ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Checking In...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Check In
                  </>
                )}
              </Button>
              {!canCheckIn && (
                <p className="text-sm text-muted-foreground mt-4">
                  Check-in is only available for registered events on or near the event date.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}


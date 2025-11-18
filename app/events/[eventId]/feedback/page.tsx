'use client';

import { useParams } from 'next/navigation';
import { EventFeedbackDialog } from '@/components/EventFeedbackDialog';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getAvailableActivities } from '@/lib/adminAnalytics';
import { AvailableActivity } from '@/types';
import { toast } from 'sonner';
import { getAllRegisteredEvents } from '@/lib/adminAnalytics';
import { currentUser } from '@/data/mockData';
import { EventFeedback } from '@/types';

export default function EventFeedbackPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const [event, setEvent] = useState<AvailableActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    // Find the event
    const activities = getAvailableActivities();
    const foundEvent = activities.find(a => a.id === eventId && a.category === 'event');

    if (foundEvent) {
      setEvent(foundEvent);

      // Check if user has already submitted feedback
      const registeredEvents = getAllRegisteredEvents();
      const userEvent = registeredEvents.find(e => e.activityId === eventId);
      if (userEvent?.feedback) {
        setHasSubmitted(true);
      } else if (userEvent?.status === 'attended') {
        setShowFeedbackDialog(true);
      }
    } else {
      toast.error('Event not found');
    }

    setIsLoading(false);
  }, [eventId]);

  const handleFeedbackSubmit = (feedback: EventFeedback) => {
    if (!eventId) return;

    // Update the user's registered events with feedback
    if (typeof window !== 'undefined' && currentUser.registeredEvents) {
      const updatedEvents = currentUser.registeredEvents.map(event => {
        if (event.activityId === eventId) {
          return {
            ...event,
            status: 'attended' as const,
            attendedDate: new Date().toISOString(),
            feedback: feedback,
          };
        }
        return event;
      });

      // Update currentUser
      currentUser.registeredEvents = updatedEvents;

      // Save to localStorage if there's a storage mechanism
      // In a real app, this would be an API call
      const userData = localStorage.getItem('sdg-platform-signup');
      if (userData) {
        // Store updated events (in real app, this would be handled by backend)
        localStorage.setItem('sdg-user-events', JSON.stringify(updatedEvents));
      }

      setHasSubmitted(true);
      setShowFeedbackDialog(false);
      toast.success('Thank you for your feedback!');
    } else {
      toast.error('You must be registered for this event to provide feedback');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-muted-foreground">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-[#FFE600]/5 to-background p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <Card className="p-6 md:p-8">
          <div className="text-center space-y-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Event Feedback</h1>
            <h2 className="text-xl font-semibold text-primary">{event.title}</h2>
            {event.organizer && (
              <p className="text-muted-foreground">Organized by {event.organizer}</p>
            )}
          </div>

          {hasSubmitted ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                Your feedback has been submitted successfully. We appreciate your input!
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-6">
                Please provide your feedback about this event. Your input helps us improve future events.
              </p>
              <button
                onClick={() => setShowFeedbackDialog(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Provide Feedback
              </button>
            </div>
          )}
        </Card>
      </div>

      {event && showFeedbackDialog && !hasSubmitted && (
        <EventFeedbackDialog
          open={showFeedbackDialog}
          onOpenChange={setShowFeedbackDialog}
          eventTitle={event.title}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}


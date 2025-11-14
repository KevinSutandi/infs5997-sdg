import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { EventFeedback } from '@/types';

interface EventFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  onSubmit: (feedback: EventFeedback) => void;
}

interface StarRatingProps {
  value: number;
  hovered: number;
  onChange: (value: number) => void;
  onHover: (value: number) => void;
  onLeave: () => void;
}

function StarRating({
  value,
  hovered,
  onChange,
  onHover,
  onLeave
}: StarRatingProps) {
  const displayValue = hovered > 0 ? hovered : value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onLeave}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${star} out of 5`}
        >
          <Star
            className={`h-6 w-6 transition-colors ${star <= displayValue
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
              }`}
          />
        </button>
      ))}
    </div>
  );
}

export function EventFeedbackDialog({
  open,
  onOpenChange,
  eventTitle,
  onSubmit
}: EventFeedbackDialogProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [hoveredOverall, setHoveredOverall] = useState(0);
  const [contentRating, setContentRating] = useState(0);
  const [hoveredContent, setHoveredContent] = useState(0);
  const [organizationRating, setOrganizationRating] = useState(0);
  const [hoveredOrganization, setHoveredOrganization] = useState(0);
  const [speakersRating, setSpeakersRating] = useState(0);
  const [hoveredSpeakers, setHoveredSpeakers] = useState(0);
  const [venueRating, setVenueRating] = useState(0);
  const [hoveredVenue, setHoveredVenue] = useState(0);
  const [likedMost, setLikedMost] = useState('');
  const [improvements, setImprovements] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<string>('');
  const [additionalComments, setAdditionalComments] = useState('');

  const handleSubmit = () => {
    // Validation
    if (overallRating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    if (contentRating === 0 || organizationRating === 0 || speakersRating === 0 || venueRating === 0) {
      toast.error('Please rate all aspects of the event');
      return;
    }

    if (likedMost.trim().length < 10) {
      toast.error('Please share what you liked most (at least 10 characters)');
      return;
    }

    if (improvements.trim().length < 10) {
      toast.error('Please share suggestions for improvement (at least 10 characters)');
      return;
    }

    if (!wouldRecommend) {
      toast.error('Please indicate if you would recommend this event');
      return;
    }

    const feedback: EventFeedback = {
      overallRating,
      contentRating,
      organizationRating,
      speakersRating,
      venueRating,
      likedMost: likedMost.trim(),
      improvements: improvements.trim(),
      wouldRecommend: wouldRecommend === 'yes',
      additionalComments: additionalComments.trim(),
      submittedDate: new Date().toISOString()
    };

    onSubmit(feedback);

    // Reset form
    resetForm();
    onOpenChange(false);

    toast.success('Feedback Submitted!', {
      description: 'Thank you for your detailed feedback. It helps us improve future events.'
    });
  };

  const resetForm = () => {
    setOverallRating(0);
    setHoveredOverall(0);
    setContentRating(0);
    setHoveredContent(0);
    setOrganizationRating(0);
    setHoveredOrganization(0);
    setSpeakersRating(0);
    setHoveredSpeakers(0);
    setVenueRating(0);
    setHoveredVenue(0);
    setLikedMost('');
    setImprovements('');
    setWouldRecommend('');
    setAdditionalComments('');
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const getRatingLabel = (rating: number) => {
    if (rating === 0) return '';
    if (rating === 1) return 'Poor';
    if (rating === 2) return 'Fair';
    if (rating === 3) return 'Good';
    if (rating === 4) return 'Very Good';
    return 'Excellent';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Event Feedback</DialogTitle>
          <DialogDescription>
            Help us improve future events by sharing your detailed feedback about: <strong>{eventTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Overall Rating */}
            <div className="space-y-2">
              <Label className="text-base">Overall Experience *</Label>
              <p className="text-sm text-muted-foreground">How would you rate this event overall?</p>
              <StarRating
                value={overallRating}
                hovered={hoveredOverall}
                onChange={setOverallRating}
                onHover={setHoveredOverall}
                onLeave={() => setHoveredOverall(0)}
              />
              {overallRating > 0 && (
                <p className="text-sm text-muted-foreground">
                  {getRatingLabel(overallRating)}
                </p>
              )}
            </div>

            <Separator />

            {/* Category Ratings */}
            <div className="space-y-4">
              <h3 className="text-base">Rate Specific Aspects *</h3>

              {/* Content Quality */}
              <div className="space-y-2">
                <Label>Content Quality</Label>
                <p className="text-sm text-muted-foreground">Relevance, depth, and value of the content</p>
                <StarRating
                  value={contentRating}
                  hovered={hoveredContent}
                  onChange={setContentRating}
                  onHover={setHoveredContent}
                  onLeave={() => setHoveredContent(0)}
                />
                {contentRating > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {getRatingLabel(contentRating)}
                  </p>
                )}
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label>Organization & Logistics</Label>
                <p className="text-sm text-muted-foreground">Registration, timing, and event flow</p>
                <StarRating
                  value={organizationRating}
                  hovered={hoveredOrganization}
                  onChange={setOrganizationRating}
                  onHover={setHoveredOrganization}
                  onLeave={() => setHoveredOrganization(0)}
                />
                {organizationRating > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {getRatingLabel(organizationRating)}
                  </p>
                )}
              </div>

              {/* Speakers/Facilitators */}
              <div className="space-y-2">
                <Label>Speakers/Facilitators</Label>
                <p className="text-sm text-muted-foreground">Knowledge, presentation skills, and engagement</p>
                <StarRating
                  value={speakersRating}
                  hovered={hoveredSpeakers}
                  onChange={setSpeakersRating}
                  onHover={setHoveredSpeakers}
                  onLeave={() => setHoveredSpeakers(0)}
                />
                {speakersRating > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {getRatingLabel(speakersRating)}
                  </p>
                )}
              </div>

              {/* Venue/Location */}
              <div className="space-y-2">
                <Label>Venue & Facilities</Label>
                <p className="text-sm text-muted-foreground">Comfort, accessibility, and amenities</p>
                <StarRating
                  value={venueRating}
                  hovered={hoveredVenue}
                  onChange={setVenueRating}
                  onHover={setHoveredVenue}
                  onLeave={() => setHoveredVenue(0)}
                />
                {venueRating > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {getRatingLabel(venueRating)}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* What You Liked Most */}
            <div className="space-y-2">
              <Label htmlFor="liked">What did you like most about this event? *</Label>
              <Textarea
                id="liked"
                placeholder="Share the highlights and what stood out positively... (minimum 10 characters)"
                value={likedMost}
                onChange={(e) => setLikedMost(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {likedMost.length} characters
              </p>
            </div>

            {/* Improvements */}
            <div className="space-y-2">
              <Label htmlFor="improvements">What could be improved? *</Label>
              <Textarea
                id="improvements"
                placeholder="Share constructive suggestions for future events... (minimum 10 characters)"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {improvements.length} characters
              </p>
            </div>

            {/* Would Recommend */}
            <div className="space-y-3">
              <Label>Would you recommend this event to others? *</Label>
              <RadioGroup value={wouldRecommend} onValueChange={setWouldRecommend}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="recommend-yes" />
                  <Label htmlFor="recommend-yes" className="flex items-center gap-2 cursor-pointer">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    Yes, I would recommend it
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="recommend-no" />
                  <Label htmlFor="recommend-no" className="flex items-center gap-2 cursor-pointer">
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                    No, I would not recommend it
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Additional Comments */}
            <div className="space-y-2">
              <Label htmlFor="additional">Additional Comments (Optional)</Label>
              <Textarea
                id="additional"
                placeholder="Any other thoughts or feedback you'd like to share..."
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {additionalComments.length} characters
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

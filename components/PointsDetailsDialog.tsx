import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { SDGActivity, SDG_GOALS } from '@/types';
import { Calendar, Award } from 'lucide-react';

interface PointsDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: 'coursework' | 'society' | 'event';
  activities: SDGActivity[];
}

export function PointsDetailsDialog({
  open,
  onOpenChange,
  category,
  activities
}: PointsDetailsDialogProps) {
  const categoryActivities = activities.filter(a => a.category === category);
  const totalPoints = categoryActivities.reduce((sum, a) => sum + a.points, 0);

  const getCategoryInfo = () => {
    switch (category) {
      case 'coursework':
        return {
          title: 'Coursework Activities',
          color: 'text-blue-600',
          bgColor: 'bg-blue-500/10'
        };
      case 'society':
        return {
          title: 'Society Activities',
          color: 'text-purple-600',
          bgColor: 'bg-purple-500/10'
        };
      case 'event':
        return {
          title: 'Event Activities',
          color: 'text-green-600',
          bgColor: 'bg-green-500/10'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categoryInfo = getCategoryInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={categoryInfo.color}>{categoryInfo.title}</span>
          </DialogTitle>
          <DialogDescription>
            {categoryActivities.length} {categoryActivities.length === 1 ? 'activity' : 'activities'}
            {' • '}
            <span className={categoryInfo.color}>{totalPoints} points</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(80vh-140px)] pr-4">
          <div className="space-y-3">
            {categoryActivities.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No activities in this category yet
                </p>
              </Card>
            ) : (
              categoryActivities.map((activity) => (
                <Card key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="mb-1">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {activity.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(activity.date)}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${categoryInfo.color}`}>
                          <Award className="h-3.5 w-3.5" />
                          <span>{activity.points} points</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {activity.sdgGoals.map(goalNum => {
                          const goal = SDG_GOALS.find(g => g.number === goalNum);
                          return goal ? (
                            <Badge
                              key={goalNum}
                              variant="outline"
                              className="text-xs"
                              style={{ borderColor: goal.color, color: goal.color }}
                            >
                              {goalNum}. {goal.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

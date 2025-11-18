import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Target, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { SDG_GOALS } from '@/types';
import { cn } from '@/lib/utils';

interface SDGSurveyDialogProps {
  open: boolean;
  onSubmit: (data: SDGSurveyData) => void;
}

export interface SDGSurveyData {
  favoriteSDGs: number[];
  interestedSDGs: number[];
}

const SURVEY_STORAGE_KEY = 'sdg-platform-survey';

export function SDGSurveyDialog({ open, onSubmit }: SDGSurveyDialogProps) {
  const [favoriteSDGs, setFavoriteSDGs] = useState<number[]>([]);
  const [interestedSDGs, setInterestedSDGs] = useState<number[]>([]);

  const handleFavoriteSDGToggle = (sdgNumber: number) => {
    if (favoriteSDGs.includes(sdgNumber)) {
      setFavoriteSDGs(favoriteSDGs.filter(n => n !== sdgNumber));
    } else {
      setFavoriteSDGs([...favoriteSDGs, sdgNumber]);
    }
  };

  const handleSDGToggle = (sdgNumber: number) => {
    if (interestedSDGs.includes(sdgNumber)) {
      setInterestedSDGs(interestedSDGs.filter(n => n !== sdgNumber));
    } else {
      setInterestedSDGs([...interestedSDGs, sdgNumber]);
    }
  };

  const handleSubmit = () => {
    const surveyData: SDGSurveyData = {
      favoriteSDGs,
      interestedSDGs,
    };

    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify({
        ...surveyData,
        timestamp: new Date().toISOString(),
      }));
    }

    onSubmit(surveyData);
  };

  const handleSkip = () => {
    const surveyData: SDGSurveyData = {
      favoriteSDGs: [],
      interestedSDGs: [],
    };

    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify({
        ...surveyData,
        timestamp: new Date().toISOString(),
      }));
    }

    onSubmit(surveyData);
  };

  return (
    <Dialog open={open} onOpenChange={() => { }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader className="space-y-6 pb-2">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
            </div>
          </div>
          <div>
            <DialogTitle className="text-center text-3xl font-bold mb-3">Tell Us About Your SDG Interests</DialogTitle>
            <DialogDescription className="text-center text-base px-4">
              Help us personalize your experience by sharing which Sustainable Development Goals interest you most
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Favorite SDGs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <span>Which SDGs interest you most?</span>
              </Label>
              {favoriteSDGs.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {favoriteSDGs.length} selected
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground pl-10">
              Optional - Select as many as you&apos;d like
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2">
              {SDG_GOALS.map((sdg) => {
                const isSelected = favoriteSDGs.includes(sdg.number);
                return (
                  <Card
                    key={sdg.number}
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-transparent hover:border-muted-foreground/20"
                    )}
                    onClick={() => handleFavoriteSDGToggle(sdg.number)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`favorite-sdg-${sdg.number}`}
                        checked={isSelected}
                        onCheckedChange={() => handleFavoriteSDGToggle(sdg.number)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                          style={{ backgroundColor: sdg.color }}
                        >
                          {sdg.number}
                        </div>
                        <Label
                          htmlFor={`favorite-sdg-${sdg.number}`}
                          className="text-sm font-medium cursor-pointer leading-tight flex-1"
                        >
                          {sdg.name}
                        </Label>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Interested SDGs */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Want to see more activities for?</span>
              </Label>
              {interestedSDGs.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {interestedSDGs.length} selected
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground pl-10">
              Optional - Help us know what you&apos;d like more of
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2">
              {SDG_GOALS.map((sdg) => {
                const isSelected = interestedSDGs.includes(sdg.number);
                return (
                  <Card
                    key={sdg.number}
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-transparent hover:border-muted-foreground/20"
                    )}
                    onClick={() => handleSDGToggle(sdg.number)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`interested-sdg-${sdg.number}`}
                        checked={isSelected}
                        onCheckedChange={() => handleSDGToggle(sdg.number)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                          style={{ backgroundColor: sdg.color }}
                        >
                          {sdg.number}
                        </div>
                        <Label
                          htmlFor={`interested-sdg-${sdg.number}`}
                          className="text-sm font-medium cursor-pointer leading-tight flex-1"
                        >
                          {sdg.name}
                        </Label>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-5 bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Personalized Experience</p>
                <p className="text-sm text-muted-foreground">
                  Your preferences help us recommend relevant activities and events. You can always update these in your settings later.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 pt-2">
          <Button variant="outline" onClick={handleSkip} className="w-full sm:w-auto order-2 sm:order-1">
            Skip for Now
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:flex-1 order-1 sm:order-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


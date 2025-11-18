import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { Shield, TrendingUp, Users, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface ConsentDialogProps {
  onConsent: (preferences: ConsentPreferences) => void;
}

export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
}

const DEMO_MODE_STORAGE_KEY = 'sdg-demo-mode-signed-in';

export function ConsentDialog({ onConsent }: ConsentDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: true,
    personalization: true,
  });

  const setDemoModeToSignedIn = () => {
    // Automatically toggle to signed-in mode after consent
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
      // Reload page to ensure all components update to signed-in mode
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      personalization: true,
    };
    onConsent(allPreferences);
    setIsOpen(false);
    setDemoModeToSignedIn();
  };

  const handleAcceptSelected = () => {
    onConsent(preferences);
    setIsOpen(false);
    setDemoModeToSignedIn();
  };

  const handleDecline = () => {
    const minimalPreferences = {
      essential: true,
      analytics: false,
      personalization: false,
    };
    onConsent(minimalPreferences);
    setIsOpen(false);
    setDemoModeToSignedIn();
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'essential') return; // Essential cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center mb-2">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Welcome to UNSW SDGgo!</DialogTitle>
          <DialogDescription className="text-center">
            We value your privacy and want to be transparent about how we use your data to enhance your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Why we collect data */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="gap-2 flex items-center">
              <Award className="h-5 w-5 text-primary" />
              How We Help You Succeed
            </h4>
            <p className="text-sm text-muted-foreground py-0 mt-0">
              By tracking your SDG activities, we help you monitor your impact, discover relevant opportunities,
              and celebrate your contributions to the UN Sustainable Development Goals.
            </p>
          </Card>

          {/* Data tracking preferences */}
          <div className="space-y-3">
            {/* Essential */}
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="essential"
                  checked={preferences.essential}
                  disabled
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="essential" className="cursor-not-allowed">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm">Essential Data</h4>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded">Required</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Necessary for core platform functionality like authentication, SDG point tracking, and activity registration.
                    </p>
                  </label>
                </div>
              </div>
            </Card>

            {/* Analytics */}
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => togglePreference('analytics')}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={() => togglePreference('analytics')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="analytics" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <h4 className="text-sm">Analytics & Performance</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how students engage with SDG activities to improve the platform and identify trending topics.
                    </p>
                  </label>
                </div>
              </div>
            </Card>

            {/* Personalization */}
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => togglePreference('personalization')}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="personalization"
                  checked={preferences.personalization}
                  onCheckedChange={() => togglePreference('personalization')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="personalization" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4" />
                      <h4 className="text-sm">Personalization</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive personalized activity recommendations based on your interests and SDG goals to maximize your impact.
                    </p>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* More Details */}
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline">
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showDetails ? 'Hide details' : 'Learn more about data usage'}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3">
              <Card className="p-4 bg-muted/50">
                <h4 className="text-sm mb-2">What data we collect:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Your name, student ID, and profile information</li>
                  <li>SDG activities you register for and complete</li>
                  <li>Points earned and your ranking position</li>
                  <li>Activity preferences and SDG goal interests (if personalization is enabled)</li>
                  <li>Platform usage patterns (if analytics is enabled)</li>
                </ul>
              </Card>
              <Card className="p-4 bg-muted/50">
                <h4 className="text-sm mb-2">Your rights:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Access your data at any time through your profile</li>
                  <li>Request data deletion or export</li>
                  <li>Update your consent preferences anytime in settings</li>
                  <li>Opt-out of non-essential tracking</li>
                </ul>
              </Card>
              <p className="text-xs text-muted-foreground">
                This platform is designed for educational purposes only. We do not collect sensitive personal information
                or share your data with third parties. Your data is stored securely and used solely to enhance your SDG engagement experience.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleDecline} className="w-full sm:w-auto">
            Decline Optional
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <Button
              variant="secondary"
              onClick={handleAcceptSelected}
              className="w-full sm:w-auto"
            >
              Accept Selected
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="w-full sm:flex-1"
            >
              Accept All & Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

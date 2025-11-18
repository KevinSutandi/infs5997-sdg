'use client';
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { StudentSidebar } from "@/components/StudentSidebar";
import { HelpDialog } from "@/components/HelpDialog";
import {
  ConsentDialog,
  ConsentPreferences,
} from "@/components/ConsentDialog";
import {
  SignupDialog,
  UserSignupData,
} from "@/components/SignupDialog";
import {
  SDGSurveyDialog,
  SDGSurveyData,
} from "@/components/SDGSurveyDialog";
import { Toaster } from "@/components/ui/sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const CONSENT_STORAGE_KEY = "sdg-platform-consent";
const SIGNUP_STORAGE_KEY = "sdg-platform-signup";
const SURVEY_STORAGE_KEY = "sdg-platform-survey";
const DEMO_MODE_STORAGE_KEY = 'sdg-demo-mode-signed-in';

interface StudentLayoutWrapperProps {
  children: React.ReactNode;
}

export function StudentLayoutWrapper({ children }: StudentLayoutWrapperProps) {
  const pathname = usePathname();
  const [hasSignup, setHasSignup] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(SIGNUP_STORAGE_KEY);
    }
    return false;
  });
  const [hasSurvey, setHasSurvey] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(SURVEY_STORAGE_KEY);
    }
    return false;
  });
  const [hasConsent, setHasConsent] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(CONSENT_STORAGE_KEY);
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);

  const handleSignup = (data: UserSignupData) => {
    localStorage.setItem(
      SIGNUP_STORAGE_KEY,
      JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    );
    // Automatically set demo mode to signed-in after successful signup
    localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
    setShowSignupDialog(false);
    setHasSignup(true);
    // Reload to apply the signed-in state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleSurvey = (data: SDGSurveyData) => {
    localStorage.setItem(
      SURVEY_STORAGE_KEY,
      JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    );
    setHasSurvey(true);
  };

  const handleConsent = (preferences: ConsentPreferences) => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        preferences,
        timestamp: new Date().toISOString(),
      }),
    );
    setHasConsent(true);
  };

  // Skip layout for admin routes
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Guest mode: Allow browsing without signup, but show signup dialog optionally
  // Show signup dialog only if user explicitly wants to sign up
  // For now, we'll allow guest browsing and show dialogs when needed

  // Show signup dialog if explicitly requested (for guest users)
  if (showSignupDialog && !hasSignup) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl mb-2 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SDGgo!
              </h1>
              <p className="text-muted-foreground">
                UNSW&apos;s platform for tracking your contribution to the UN Sustainable
                Development Goals
              </p>
            </div>
          </div>
        </div>
        <SignupDialog
          open={true}
          onSignup={handleSignup}
          onOpenChange={(open) => {
            setShowSignupDialog(open);
          }}
          onSkip={() => {
            setShowSignupDialog(false);
            localStorage.setItem(
              SIGNUP_STORAGE_KEY,
              JSON.stringify({
                name: 'Guest User',
                studentId: 'Z0000000',
                faculty: 'Other',
                timestamp: new Date().toISOString(),
              }),
            );
            // Automatically set demo mode to signed-in after skip (treating as signup)
            localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
            setHasSignup(true);
            // Reload to apply the signed-in state
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }}
        />
      </>
    );
  }

  // Show survey dialog if user has signed up but hasn't completed survey yet
  if (hasSignup && !hasSurvey) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl mb-2 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SDGgo!
              </h1>
              <p className="text-muted-foreground">
                UNSW&apos;s platform for tracking your contribution to the UN Sustainable
                Development Goals
              </p>
            </div>
          </div>
        </div>
        <SDGSurveyDialog open={true} onSubmit={handleSurvey} />
      </>
    );
  }

  // Show consent dialog if user has signed up but hasn't consented yet
  if (hasSignup && !hasConsent) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl mb-2 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SDGgo!
              </h1>
              <p className="text-muted-foreground">
                UNSW&apos;s platform for tracking your contribution to the UN Sustainable
                Development Goals
              </p>
            </div>
          </div>
        </div>
        <ConsentDialog onConsent={handleConsent} />
      </>
    );
  }

  // Show main app after consent
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-[#FFE600]/5 to-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block" aria-label="Main navigation">
          <StudentSidebar onSignUpClick={() => setShowSignupDialog(true)} />
        </aside>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0" aria-label="Mobile navigation">
            <StudentSidebar
              onLinkClick={() => setMobileMenuOpen(false)}
              onSignUpClick={() => {
                setMobileMenuOpen(false);
                setShowSignupDialog(true);
              }}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-auto" role="main">
          {/* Mobile Menu Button */}
          <div className="md:hidden sticky top-0 z-40 bg-background border-b p-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  aria-label="Open navigation menu"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>

          {/* Page Content */}
          <div className="p-4 pt-6 md:p-8 md:pt-12 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Help Button */}
      <HelpDialog />

      <Toaster />
    </div>
  );
}



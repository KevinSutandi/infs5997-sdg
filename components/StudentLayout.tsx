'use client';
import { useState, useEffect } from "react";
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
import { Toaster } from "@/components/ui/sonner";

const CONSENT_STORAGE_KEY = "sdg-platform-consent";
const SIGNUP_STORAGE_KEY = "sdg-platform-signup";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const [hasSignup, setHasSignup] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(SIGNUP_STORAGE_KEY);
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
    setHasSignup(true);
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

  // Show signup dialog if user hasn't signed up yet
  if (!hasSignup) {
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
          onSkip={() => {
            localStorage.setItem(
              SIGNUP_STORAGE_KEY,
              JSON.stringify({
                name: 'Guest User',
                studentId: 'Z0000000',
                faculty: 'Other',
                timestamp: new Date().toISOString(),
              }),
            );
            setHasSignup(true);
          }}
        />
      </>
    );
  }

  // Show consent dialog if user hasn't consented yet
  if (!hasConsent) {
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
        {/* Sidebar */}
        <StudentSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Page Content */}
          <div className="p-8 pt-12 max-w-[1600px] mx-auto">
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


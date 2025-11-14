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
import { Toaster } from "@/components/ui/sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const CONSENT_STORAGE_KEY = "sdg-platform-consent";
const SIGNUP_STORAGE_KEY = "sdg-platform-signup";

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
  const [hasConsent, setHasConsent] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(CONSENT_STORAGE_KEY);
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <StudentSidebar />
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <StudentSidebar onLinkClick={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Menu Button */}
          <div className="md:hidden sticky top-0 z-40 bg-background border-b p-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
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



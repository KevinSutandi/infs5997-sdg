'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { currentUser } from '@/data/mockData';
import {
  LayoutDashboard,
  TrendingUp,
  Megaphone,
  ShoppingBag,
  CalendarDays,
  Trophy,
  Shield,
  Settings,
  LogIn,
  UserPlus,
} from 'lucide-react';
import Image from 'next/image';

interface NavItem {
  title: string;
  value: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
}

const navItems: NavItem[] = [
  { title: 'Activities', value: 'bulletin', href: '/bulletin', icon: Megaphone, section: 'main' },
  { title: 'Rankings', value: 'ranking', href: '/ranking', icon: TrendingUp, section: 'main' },
  { title: 'My Dashboard', value: 'dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'personal' },
  { title: 'My Events', value: 'events', href: '/events', icon: CalendarDays, section: 'personal' },
  { title: 'Redeem Store', value: 'redeem', href: '/redeem', icon: ShoppingBag, section: 'shop' },
  { title: 'Settings', value: 'settings', href: '/settings', icon: Settings, section: 'settings' },
];

interface StudentSidebarProps {
  onLinkClick?: () => void;
  onSignUpClick?: () => void;
}

const DEMO_MODE_STORAGE_KEY = 'sdg-demo-mode-signed-in';

export function StudentSidebar({ onLinkClick, onSignUpClick }: StudentSidebarProps = {}) {
  const pathname = usePathname();

  // Demo mode toggle - default to signed in (true)
  const [demoSignedIn, setDemoSignedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_MODE_STORAGE_KEY);
      return stored !== null ? stored === 'true' : true; // Default to signed in
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_MODE_STORAGE_KEY, demoSignedIn.toString());
    }
  }, [demoSignedIn]);

  // Reload page when demo mode changes to ensure all components update
  const handleDemoToggle = (checked: boolean) => {
    setDemoSignedIn(checked);
    // If switching to guest mode, clear signup data for clean demo
    if (!checked) {
      // Guest mode: Clear signup/consent/survey data for clean demo
      localStorage.removeItem('sdg-platform-signup');
      localStorage.removeItem('sdg-platform-survey');
      localStorage.removeItem('sdg-platform-consent');
    }
    // Small delay to ensure localStorage is updated before reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Check if user is a guest
  // For demo purposes: toggle overrides actual signup status
  // If toggle is OFF (false) = guest view, if toggle is ON (true) = signed in view
  const isGuest = !demoSignedIn; // Demo toggle controls guest state

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname === '/settings') return 'settings';
    if (pathname === '/') return 'bulletin'; // Default to bulletin for home
    // Extract tab from pathname
    const path = pathname.split('/')[1];
    return path || 'bulletin';
  };

  const currentActiveTab = getActiveTab();

  return (
    <aside className="w-64 bg-background border-r h-screen sticky top-0 overflow-y-auto shadow-lg" aria-label="Sidebar navigation">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="pb-1 border-b">
          <Link href="/" onClick={onLinkClick} className="flex justify-center items-center gap-3 mb-2 cursor-pointer" aria-label="UNSW SDGgo! Home">
            <Image src="/logo.png" alt="UNSW SDGgo!" width={180} height={50} />
          </Link>
        </div>

        {/* User Profile Section - Only show if signed in */}
        {!isGuest && (
          <div className="pb-4 border-b">
            <Link href="/settings" onClick={onLinkClick} className="relative group cursor-pointer block">
              {/* Profile Content */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-[#FFE600]/10 to-[#ffd700]/5 border border-[#FFE600]/20 transition-all duration-300 relative z-0">
                <Avatar className="h-12 w-12 ring-2 ring-[#FFE600]/50">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-[#FFE600] text-[#231F20] font-semibold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{currentUser.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Trophy className="h-3 w-3 text-amber-600" aria-hidden="true" />
                    <span className="text-xs text-amber-600 font-semibold">{currentUser.totalPoints} pts</span>
                  </div>
                </div>
              </div>

              {/* Settings Text - Appears on hover */}
              <div className="absolute top-0 left-0 right-0 backdrop-blur-xs bottom-0 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-black" aria-hidden="true" />
                  <span className="text-base font-semibold text-black">Settings</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Sign In/Sign Up Section - Only show if guest */}
        {isGuest && (
          <div className="pb-4 border-b">
            <div className="space-y-2">
              <Button
                onClick={() => {
                  onLinkClick?.();
                  onSignUpClick?.();
                }}
                className="w-full bg-linear-to-r from-[#FFE600] to-[#ffd700] hover:from-[#ffd700] hover:to-[#FFE600] text-[#231F20] font-semibold shadow-md"
              >
                <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                Sign Up
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onLinkClick?.();
                  onSignUpClick?.();
                }}
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
                Sign In
              </Button>
              <p className="text-xs text-center text-muted-foreground px-2">
                Sign up to track your SDG contributions and earn rewards
              </p>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="space-y-6">
          {/* Main Section */}
          <div>
            <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3 px-3">
              Explore
            </h2>
            <nav className="space-y-1" aria-label="Explore section">
              {navItems
                .filter(item => item.section === 'main')
                .map((item) => {
                  const isActive = currentActiveTab === item.value || pathname === item.href;
                  return (
                    <Link
                      key={item.value}
                      href={item.href}
                      onClick={onLinkClick}
                      className={cn(
                        'w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-lg transition-all group',
                        isActive
                          ? 'bg-linear-to-r from-[#FFE600] to-[#ffd700] text-[#231F20] shadow-md font-semibold'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-1'
                      )}
                    >
                      <item.icon className={cn(
                        'h-4 w-4 transition-transform',
                        isActive ? 'text-[#231F20]' : 'group-hover:scale-110'
                      )} aria-hidden="true" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* Personal Section - Only show if signed in */}
          {!isGuest && (
            <div>
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3 px-3">
                My Profile
              </h2>
              <nav className="space-y-1" aria-label="My Profile section navigation">
                {navItems
                  .filter(item => item.section === 'personal')
                  .map((item) => {
                    const isActive = currentActiveTab === item.value || pathname === item.href;
                    return (
                      <Link
                        key={item.value}
                        href={item.href}
                        onClick={onLinkClick}
                        className={cn(
                          'w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-lg transition-all group',
                          isActive
                            ? 'bg-linear-to-r from-[#FFE600] to-[#ffd700] text-[#231F20] shadow-md font-semibold'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-1'
                        )}
                      >
                        <item.icon className={cn(
                          'h-4 w-4 transition-transform',
                          isActive ? 'text-[#231F20]' : 'group-hover:scale-110'
                        )} aria-hidden="true" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    );
                  })}
              </nav>
            </div>
          )}

          {/* Shop Section */}
          <div>
            <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3 px-3">
              Rewards
            </h2>
            <nav className="space-y-1" aria-label="Rewards section navigation">
              {navItems
                .filter(item => item.section === 'shop')
                .map((item) => {
                  const isActive = currentActiveTab === item.value || pathname === item.href;
                  return (
                    <Link
                      key={item.value}
                      href={item.href}
                      onClick={onLinkClick}
                      className={cn(
                        'w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-lg transition-all group',
                        isActive
                          ? 'bg-linear-to-r from-[#FFE600] to-[#ffd700] text-[#231F20] shadow-md font-semibold'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-1'
                      )}
                    >
                      <item.icon className={cn(
                        'h-4 w-4 transition-transform',
                        isActive ? 'text-[#231F20]' : 'group-hover:scale-110'
                      )} aria-hidden="true" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* Settings Section - Only show if signed in */}
          {!isGuest && (
            <div>
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3 px-3">
                More
              </h2>
              <nav className="space-y-1" aria-label="More section navigation">
                {navItems
                  .filter(item => item.section === 'settings')
                  .map((item) => {
                    const isActive = currentActiveTab === item.value || pathname === item.href;
                    return (
                      <Link
                        key={item.value}
                        href={item.href}
                        onClick={onLinkClick}
                        className={cn(
                          'w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-lg transition-all group',
                          isActive
                            ? 'bg-linear-to-r from-[#FFE600] to-[#ffd700] text-[#231F20] shadow-md font-semibold'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-1'
                        )}
                      >
                        <item.icon className={cn(
                          'h-4 w-4 transition-transform',
                          isActive ? 'text-[#231F20]' : 'group-hover:scale-110'
                        )} aria-hidden="true" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    );
                  })}
              </nav>
            </div>
          )}
        </div>

        {/* Admin Link */}
        <div className="mt-auto pt-6 border-t space-y-4">
          <Link href="/admin" onClick={onLinkClick} className="cursor-pointer">
            <Button variant="outline" className="w-full justify-start hover:bg-accent transition-all cursor-pointer">
              <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
              Admin Dashboard
            </Button>
          </Link>

          {/* Demo Mode Toggle */}
          <div className="px-3 py-2  mt-3 rounded-lg bg-muted/30 border border-dashed">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Label htmlFor="demo-toggle" className="text-xs font-medium cursor-pointer">
                  Demo Mode
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {demoSignedIn ? 'Signed In' : 'Guest View'}
                </p>
              </div>
              <Switch
                id="demo-toggle"
                checked={demoSignedIn}
                onCheckedChange={handleDemoToggle}
                aria-describedby="demo-toggle-description"
                aria-label="Toggle demo mode between signed in and guest view"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}


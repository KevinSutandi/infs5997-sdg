'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
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
} from 'lucide-react';

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
}

export function StudentSidebar({ onLinkClick }: StudentSidebarProps = {}) {
  const pathname = usePathname();

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
    <div className="w-64 bg-background border-r h-screen sticky top-0 overflow-y-auto shadow-lg">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="pb-4 border-b">
          <Link href="/" onClick={onLinkClick} className="flex items-center gap-3 mb-2 cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-[#FFE600] to-[#ffd700] flex items-center justify-center shadow-md">
              <Trophy className="h-5 w-5 text-[#231F20]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">UNSW SDGgo!</h2>
            </div>
          </Link>
        </div>

        {/* User Profile Section */}
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
                  <Trophy className="h-3 w-3 text-amber-600" />
                  <span className="text-xs text-amber-600 font-semibold">{currentUser.totalPoints} pts</span>
                </div>
              </div>
            </div>

            {/* Settings Text - Appears on hover */}
            <div className="absolute top-0 left-0 right-0 backdrop-blur-xs bottom-0 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-black" />
                <span className="text-base font-semibold text-black">Settings</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {/* Main Section */}
          <div>
            <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3 px-3">
              Explore
            </h3>
            <nav className="space-y-1">
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
                      )} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* Personal Section */}
          <div>
            <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3 px-3">
              My Profile
            </h3>
            <nav className="space-y-1">
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
                      )} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3 px-3">
              Rewards
            </h3>
            <nav className="space-y-1">
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
                      )} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3 px-3">
              More
            </h3>
            <nav className="space-y-1">
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
                      )} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-auto pt-6 border-t">
          <Link href="/admin" onClick={onLinkClick} className="cursor-pointer">
            <Button variant="outline" className="w-full justify-start hover:bg-accent transition-all cursor-pointer">
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Calendar,
  Building2,
  Settings,
  ArrowLeft,
  LayoutDashboard,
  Gift,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
}

const navItems: NavItem[] = [
  { title: 'Overview', href: '/admin', icon: LayoutDashboard, section: 'analytics' },
  { title: 'SDG Analytics', href: '/admin/sdg', icon: BarChart3, section: 'analytics' },
  { title: 'Event Analytics', href: '/admin/events', icon: Calendar, section: 'analytics' },
  { title: 'Faculty Comparison', href: '/admin/faculty', icon: Building2, section: 'analytics' },
  { title: 'Reward Analytics', href: '/admin/rewards/analytics', icon: BarChart3, section: 'analytics' },
  { title: 'Activities & Events', href: '/admin/activities', icon: Settings, section: 'management' },
  { title: 'Rewards', href: '/admin/rewards', icon: Gift, section: 'management' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-linear-to-b from-[#231F20] to-[#2a2626] h-screen sticky top-0 overflow-y-auto shadow-xl">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-[#FFE600]/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-[#FFE600] to-[#ffd700] flex items-center justify-center shadow-lg shadow-[#FFE600]/20">
              <LayoutDashboard className="h-5 w-5 text-[#231F20]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">UNSW SDGGo!</h2>
              <p className="text-xs text-[#FFE600]">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {/* Analytics Section */}
          <div>
            <h3 className="text-xs font-semibold text-[#FFE600] uppercase tracking-wider mb-3">
              Analytics
            </h3>
            <nav className="space-y-1">
              {navItems
                .filter(item => item.section === 'analytics')
                .map((item) => {
                  // For exact matches, check exact pathname
                  // For /admin/rewards/analytics, make sure it doesn't match /admin/rewards
                  const isActive = pathname === item.href || 
                    (pathname === '/admin' && item.href === '/admin') ||
                    (item.href === '/admin/rewards/analytics' && pathname.startsWith('/admin/rewards/analytics'));
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer group',
                          isActive
                            ? 'bg-linear-to-r from-[#FFE600] to-[#ffd700] text-[#231F20] shadow-lg shadow-[#FFE600]/30'
                            : 'text-gray-300 hover:bg-[#FFE600]/10 hover:text-[#FFE600] hover:translate-x-1'
                        )}
                      >
                        <item.icon className={cn(
                          'h-4 w-4 transition-transform',
                          isActive ? 'text-[#231F20]' : 'group-hover:scale-110'
                        )} />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* Management Section */}
          <div>
            <h3 className="text-xs font-semibold text-[#FFE600] uppercase tracking-wider mb-3">
              Content Management
            </h3>
            <nav className="space-y-1">
              {navItems
                .filter(item => item.section === 'management')
                .map((item) => {
                  // For management items, check exact match but exclude sub-routes
                  // e.g., /admin/rewards should not match /admin/rewards/analytics
                  const isActive = pathname === item.href && 
                    !(item.href === '/admin/rewards' && pathname.startsWith('/admin/rewards/analytics'));
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer group',
                          isActive
                            ? 'bg-linear-to-r from-[#FFE600] to-[#ffd700] text-[#231F20] shadow-lg shadow-[#FFE600]/30'
                            : 'text-gray-300 hover:bg-[#FFE600]/10 hover:text-[#FFE600] hover:translate-x-1'
                        )}
                      >
                        <item.icon className={cn(
                          'h-4 w-4 transition-transform',
                          isActive ? 'text-[#231F20]' : 'group-hover:scale-110'
                        )} />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                    </Link>
                  );
                })}
            </nav>
            <div className="mt-5">
              <Link href="/">
                <Button variant="outline" className=" bg-transparent w-full justify-start border-[#FFE600]/30 text-white hover:bg-[#FFE600]/10 hover:border-[#FFE600] hover:text-[#FFE600] transition-all">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


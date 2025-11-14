'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { EventAnalytics } from '@/components/admin/Analytics/EventAnalytics';
import { Toaster } from '@/components/ui/sonner';

export default function EventAnalyticsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-[#FFE600]/5 to-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <EventAnalytics />
        </main>
      </div>
      <Toaster />
    </div>
  );
}


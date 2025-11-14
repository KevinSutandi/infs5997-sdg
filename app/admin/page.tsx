'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { Toaster } from '@/components/ui/sonner';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#FFE600]/5 to-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <AdminOverview />
        </main>
      </div>
      <Toaster />
    </div>
  );
}



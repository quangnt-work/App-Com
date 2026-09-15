import { DashboardService } from '@/services/DashboardService';
import { AdminBanner } from '@/components/admin/dashboard/AdminBanner';
import { AdminStatsSection } from '@/components/admin/dashboard/AdminStatsSection';

export default async function AdminDashboard() {
  const stats = await DashboardService.getStats();

  return (
    <div className="p-6 lg:p-8 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Banner */}
        <AdminBanner />

        {/* Thống kê Card */}
        <AdminStatsSection stats={stats} />
      </div>
    </div>
  );
}

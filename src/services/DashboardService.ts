import { DashboardRepository } from "@/repositories/DashboardRepository";
import { requireAdmin } from "@/lib/auth";

export const DashboardService = {
  async getStats() {
    await requireAdmin();
    return await DashboardRepository.getStats();
  },
};

import { useQuery } from "@tanstack/react-query";
import type {
  AllTimeStats,
  MonthInfo,
  DomainStat,
  WeeklyData,
} from "@/lib/types/dashboard";

interface DashboardData {
  allTime: AllTimeStats;
  currentMonth: MonthInfo;
  domainStats: DomainStat[];
  weeklyData: WeeklyData[];
}

interface UseDashboardDataParams {
  month: number;
  year: number;
}

export function useDashboardData({ month, year }: UseDashboardDataParams) {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", month, year],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard?month=${month}&year=${year}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

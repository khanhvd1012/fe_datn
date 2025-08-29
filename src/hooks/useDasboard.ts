import { useQuery } from "@tanstack/react-query";
import type { IDashboardStats } from "../interface/dashboard";
import { getDashboardStats } from "../service/dashboardAPI";

export const useDashboardStats = (params?: Record<string, any>) => {
  return useQuery<IDashboardStats, Error>({
    queryKey: ["dashboardStats", params],
    queryFn: () => getDashboardStats(params),
    staleTime: 5 * 60 * 1000, // cache 5 phút
    refetchOnWindowFocus: false, // không tự refetch khi đổi tab
  });
};

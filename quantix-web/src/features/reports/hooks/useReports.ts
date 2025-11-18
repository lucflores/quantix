import { useQuery } from "@tanstack/react-query";
import { getLowStockReport } from "../api";
import { api } from "@/core/api/client";
import type { DashboardMetricsResponse } from "../types";

export const useLowStockReport = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["low-stock", page, limit],
    queryFn: () => getLowStockReport(page, limit),
  });
};

async function fetchDashboardMetrics(): Promise<DashboardMetricsResponse> {
    const { data } = await api.get<DashboardMetricsResponse>("/reports/dashboard-metrics");
    return data;
}

export const useDashboardMetrics = () => {
    return useQuery({
        queryKey: ['dashboard-metrics'],
        queryFn: fetchDashboardMetrics,
        staleTime: 1000 * 60 * 5, 
    });
};
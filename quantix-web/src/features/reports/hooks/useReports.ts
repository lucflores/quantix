// quantix-web/src/features/reports/hooks/useReports.ts

import { useQuery } from "@tanstack/react-query";
import { getLowStockReport } from "../api";

export const useLowStockReport = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["low-stock", page, limit],
    queryFn: () => getLowStockReport(page, limit),
  });
};
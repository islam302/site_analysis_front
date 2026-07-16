import { useMutation, useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryClient";
import * as api from "@/api/fullReport";
import type { FullReportStartRequest, FullReportStatus } from "@/types/api";

const ACTIVE: FullReportStatus[] = ["pending", "processing"];
// The report typically takes ~20–60s; docs recommend polling every ~3s.
const POLL_MS = 3000;

export function useStartFullReport() {
  return useMutation({
    mutationFn: (body: FullReportStartRequest) => api.startFullReport(body),
  });
}

export function useFullReportJob(id: string | null) {
  return useQuery({
    queryKey: qk.fullReport(id ?? "none"),
    queryFn: () => api.getFullReport(id as string),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && ACTIVE.includes(status) ? POLL_MS : false;
    },
  });
}

import { apiClient } from "./client";
import type {
  FullReportJob,
  FullReportStartRequest,
  FullReportStartResponse,
} from "@/types/api";

export async function startFullReport(
  body: FullReportStartRequest,
): Promise<FullReportStartResponse> {
  const { data } = await apiClient.post<FullReportStartResponse>(
    "/full_report/",
    body,
  );
  return data;
}

export async function getFullReport(id: string): Promise<FullReportJob> {
  const { data } = await apiClient.get<FullReportJob>(`/full_report/${id}/`);
  return data;
}

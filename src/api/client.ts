import axios from "axios";
import { API_BASE_URL } from "@/lib/config";

// Plain axios instance — no auth. Every endpoint the UI talks to is public.
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

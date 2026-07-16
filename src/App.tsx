import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FullReportPage } from "@/pages/FullReportPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<FullReportPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

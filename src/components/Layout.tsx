import { Link, Outlet } from "react-router-dom";
import { FileText } from "lucide-react";
import { EnvBar } from "./EnvBar";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-20 border-b border-hairline bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-content items-center gap-4 px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-white">
              <FileText size={15} strokeWidth={2} />
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink">
              Site Analysis · Full Report
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-content flex-1 px-5 py-8">
        <Outlet />
      </main>

      <EnvBar />
    </div>
  );
}

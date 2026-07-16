import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">
        404
      </p>
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-md text-sm text-ink-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/">
        <Button variant="secondary">Back to report</Button>
      </Link>
    </div>
  );
}

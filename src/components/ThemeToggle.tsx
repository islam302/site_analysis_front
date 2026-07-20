import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/cn";

const LABELS: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const ICONS: Record<ThemePreference, React.ReactNode> = {
  light: <Sun size={15} strokeWidth={1.75} />,
  dark: <Moon size={15} strokeWidth={1.75} />,
  system: <Monitor size={15} strokeWidth={1.75} />,
};

/**
 * Cycles light → dark → system. The current preference is announced via the
 * accessible name, so the control isn't communicated by icon alone.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { preference, resolved, cycle } = useTheme();

  const next: ThemePreference =
    preference === "light" ? "dark" : preference === "dark" ? "system" : "light";

  return (
    <button
      type="button"
      onClick={cycle}
      title={`Theme: ${LABELS[preference]}${
        preference === "system" ? ` (${resolved})` : ""
      } — click for ${LABELS[next]}`}
      aria-label={`Theme: ${LABELS[preference]}. Switch to ${LABELS[next]}.`}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded border border-hairline",
        "bg-surface px-2 text-xs font-medium text-ink-muted",
        "transition-colors hover:bg-muted-strong hover:text-ink",
        className,
      )}
    >
      {ICONS[preference]}
      <span className="hidden sm:inline">{LABELS[preference]}</span>
    </button>
  );
}

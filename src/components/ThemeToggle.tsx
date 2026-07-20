import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

/**
 * Two-state Light/Dark switch. The label names the theme you'll get when you
 * click, so the control never depends on the icon alone.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const nextLabel = isDark ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={toggle}
      title={`Switch to ${nextLabel.toLowerCase()} mode`}
      aria-label={`Switch to ${nextLabel.toLowerCase()} mode`}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded border border-hairline",
        "bg-surface px-2 text-xs font-medium text-ink-muted",
        "transition-colors hover:bg-muted-strong hover:text-ink",
        className,
      )}
    >
      {isDark ? (
        <Sun size={15} strokeWidth={1.75} />
      ) : (
        <Moon size={15} strokeWidth={1.75} />
      )}
      <span className="hidden sm:inline">{nextLabel}</span>
    </button>
  );
}

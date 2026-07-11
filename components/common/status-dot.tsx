import { cn } from "@/lib/utils";

/**
 * F9 - "● ONLINE" status treatment for the AI-OS metaphor (nav, Mission Control nodes).
 */
export function StatusDot({
  label = "ONLINE",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-subtle",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-online opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-online" />
      </span>
      {label}
    </span>
  );
}

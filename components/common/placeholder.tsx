import { cn } from "@/lib/utils";

/**
 * F10 - honest placeholder for content that is not yet supplied (dev plan §8).
 * Never fabricate data; render this instead so gaps stay visible and trackable.
 */
export function Placeholder({
  node,
  label,
  className,
}: {
  /** Node id from the development plan, e.g. "S6.2". */
  node?: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-1 rounded-lg border border-dashed border-border-strong bg-surface/40 px-4 py-3 text-sm text-subtle",
        className,
      )}
      data-placeholder={node ?? true}
    >
      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-warn">
        content pending
      </span>
      <span>{label}</span>
    </div>
  );
}

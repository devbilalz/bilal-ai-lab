import { cn } from "@/lib/utils";

/**
 * Placeholder for content that is not yet supplied. Rendered instead of copy
 * so gaps stay visible rather than being filled with guesses.
 */
export function Placeholder({
  node,
  label,
  className,
}: {
  /** Optional internal id for the pending slot. */
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

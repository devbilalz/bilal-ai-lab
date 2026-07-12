import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Consistent wrapper for home-page sections: anchor id, eyebrow, heading, spacing. */
export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  className,
  back,
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  /** Optional control (e.g. BackHome) rendered above the eyebrow. */
  back?: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-6xl scroll-mt-16 px-6 pt-6 pb-20 sm:pt-8 sm:pb-28",
        className,
      )}
    >
      {back && <div className="mb-8">{back}</div>}
      {(eyebrow || title) && (
        <div className="mb-10">
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

import { Reveal } from "@/components/animations/reveal";
import {
  apiCatalog,
  apiCatalogNamed,
  apiCatalogTotal,
} from "@/lib/content/apis";

/**
 * Presents the ~77 simulated real-world services grouped by category, as a
 * chip grid. Rendered inside the Agent APIs case file.
 */
export function ApiCatalog() {
  return (
    <Reveal>
      <div className="border-t border-border pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            The ~{apiCatalogTotal} simulated services
          </h2>
          <span className="font-mono text-[0.65rem] text-subtle">
            {apiCatalogNamed} named across {apiCatalog.length} categories
          </span>
        </div>

        <p className="mt-4 text-sm text-muted">
          Each is a full, stateful simulation - real business logic, a mock
          database, Pydantic-validated I/O, and injectable failure modes - not a
          stub. Gemini practices multi-turn tool use against these before any
          behavior touches a real account.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {apiCatalog.map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl border border-border bg-surface/40 p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {cat.name}
                </h3>
                <span className="font-mono text-[0.65rem] text-subtle">
                  {cat.items.length}
                </span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border-strong bg-background-elevated px-2 py-1 font-mono text-[0.7rem] text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

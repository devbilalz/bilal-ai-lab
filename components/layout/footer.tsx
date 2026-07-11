import Link from "next/link";
import { site } from "@/lib/site";

/**
 * F8 - minimal footer with real contact rails (S13.3).
 * Email is rendered only once a real address is supplied (dev plan §8).
 */
export function Footer() {
  const rails = [
    { label: "GitHub", href: site.links.github },
    { label: "LinkedIn", href: site.links.linkedin },
    site.links.email
      ? { label: "Email", href: `mailto:${site.links.email}` }
      : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="font-mono text-xs text-subtle">
          {site.person} · {new Date().getFullYear()}
        </p>
        <ul className="flex items-center gap-6">
          {rails.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { site } from "@/lib/site";

/**
 * S13 Let's Build. Availability statement + real contact rails (no form).
 */
export function Contact() {
  const rails = [
    { label: "Email", href: `mailto:${site.links.email}` },
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "GitHub", href: site.links.github },
    { label: "Résumé", href: "/resources" },
  ];

  const details = [
    { icon: Mail, label: site.links.email, href: `mailto:${site.links.email}` },
    {
      icon: Phone,
      label: site.links.phone,
      href: `tel:${site.links.phone.replace(/\s+/g, "")}`,
    },
    { icon: MapPin, label: "Worldwide · remote, hybrid, or on-site · open to relocation", href: null },
  ];

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-lg text-muted">{site.availability}</p>

      <ul className="grid gap-3 sm:grid-cols-3">
        {details.map((d) => {
          const Icon = d.icon;
          const inner = (
            <span className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border-strong text-accent">
                <Icon className="size-4" />
              </span>
              <span className="text-sm text-foreground">{d.label}</span>
            </span>
          );
          return (
            <li
              key={d.label}
              className="rounded-xl border border-border bg-surface/40 px-4 py-3"
            >
              {d.href ? (
                <a href={d.href} className="transition-colors hover:text-accent">
                  {inner}
                </a>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-3">
        {rails.map((r) => (
          <Link
            key={r.label}
            href={r.href}
            className="rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            {...(r.href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {r.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { CSSProperties, SVGProps } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { site } from "@/lib/site";

/* Brand marks (this lucide build dropped brand icons) - simple-icons paths. */
function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}
function ResumeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
}

/**
 * F8 - footer + contact, styled as a terminal session over the same
 * ~/bilal-zahid filesystem the nav header and Evidence Vault use, so it reads as
 * one coherent system. Live touches: a pulsing "available" status, a blinking
 * prompt cursor, click-to-copy on email/phone, and hover sweeps on the links.
 */

const rows = [
  {
    key: "email",
    value: site.links.email,
    href: `mailto:${site.links.email}`,
    copy: site.links.email,
  },
  {
    key: "phone",
    value: site.links.phone,
    href: `tel:${site.links.phone.replace(/\s+/g, "")}`,
    copy: site.links.phone,
  },
  {
    key: "location",
    value: "worldwide · remote, hybrid, on-site · open to relocation",
    href: null,
    copy: null,
  },
];

const links = [
  { label: "LinkedIn", href: site.links.linkedin, Icon: LinkedInIcon, color: "#4aa3ff" },
  { label: "GitHub", href: site.links.github, Icon: GitHubIcon, color: "#f4f4f8" },
  { label: "Résumé", href: "/resources", Icon: ResumeIcon, color: "#a78bfa" },
];

// pad keys to the widest so values line up like a real terminal table
const KEY_W = Math.max(...rows.map((r) => r.key.length));

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          })
          .catch(() => {});
      }}
      aria-label={copied ? "Copied" : `Copy ${text}`}
      className="text-subtle opacity-0 transition-opacity hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
    >
      {copied ? (
        <Check className="size-3.5 text-online" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-16 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 xl:pr-20">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
          {/* Terminal contact console */}
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-online">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-online opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-online" />
              </span>
              available for new roles
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl overflow-hidden rounded-xl border border-border bg-background-elevated/60 backdrop-blur"
            >
              {/* window chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-surface/50 px-4 py-2.5 font-mono text-[0.7rem]">
                <span className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]/70" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]/70" />
                  <span className="size-2.5 rounded-full bg-[#28c840]/70" />
                </span>
                <span className="ml-2 truncate text-muted">
                  <span className="text-accent">~/</span>bilal-zahid
                  <span className="text-subtle">/</span>
                  <span className="text-foreground">contact</span>
                </span>
              </div>

              {/* prompt + output */}
              <div className="space-y-1.5 px-4 py-4 font-mono text-[0.82rem]">
                <p className="text-subtle">
                  <span className="text-online">$</span> reach --me
                </p>
                {rows.map((r) => (
                  <div key={r.key} className="group flex items-center gap-2">
                    <span className="shrink-0 whitespace-pre text-accent">
                      {r.key.padEnd(KEY_W)}
                    </span>
                    {r.href ? (
                      <a
                        href={r.href}
                        className="truncate text-foreground transition-colors hover:text-accent hover:underline"
                      >
                        {r.value}
                      </a>
                    ) : (
                      <span className="truncate text-muted">{r.value}</span>
                    )}
                    {r.copy && <CopyButton text={r.copy} />}
                  </div>
                ))}
                <p className="flex items-center gap-1.5 pt-1 text-subtle">
                  <span className="text-online">$</span>
                  <motion.span
                    aria-hidden
                    className="inline-block h-4 w-[7px] bg-accent"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      times: [0, 0.5, 0.5, 1],
                    }}
                  />
                </p>
              </div>
            </motion.div>
          </div>

          {/* Heading + links */}
          <div className="flex flex-col items-start gap-4 md:items-end md:text-right">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Let&apos;s connect
            </h2>
            <div className="flex w-full flex-col items-start gap-2.5 md:items-end">
              {links.map((r) => {
                const Icon = r.Icon;
                const cls =
                  "group relative flex items-center gap-2.5 overflow-hidden rounded-full border border-border-strong px-5 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-[var(--c)] hover:shadow-[0_0_26px_-6px_var(--c)]";
                const inner = (
                  <>
                    <Icon
                      className="relative z-10 size-4 shrink-0"
                      style={{ color: r.color }}
                      strokeWidth={2}
                    />
                    <span className="relative z-10">{r.label}</span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, transparent, color-mix(in srgb, var(--c) 24%, transparent), transparent)",
                      }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "color-mix(in srgb, var(--c) 9%, transparent)",
                      }}
                    />
                  </>
                );
                const style = { "--c": r.color } as CSSProperties;
                return r.href.startsWith("/") ? (
                  <Link key={r.label} href={r.href} className={cls} style={style}>
                    {inner}
                  </Link>
                ) : (
                  <a
                    key={r.label}
                    href={r.href}
                    className={cls}
                    style={style}
                    {...(r.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {inner}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row xl:pr-20">
          <p className="font-mono text-xs text-subtle">
            {site.person} · {new Date().getFullYear()}
          </p>
          <p className="font-mono text-xs text-subtle">
            Synthetic worlds · agentic evaluation · systems built to scale
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    clarity?: (
      command: "set" | "event" | "identify" | "consent" | "upgrade",
      keyOrEvent: string,
      value?: string,
    ) => void;
  }
}

const analyticsEnabled =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" ||
  (process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false");

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const speedInsightsEnabled =
  process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ENABLED !== "false";

function shortText(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 120) || undefined;
}

function elementLabel(element: Element) {
  return (
    element.getAttribute("data-analytics-label") ||
    element.getAttribute("aria-label") ||
    shortText(element.textContent) ||
    element.getAttribute("title") ||
    element.tagName.toLowerCase()
  );
}

function track(event: string, properties: Record<string, unknown> = {}) {
  if (!analyticsEnabled) return;

  if (posthogKey && posthog.__loaded) {
    posthog.capture(event, properties);
  }

  window.clarity?.("event", event);
}

function classifyLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href") || "";
  if (!href) return "empty_link";
  if (href.startsWith("mailto:")) return "contact_email";
  if (href.startsWith("tel:")) return "contact_phone";
  if (href.includes("/resumes/")) return anchor.hasAttribute("download") ? "resume_download" : "resume_open";
  if (href.includes("/deep-dives")) return "deep_dive";
  if (href.startsWith("http") && !href.includes(window.location.host)) return "outbound_link";
  if (href.startsWith("#") || href.startsWith("/") || href.includes(window.location.host)) return "internal_navigation";
  return "link_click";
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  const initialized = useRef(false);
  const scrollMarks = useRef(new Set<number>());

  useEffect(() => {
    if (!analyticsEnabled || !posthogKey || initialized.current) return;

    posthog.init(posthogKey, {
      api_host: posthogHost,
      autocapture: true,
      capture_pageview: false,
      capture_pageleave: true,
      disable_session_recording: false,
      persistence: "localStorage+cookie",
      person_profiles: "identified_only",
      loaded: () => {
        initialized.current = true;
      },
    });
  }, []);

  useEffect(() => {
    if (!analyticsEnabled) return;

    const url = window.location.href;
    const referrer = document.referrer || undefined;

    if (posthogKey && posthog.__loaded) {
      posthog.capture("$pageview", {
        $current_url: url,
        path: pathname,
        referrer,
        title: document.title,
      });
    }

    window.clarity?.("set", "path", pathname);
    window.clarity?.("event", "page_view");
    scrollMarks.current = new Set<number>();
  }, [pathname]);

  useEffect(() => {
    if (!analyticsEnabled) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const element = target.closest("a,button,[data-analytics-event]");
      if (!element) return;

      const customEvent = element.getAttribute("data-analytics-event");
      const anchor = element.closest("a");
      const eventName = customEvent || (anchor ? classifyLink(anchor) : "button_click");

      track(eventName, {
        label: elementLabel(element),
        href: anchor?.href,
        path: window.location.pathname,
        location: element.getAttribute("data-analytics-location"),
        section: element.closest("section")?.id,
        target: anchor?.target || undefined,
      });
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const depth = Math.min(100, Math.round((window.scrollY / maxScroll) * 100));
      for (const mark of [25, 50, 75, 90, 100]) {
        if (depth >= mark && !scrollMarks.current.has(mark)) {
          scrollMarks.current.add(mark);
          track("scroll_depth", {
            depth: mark,
            path: window.location.pathname,
          });
        }
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {speedInsightsEnabled && <SpeedInsights />}
      {analyticsEnabled && clarityProjectId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
          `}
        </Script>
      )}
    </>
  );
}

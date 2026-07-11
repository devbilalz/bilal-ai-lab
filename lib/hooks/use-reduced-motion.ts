import { useSyncExternalStore } from "react";

/**
 * SSR-safe `prefers-reduced-motion` hook (F9).
 * Uses useSyncExternalStore so there is no setState-in-effect: the server
 * snapshot is always false, the client subscribes to the media query.
 * Every animated component reads this to provide a genuinely calmer experience.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

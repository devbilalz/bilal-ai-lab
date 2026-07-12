/**
 * In-memory navigation history (module singleton). Resets on every full page
 * load, which is exactly what we want: a direct/external landing has no prior
 * in-app path, so "back" can fall back to a sensible default (Deep Dives).
 *
 * Only client-side SPA navigations (next/link) populate this via <RouteHistory/>.
 */

let current: string | null = null;
let previous: string | null = null;

export function recordPath(path: string) {
  if (path === current) return;
  previous = current;
  current = path;
}

/** The path the user was on immediately before the current one (null if none). */
export function getPreviousPath(): string | null {
  return previous;
}

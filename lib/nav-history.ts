/**
 * In-memory navigation history (module singleton). Resets on every full page
 * load, which is exactly what we want: a direct/external landing has no prior
 * in-app path, so "back" can fall back to a sensible default (Case Files).
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

/**
 * The exact surface a deep-dive link was opened from. Path history alone can't
 * distinguish sections that share a URL (the chat console and Mission Control
 * both live on "/"), so the originating link records this at click time. It is
 * consumed once by the deep-dive back control, then cleared - a link that
 * doesn't set it falls back to path-based resolution.
 */
export type DeepDiveOrigin = "chat" | "mission-control" | "timeline" | "deep-dives";

let deepDiveOrigin: DeepDiveOrigin | null = null;

export function setDeepDiveOrigin(origin: DeepDiveOrigin) {
  deepDiveOrigin = origin;
}

export function consumeDeepDiveOrigin(): DeepDiveOrigin | null {
  const o = deepDiveOrigin;
  deepDiveOrigin = null;
  return o;
}

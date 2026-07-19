/**
 * Scrolls to an in-page section and writes a single, clean hash to the URL.
 *
 * Using an absolute `pathname + #id` (instead of letting the router append a
 * fragment) guarantees the hash never stacks up as `#id#id` when one is
 * already present. Returns false when the target isn't on the current page so
 * callers can fall back to normal navigation.
 */
export function goToSection(id: string, smooth = true): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const url = `${window.location.pathname}${window.location.search}#${id}`;
  window.history.pushState(null, "", url);
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  return true;
}

/**
 * Tiny in-memory coordination between the app-level boot overlay (BootWow) and
 * the home-page hero "inference console". The console must not start streaming
 * while the boot overlay is still covering the screen, so BootWow signals here
 * when it finishes (or when it decides not to play at all). Resets naturally on
 * every full page load because it's module state.
 */
let bootDone = false;
const listeners = new Set<() => void>();

export function markBootDone(): void {
  if (bootDone) return;
  bootDone = true;
  for (const l of listeners) l();
}

export function isBootDone(): boolean {
  return bootDone;
}

export function onBootDone(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

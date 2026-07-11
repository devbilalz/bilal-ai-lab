import Link from "next/link";

/** F11 - on-brand 404. */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-warn">404 · signal lost</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        This route isn&apos;t online.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The node you were looking for doesn&apos;t exist in this system.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
      >
        Return to base
      </Link>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPath } from "@/lib/nav-history";

/**
 * Invisible tracker: records each client-side route change so back controls can
 * know where the user actually came from. Mounted once in the root layout.
 */
export function RouteHistory() {
  const pathname = usePathname();

  useEffect(() => {
    recordPath(pathname);
  }, [pathname]);

  return null;
}

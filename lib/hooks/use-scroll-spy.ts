"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids is currently "active" (the last one
 * whose top has scrolled past the offset). rAF-throttled; the state update
 * happens inside the rAF callback, never synchronously in the effect body.
 */
export function useScrollSpy(ids: readonly string[], offset = 96) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      const pos = window.scrollY + offset + 1;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) current = id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom && ids.length) current = ids[ids.length - 1];
      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}

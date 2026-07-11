"use client";

import { useState } from "react";

/**
 * Company mark: tries the real favicon (Google's favicon service, which
 * resolves reliably for live domains) and falls back to a designed, colored
 * monogram tile so a missing/dead logo still looks intentional.
 */

const PALETTE = ["#7c5cff", "#22d3ee", "#34d399", "#fbbf24", "#f472b6", "#38bdf8"];

function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function CompanyLogo({
  name,
  domain,
  size = 28,
}: {
  name: string;
  domain?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const color = colorFor(name);
  const showFavicon = Boolean(domain) && !failed;

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border-strong bg-background-elevated"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 14px -4px ${color}`,
      }}
    >
      {showFavicon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
          alt={`${name} logo`}
          width={Math.round(size * 0.62)}
          height={Math.round(size * 0.62)}
          loading="lazy"
          className="size-[62%] object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          aria-hidden
          className="font-mono text-xs font-bold"
          style={{ color }}
        >
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}

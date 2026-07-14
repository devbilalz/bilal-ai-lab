import { ImageResponse } from "next/og";
import { deepDives, deepDiveBySlug } from "@/lib/content/deep-dives";

export const alt = "Case File - Bilal Zahid";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Pre-render one share card per case file (matches the page's static params). */
export function generateStaticParams() {
  return deepDives.map((d) => ({ slug: d.slug }));
}

/**
 * Per-case-file share card. Without this, every /deep-dives/* link pasted into
 * LinkedIn reuses the site-wide OG image and looks identical - so recruiters
 * can't tell the case files apart. This gives each one its own title, context
 * line, and stack chips while staying on-brand with the global card.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dd = deepDiveBySlug(slug);
  const accent = "#7c5cff";

  const title = dd?.title ?? "Case File";
  const tagline = dd?.tagline ?? "";
  const org = dd?.facts.org ?? "";
  const period = dd?.facts.period ?? "";
  const chips = (dd?.facts.stack ?? []).slice(0, 5);
  const titleSize = title.length > 26 ? 76 : 96;
  const orgLine = [org, period].filter(Boolean).join("  ·  ");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#06060a",
          backgroundImage:
            "radial-gradient(900px 500px at 78% -10%, rgba(124,92,255,0.28), transparent 60%), radial-gradient(700px 500px at -10% 120%, rgba(124,92,255,0.12), transparent 60%)",
          padding: "70px 80px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: accent,
            fontSize: 24,
            letterSpacing: 2,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#34d399" }} />
          ~ / bilal-zahid / case-file
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: "#f3f3f8",
              lineHeight: 1.03,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          {tagline ? (
            <div style={{ marginTop: 20, fontSize: 32, color: "#c1c1d0", lineHeight: 1.25 }}>
              {tagline}
            </div>
          ) : null}
          {orgLine ? (
            <div style={{ marginTop: 14, fontSize: 24, color: "#8f8fa6" }}>
              {orgLine}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                fontSize: 22,
                color: "#c1c1d0",
                border: "1px solid rgba(124,92,255,0.4)",
                background: "rgba(124,92,255,0.08)",
                borderRadius: 10,
                padding: "9px 16px",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

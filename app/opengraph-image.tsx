import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.person} - ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded share card so links pasted into LinkedIn / Slack / iMessage render a
 * proper preview instead of a blank card. Matches the site palette (near-black
 * base, electric-violet accent, mono labels).
 */
export default function OpengraphImage() {
  const accent = "#7c5cff";
  const chips = ["Google Gemini", "LLM Evaluation", "Agentic AI", "Synthetic Data"];

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
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: accent,
            fontSize: 26,
            letterSpacing: 2,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#34d399",
            }}
          />
          ~ / bilal-zahid
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 118,
              fontWeight: 700,
              color: "#f3f3f8",
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Bilal Zahid
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 40,
              color: "#c1c1d0",
            }}
          >
            {site.title}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 27,
              color: "#8f8fa6",
            }}
          >
            Training &amp; evaluation infrastructure behind Google&apos;s Gemini
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                fontSize: 24,
                color: "#c1c1d0",
                border: "1px solid rgba(124,92,255,0.4)",
                background: "rgba(124,92,255,0.08)",
                borderRadius: 10,
                padding: "10px 18px",
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

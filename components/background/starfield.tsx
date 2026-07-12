"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface Star {
  x: number;
  y: number;
  z: number; // depth 0..1 (parallax + size)
  tw: number; // twinkle phase
  vx: number;
  vy: number;
}

interface Anchor {
  x: number;
  y: number;
  r: number; // base glow radius
  phase: number;
  speed: number;
  color: [number, number, number];
}

const ANCHOR_COLORS: [number, number, number][] = [
  [124, 92, 255], // violet
  [34, 211, 238], // cyan
  [168, 146, 255], // soft violet
  [96, 130, 255], // indigo
  [244, 114, 182], // magenta
];

/**
 * A hand-painted, low-light "LLM canvas": layered nebula washes, a faint neural
 * constellation of drifting nodes with links, soft activation glows that pulse
 * like a model thinking, and a grain texture so it reads as a painting rather
 * than flat black. Fixed, behind everything, non-interactive. Reduced-motion =>
 * a single calm static frame.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let anchors: Anchor[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;

    const seed = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(130, Math.round((w * h) / 13000));
      stars = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          tw: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.04 * (0.4 + z),
          vy: (Math.random() - 0.5) * 0.04 * (0.4 + z),
        };
      });

      const aCount = 7;
      anchors = Array.from({ length: aCount }, (_, i) => ({
        x: (w * (i + 0.5)) / aCount + (Math.random() - 0.5) * w * 0.08,
        y: h * (0.2 + Math.random() * 0.6),
        r: 90 + Math.random() * 130,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0004 + Math.random() * 0.0006,
        color: ANCHOR_COLORS[i % ANCHOR_COLORS.length],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Soft activation glows - the "thinking" nebula bloom.
      ctx.globalCompositeOperation = "lighter";
      for (const a of anchors) {
        const pulse = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(t * a.speed + a.phase);
        const r = a.r * (0.75 + 0.35 * pulse);
        const [cr, cg, cb] = a.color;
        const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, r);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${0.05 + 0.05 * pulse})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Faint constellation links (the neural-net texture).
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 125 * 125) {
            const o = (1 - Math.sqrt(d2) / 125) * 0.11;
            ctx.strokeStyle = `rgba(140, 120, 255, ${o})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes.
      for (const s of stars) {
        if (!reduced) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;
        }
        const twinkle = reduced ? 0.7 : 0.5 + 0.5 * Math.sin(t * 0.001 + s.tw);
        const r = 0.4 + s.z * 1.3;
        const alpha = 0.22 + s.z * 0.55 * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 218, 255, ${alpha})`;
        ctx.fill();
      }
    };

    let raf = 0;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    seed();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      seed();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Deep base wash so it is never flat black. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70rem 55rem at 12% -8%, rgba(124,92,255,0.16), transparent 60%)," +
            "radial-gradient(60rem 50rem at 108% 12%, rgba(34,211,238,0.10), transparent 58%)," +
            "radial-gradient(75rem 60rem at 50% 118%, rgba(124,92,255,0.12), transparent 62%)," +
            "radial-gradient(45rem 40rem at 82% 78%, rgba(244,114,182,0.06), transparent 60%)",
        }}
      />
      {/* Diagonal "brush stroke" sweeps for painterly depth. */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(125deg, transparent 30%, rgba(96,130,255,0.05) 48%, transparent 62%)," +
            "linear-gradient(215deg, transparent 40%, rgba(34,211,238,0.04) 55%, transparent 70%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Hand-painted grain so the dark reads as canvas, not void. */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Gentle vignette to focus the center content. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(6,6,12,0.55) 100%)",
        }}
      />
    </div>
  );
}

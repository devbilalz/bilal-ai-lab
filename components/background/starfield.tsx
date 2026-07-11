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

/**
 * Galaxy starfield: a fixed, behind-everything canvas of minimal drifting stars
 * with faint "neural constellation" links between nearby stars - an AI-model
 * feel without stealing focus. Reduced-motion → a single static frame.
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

      const count = Math.min(120, Math.round((w * h) / 14000));
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
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Faint constellation links (the "neural net" texture).
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            const o = (1 - Math.sqrt(d2) / 120) * 0.12;
            ctx.strokeStyle = `rgba(124, 92, 255, ${o})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Stars.
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
        const alpha = 0.25 + s.z * 0.55 * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 214, 255, ${alpha})`;
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
      {/* Nebula wash - subtle violet + cyan glows for depth. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 40rem at 15% -5%, rgba(124,92,255,0.14), transparent 60%), radial-gradient(50rem 40rem at 100% 20%, rgba(34,211,238,0.08), transparent 55%), radial-gradient(70rem 50rem at 50% 120%, rgba(124,92,255,0.10), transparent 60%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

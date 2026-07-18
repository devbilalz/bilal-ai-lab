"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useThemeRuntime } from "@/components/providers/theme-provider";

interface Star {
  x: number;
  y: number;
  z: number; // depth 0..1 (parallax + size)
  tw: number; // twinkle phase
  vx: number;
  vy: number;
  hue: number;
}

interface Anchor {
  x: number;
  y: number;
  r: number; // base glow radius
  phase: number;
  speed: number;
  color: [number, number, number];
}

interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  alpha: number;
  stretch: number;
  depth: number;
}

interface Bird {
  x: number;
  y: number;
  scale: number;
  speed: number;
  wing: number;
}

const ANCHOR_COLORS: [number, number, number][] = [
  [124, 92, 255], // violet
  [34, 211, 238], // cyan
  [168, 146, 255], // soft violet
  [96, 130, 255], // indigo
  [244, 114, 182], // magenta
];

function cssNumber(styles: CSSStyleDeclaration, name: string, fallback: number) {
  const value = Number.parseFloat(styles.getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

function cssRgb(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return (styles.getPropertyValue(name).trim() || fallback)
    .split(/\s+/)
    .join(", ");
}

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
  const { phase, sunProgress } = useThemeRuntime();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let anchors: Anchor[] = [];
    let clouds: Cloud[] = [];
    let birds: Bird[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;

    const random = (() => {
      let seedValue = 4279;
      return () => {
        seedValue = (seedValue * 1664525 + 1013904223) % 4294967296;
        return seedValue / 4294967296;
      };
    })();

    const seed = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(86, Math.max(48, Math.round((w * h) / 23000)));
      const cx = w * 0.74;
      const cy = h * 0.31;
      const innerVoid = Math.min(w, h) * 0.13;
      const outerRing = Math.min(w, h) * 0.48;
      stars = Array.from({ length: count }, (_, i) => {
        const z = random();
        const onRing = i < count * 0.62;
        const angle = random() * Math.PI * 2;
        const radius = onRing
          ? innerVoid + random() * (outerRing - innerVoid)
          : Math.min(w, h) * (0.18 + random() * 0.55);
        const spreadX = 1.45 + random() * 0.55;
        const spreadY = 0.78 + random() * 0.42;
        const x = onRing ? cx + Math.cos(angle) * radius * spreadX : random() * w;
        const y = onRing ? cy + Math.sin(angle) * radius * spreadY : random() * h;

        return {
          x: Math.min(w + 40, Math.max(-40, x)),
          y: Math.min(h + 40, Math.max(-40, y)),
          z,
          tw: random() * Math.PI * 2,
          vx: (random() - 0.5) * 0.026 * (0.35 + z),
          vy: (random() - 0.5) * 0.026 * (0.35 + z),
          hue: [214, 190, 248, 168, 42][i % 5],
        };
      });

      const aCount = 7;
      anchors = Array.from({ length: aCount }, (_, i) => ({
        x: (w * (i + 0.5)) / aCount + (random() - 0.5) * w * 0.08,
        y: h * (0.2 + random() * 0.6),
        r: 90 + random() * 130,
        phase: random() * Math.PI * 2,
        speed: 0.0004 + random() * 0.0006,
        color: ANCHOR_COLORS[i % ANCHOR_COLORS.length],
      }));

      const cloudCount = Math.min(9, Math.max(4, Math.round(w / 240)));
      clouds = Array.from({ length: cloudCount }, (_, i) => ({
        x: random() * w,
        y: h * (0.1 + random() * 0.34),
        scale: 0.68 + random() * 1.25,
        speed: (0.028 + random() * 0.034) * (i % 2 === 0 ? 1 : 0.74),
        alpha: 0.16 + random() * 0.26,
        stretch: 0.9 + random() * 0.85,
        depth: random(),
      }));

      const birdCount = Math.min(10, Math.max(5, Math.round(w / 180)));
      birds = Array.from({ length: birdCount }, (_, i) => ({
        // Spread across a band wider than the viewport so some start off-screen
        // and enter "from behind" - staggered stream rather than one clump.
        x: random() * (w + 360) - 180,
        y: h * (0.18 + random() * 0.24),
        scale: 0.72 + random() * 1.15,
        speed: 0.62 + random() * 0.45,
        wing: random() * Math.PI * 2 + i,
      }));
    };

    const sunPosition = () => {
      const progress = Math.min(1, Math.max(0, sunProgress));
      const x = w * (0.1 + progress * 0.8);
      const horizonY = h * (phase === "evening" ? 0.86 : 0.78);
      const topY = h * 0.14;
      const y =
        horizonY -
        Math.sin(progress * Math.PI) *
          (horizonY - topY) *
          (phase === "evening" ? 0.7 : 1);
      return { x, y, progress };
    };

    const drawSun = () => {
      if (phase === "night") return;

      const { x, y } = sunPosition();
      const daylight = phase === "day";
      const warm = daylight ? [255, 226, 142] : [255, 157, 83];
      const horizonLift = 1 - Math.sin(sunProgress * Math.PI);
      const r = Math.min(w, h) * (daylight ? 0.038 : 0.046);
      const haze = r * (daylight ? 11 : 8.5);

      ctx.globalCompositeOperation = "lighter";

      // Broad atmospheric bloom: intentionally blurred and low contrast so it
      // reads as sunlight diffused through air, not stacked graphic rings.
      ctx.save();
      ctx.filter = `blur(${Math.max(18, r * 0.38)}px)`;
      const bloom = ctx.createRadialGradient(x, y, 0, x, y, haze);
      bloom.addColorStop(0, `rgba(255, 255, 235, ${daylight ? 0.32 : 0.26})`);
      bloom.addColorStop(0.18, `rgba(${warm[0]}, ${warm[1]}, ${warm[2]}, ${daylight ? 0.2 : 0.24})`);
      bloom.addColorStop(0.54, `rgba(${warm[0]}, ${Math.max(124, warm[1] - 34)}, ${Math.max(70, warm[2] - 44)}, 0.07)`);
      bloom.addColorStop(1, "rgba(255, 180, 90, 0)");
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(x, y, haze, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (!daylight) {
        ctx.save();
        ctx.filter = "blur(28px)";
        const horizon = ctx.createRadialGradient(x, h * 0.82, 0, x, h * 0.82, Math.min(w, h) * 0.48);
        horizon.addColorStop(0, `rgba(255, 140, 74, ${0.18 + horizonLift * 0.08})`);
        horizon.addColorStop(0.5, "rgba(255, 172, 112, 0.07)");
        horizon.addColorStop(1, "rgba(255, 172, 112, 0)");
        ctx.fillStyle = horizon;
        ctx.beginPath();
        ctx.ellipse(x, h * 0.82, Math.min(w, h) * 0.52, Math.min(w, h) * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.filter = `blur(${Math.max(4, r * 0.08)}px)`;
      const corona = ctx.createRadialGradient(x, y, r * 0.18, x, y, r * 3.2);
      corona.addColorStop(0, "rgba(255,255,246,0.82)");
      corona.addColorStop(0.2, `rgba(255, 245, 178, ${daylight ? 0.48 : 0.58})`);
      corona.addColorStop(0.48, `rgba(${warm[0]}, ${warm[1]}, ${warm[2]}, 0.16)`);
      corona.addColorStop(1, "rgba(255, 184, 92, 0)");
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const disc = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, 0, x, y, r * 1.2);
      disc.addColorStop(0, "rgba(255,255,250,0.96)");
      disc.addColorStop(0.42, "rgba(255,252,206,0.9)");
      disc.addColorStop(0.78, `rgba(${warm[0]},${warm[1]},${warm[2]},0.42)`);
      disc.addColorStop(1, `rgba(${warm[0]},${Math.max(110, warm[1] - 42)},${Math.max(58, warm[2] - 52)},0.03)`);
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
    };

    const drawCloud = (cloud: Cloud) => {
      const cloudTint =
        phase === "day" ? "255,255,255" : phase === "morning" ? "255,229,198" : "255,174,154";
      const shadowTint =
        phase === "day" ? "126, 166, 202" : phase === "morning" ? "207, 143, 96" : "99, 55, 92";
      const alpha = phase === "day" ? cloud.alpha : cloud.alpha * (phase === "evening" ? 0.78 : 0.58);
      const x = cloud.x;
      const y =
        phase === "evening"
          ? h * (0.32 + cloud.depth * 0.32)
          : phase === "morning"
            ? h * (0.16 + cloud.depth * 0.24)
            : cloud.y;
      const s = cloud.scale * (phase === "evening" ? 0.9 + cloud.depth * 0.75 : 1);
      const stretch = cloud.stretch * (phase === "evening" ? 1.35 : 1);

      ctx.save();
      ctx.filter = `blur(${Math.max(5, s * (phase === "day" ? 3.2 : 5.5))}px)`;

      ctx.fillStyle = `rgba(${shadowTint},${alpha * (phase === "day" ? 0.18 : 0.2)})`;
      ctx.beginPath();
      ctx.ellipse(x, y + 10 * s, 58 * s * stretch, 17 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 34 * s * stretch, y + 10 * s, 34 * s, 13 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 38 * s * stretch, y + 9 * s, 36 * s, 13 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${cloudTint},${alpha})`;
      ctx.beginPath();
      ctx.ellipse(x, y, 48 * s * stretch, 16 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 34 * s * stretch, y + 4 * s, 32 * s, 12 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 36 * s * stretch, y + 4 * s, 36 * s, 13 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 14 * s * stretch, y - 10 * s, 25 * s, 18 * s, -0.12, 0, Math.PI * 2);
      ctx.ellipse(x + 18 * s * stretch, y - 8 * s, 30 * s, 17 * s, 0.08, 0, Math.PI * 2);
      ctx.fill();

      if (phase === "evening") {
        ctx.fillStyle = `rgba(255, 118, 102, ${alpha * 0.16})`;
        ctx.beginPath();
        ctx.ellipse(x + 12 * s, y + 4 * s, 60 * s * stretch, 12 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawBird = (bird: Bird, t: number) => {
      const flap = Math.sin(t * 0.006 + bird.wing);
      const direction = phase === "morning" ? 1 : -1;
      const ink =
        phase === "morning" ? "rgba(58, 43, 36, 0.24)" : "rgba(24, 17, 34, 0.34)";

      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.scale(direction * bird.scale, bird.scale);
      ctx.rotate((phase === "morning" ? -0.04 : 0.04) + flap * 0.015);
      ctx.fillStyle = ink;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 0.8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Small natural silhouette: body, head, and two asymmetric wing curves.
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.2, 1.35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(3.2, -0.45, 0.95, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(3.9, -0.45);
      ctx.lineTo(5.7, -0.1);
      ctx.lineTo(3.9, 0.15);
      ctx.closePath();
      ctx.fill();

      const wingLift = 5.4 + flap * 2.2;
      ctx.beginPath();
      ctx.moveTo(-0.6, -0.25);
      ctx.bezierCurveTo(-4.5, -wingLift, -10.5, -wingLift * 0.55, -14, -1.6);
      ctx.bezierCurveTo(-9.5, -0.9, -4.6, 0.2, -0.6, 0.35);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0.1, 0.45);
      ctx.bezierCurveTo(-3.2, 3.2 + flap * 0.8, -7.8, 2.6, -10.8, 1.4);
      ctx.bezierCurveTo(-7.2, 1.1, -3.4, 0.4, 0.1, -0.1);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawAtmosphere = (t: number, dtScale: number) => {
      drawSun();

      if (phase === "day" || phase === "morning" || phase === "evening") {
        for (const cloud of clouds) {
          if (!reduced) {
            const direction = phase === "evening" ? -0.55 : 1;
            const speed = phase === "day" ? cloud.speed : cloud.speed * 0.38;
            cloud.x += speed * direction * dtScale;
            // Wrap fully off-screen (clouds are wide) so they never pop in.
            if (cloud.x > w + 280) cloud.x = -280;
            if (cloud.x < -280) cloud.x = w + 280;
          }
          drawCloud(cloud);
        }
      }

      if (phase === "morning" || phase === "evening") {
        for (const bird of birds) {
          if (!reduced) {
            bird.x += (phase === "morning" ? bird.speed : -bird.speed) * dtScale;
            if (bird.x > w + 90) bird.x = -90;
            if (bird.x < -90) bird.x = w + 90;
          }
          drawBird(bird, t);
        }
      }
    };

    const drawNight = (t: number, dtScale: number) => {
      const styles = getComputedStyle(document.documentElement);
      const glowAlpha = cssNumber(styles, "--constellation-glow-alpha", 1);
      const lineAlpha = cssNumber(styles, "--constellation-line-alpha", 1);
      const nodeAlpha = cssNumber(styles, "--constellation-node-alpha", 1);
      const coreRgb = cssRgb(styles, "--constellation-core-rgb", "226 241 255");
      const coreAccentRgb = cssRgb(styles, "--constellation-core-accent-rgb", "34 211 238");

      // Soft activation glows - the "thinking" nebula bloom.
      ctx.globalCompositeOperation = "lighter";
      for (const a of anchors) {
        const pulse = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(t * a.speed + a.phase);
        const r = a.r * (0.75 + 0.35 * pulse);
        const [cr, cg, cb] = a.color;
        const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, r);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${(0.05 + 0.05 * pulse) * glowAlpha})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      const cx = w * 0.74;
      const cy = h * 0.31;
      const core = Math.min(w, h) * 0.12;
      const halo = ctx.createRadialGradient(cx, cy, core * 0.35, cx, cy, core * 2.5);
      halo.addColorStop(0, `rgba(${coreRgb}, ${0.12 * glowAlpha})`);
      halo.addColorStop(0.22, `rgba(${coreAccentRgb}, ${0.055 * glowAlpha})`);
      halo.addColorStop(0.42, `rgba(124, 92, 255, ${0.028 * glowAlpha})`);
      halo.addColorStop(1, "rgba(124, 92, 255, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, core * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Sparse constellation links. Keep the frame hollow, not webbed-in.
      const degree = new Array(stars.length).fill(0) as number[];
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          if (degree[i] >= 3 || degree[j] >= 3) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const maxLink = 170 + (a.z + b.z) * 42;
          if (d2 < maxLink * maxLink && d2 > 44 * 44) {
            const d = Math.sqrt(d2);
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const distFromCore = Math.hypot(midX - cx, midY - cy);
            if (distFromCore < core * 0.95) continue;

            const o = (1 - d / maxLink) * (distFromCore < core * 1.7 ? 0.045 : 0.085);
            ctx.strokeStyle = `hsla(${Math.round((a.hue + b.hue) / 2)}, 88%, 74%, ${o * lineAlpha})`;
            ctx.lineWidth = 0.45 + Math.min(a.z, b.z) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            degree[i] += 1;
            degree[j] += 1;
          }
        }
      }

      // Nodes.
      for (const s of stars) {
        if (!reduced) {
          s.x += s.vx * dtScale;
          s.y += s.vy * dtScale;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;
        }
        const twinkle = reduced ? 0.7 : 0.5 + 0.5 * Math.sin(t * 0.001 + s.tw);
        const r = 0.45 + s.z * 1.1;
        const alpha = (0.22 + s.z * 0.5 * twinkle) * nodeAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 90%, 78%, ${alpha})`;
        ctx.fill();
      }
    };

    const draw = (t: number, dtScale: number) => {
      ctx.clearRect(0, 0, w, h);
      if (phase === "night") drawNight(t, dtScale);
      else drawAtmosphere(t, dtScale);
    };

    let raf = 0;
    let lastT = 0;
    const loop = (t: number) => {
      // Delta-time normalized to a 60fps frame; clamped so a slow frame or a
      // return from a background tab never teleports birds/clouds (no jerk).
      const dt = lastT ? Math.min(t - lastT, 48) : 16.6667;
      lastT = t;
      draw(t, dt / 16.6667);
      raf = requestAnimationFrame(loop);
    };

    seed();
    if (reduced) {
      draw(0, 0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      seed();
      if (reduced) draw(0, 0);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [phase, reduced, sunProgress]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Deep base wash so it is never flat black. */}
      <div
        className="absolute inset-0"
        style={{
          background: "var(--sky-wash)",
        }}
      />
      {/* Diagonal "brush stroke" sweeps for painterly depth. */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: "var(--sky-stroke)",
        }}
      />
      <div className="runtime-section-aurora absolute inset-0" />
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
          background: "var(--sky-vignette)",
        }}
      />
    </div>
  );
}

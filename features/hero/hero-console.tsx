"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Plus, ChevronDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { heroModels, type HeroModel, type DescRun } from "@/lib/content/hero-models";
import {
  heroQA,
  type QAItem,
  type QAAnswer,
  type AnswerBlock,
} from "@/lib/content/hero-qa";
import { TerminalText } from "@/components/animations/terminal-text";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { isBootDone, onBootDone } from "@/lib/hero-intro";
import { setDeepDiveOrigin } from "@/lib/nav-history";

/** Plays once per full load; stays quiet on in-app returns to home. */
let heroPlayedThisLoad = false;

/**
 * In-memory chat session. Module scope survives client-side route changes, so
 * clicking a link out of the console and returning resumes the transcript
 * instead of restarting. A full page reload clears the module and resets it.
 */
let heroSession: HeroSession | null = null;

interface HeroSession {
  modelId: string;
  history: Turn[];
  current: QAItem | null;
  phase: Phase;
}

const TYPE_SPEED = 42; // ms per character while a question types into the input
const THINK_MS = 600;

type Phase = "idle" | "typing" | "ready" | "thinking" | "answering" | "end";

interface Turn {
  itemId: string;
  modelId: string;
  modelName: string;
  question: string;
  answer: QAAnswer;
}

const EM_CLASS =
  "font-semibold text-foreground [text-shadow:0_0_24px_var(--accent-glow)]";

const wordV: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const cluster = (delayChildren: number, staggerChildren: number): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
});

const fade = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
  },
});

/* ---------- queue helpers ---------- */

/** The shared intro item, derived from the model so it never drifts. */
function introItem(model: HeroModel): QAItem {
  return {
    id: `${model.id}-intro`,
    question: model.prompt,
    answer: {
      blocks: [
        { kind: "heading", text: model.headline },
        { kind: "tagline", text: model.tagline },
        { kind: "text", runs: model.description },
      ],
      chips: model.chips,
      ctas: [
        { label: "Explore My Work", href: model.ctaHref },
        { label: "Resume", href: "/resources" },
      ],
    },
  };
}

function queueFor(id: string): QAItem[] {
  const model = heroModels.find((m) => m.id === id) ?? heroModels[0];
  return [introItem(model), ...(heroQA[id] ?? [])];
}

function nextUnasked(id: string, hist: Turn[]): QAItem | null {
  const asked = new Set(
    hist.filter((h) => h.modelId === id).map((h) => h.itemId),
  );
  return queueFor(id).find((it) => !asked.has(it.id)) ?? null;
}

function turnOf(modelId: string, modelName: string, item: QAItem): Turn {
  return {
    itemId: item.id,
    modelId,
    modelName,
    question: item.question,
    answer: item.answer,
  };
}

/**
 * Resume a persisted session to a stable state. Anything mid-animation
 * (typing/thinking/answering) is settled: an in-flight answer is committed to
 * the transcript, then the next question is parked at "ready" (no replay).
 */
function normalizeSession(s: HeroSession): HeroSession {
  const { modelId } = s;
  let { history, current, phase } = s;
  if (phase === "answering" && current) {
    const name = heroModels.find((m) => m.id === modelId)?.name ?? modelId;
    history = [...history, turnOf(modelId, name, current)];
    current = nextUnasked(modelId, history);
    phase = current ? "ready" : "end";
  } else if (phase === "idle" || phase === "typing" || phase === "thinking") {
    phase = current ? "ready" : "end";
  }
  return { modelId, history, current, phase };
}

/* ---------- answer duration estimate (drives auto-advance) ---------- */

function runsWords(runs: DescRun[]): number {
  return runs.reduce((n, r) => n + r.t.split(/\s+/).filter(Boolean).length, 0);
}

function blockWords(b: AnswerBlock): number {
  switch (b.kind) {
    case "heading":
    case "tagline":
      return b.text.split(/\s+/).filter(Boolean).length;
    case "text":
    case "note":
      return runsWords(b.runs);
    case "bullets":
      return b.items.reduce((n, it) => n + runsWords(it), 0);
    case "stats":
      return b.items.length * 2;
  }
}

function estimateAnswerMs(a: QAAnswer): number {
  let c = 0;
  for (const b of a.blocks) c += 0.15 + blockWords(b) * 0.02;
  if (a.chips?.length) c += 0.15 + a.chips.length * 0.03;
  if (a.ctas?.length) c += 0.2;
  return Math.max(1100, Math.min((c + 0.6) * 1000, 5000));
}

/* ---------- answer rendering ---------- */

function Words({ runs }: { runs: DescRun[] }) {
  const words: { w: string; em?: boolean }[] = [];
  for (const r of runs) {
    for (const part of r.t.split(" ")) {
      if (part.length) words.push({ w: part, em: r.em });
    }
  }
  return (
    <>
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={wordV}
          className={cn("inline-block whitespace-pre", w.em && EM_CLASS)}
        >
          {w.w + " "}
        </motion.span>
      ))}
    </>
  );
}

function Plain({ runs }: { runs: DescRun[] }) {
  return (
    <>
      {runs.map((r, i) => (
        <span key={i} className={cn(r.em && EM_CLASS)}>
          {r.t}
        </span>
      ))}
    </>
  );
}

function Block({ block, delay }: { block: AnswerBlock; delay: number }) {
  switch (block.kind) {
    case "heading":
      return (
        <motion.h2
          variants={cluster(delay, 0.05)}
          className="text-balance text-2xl font-semibold tracking-tight sm:text-4xl"
        >
          <Words runs={[{ t: block.text }]} />
        </motion.h2>
      );
    case "tagline":
      return (
        <motion.p
          variants={fade(delay)}
          className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent sm:text-xs"
        >
          {block.text}
        </motion.p>
      );
    case "text":
      return (
        <motion.p
          variants={cluster(delay, 0.016)}
          className="text-sm leading-relaxed text-muted sm:text-base"
        >
          <Words runs={block.runs} />
        </motion.p>
      );
    case "note":
      return (
        <motion.p
          variants={fade(delay)}
          className="border-l-2 border-accent/40 pl-3 text-xs leading-relaxed text-subtle"
        >
          <Plain runs={block.runs} />
        </motion.p>
      );
    case "bullets":
      return (
        <motion.ul variants={cluster(delay, 0.06)} className="space-y-1.5">
          {block.items.map((it, i) => (
            <motion.li
              key={i}
              variants={wordV}
              className="flex gap-2 text-sm leading-relaxed text-muted"
            >
              <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
              <span>
                <Plain runs={it} />
              </span>
            </motion.li>
          ))}
        </motion.ul>
      );
    case "stats":
      return (
        <motion.div variants={cluster(delay, 0.06)} className="flex flex-wrap gap-2">
          {block.items.map((s, i) => (
            <motion.div
              key={i}
              variants={wordV}
              className="rounded-lg border border-border-strong/60 bg-background-elevated/60 px-3 py-1.5"
            >
              <span className="font-mono text-sm font-semibold text-foreground">
                {s.value}
              </span>{" "}
              <span className="text-[0.7rem] text-subtle">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      );
  }
}

function AssistantAnswer({
  modelName,
  answer,
  reveal,
  instant,
}: {
  modelName: string;
  answer: QAAnswer;
  reveal: boolean;
  instant: boolean;
}) {
  let cursor = 0;
  const at = (words: number) => {
    const start = cursor;
    cursor += 0.15 + words * 0.02;
    return start;
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: reveal ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      <div className="w-full max-w-[92%]">
        <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-widest text-subtle">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent-glow)]" />
          {modelName}
        </div>

        <motion.div
          initial={instant ? "visible" : "hidden"}
          animate={reveal ? "visible" : "hidden"}
          className="space-y-3"
        >
          <div className="space-y-3 rounded-2xl rounded-tl-sm border border-border bg-surface/55 p-4 backdrop-blur sm:p-5">
            {answer.blocks.map((b, i) => (
              <Block key={i} block={b} delay={at(blockWords(b))} />
            ))}
          </div>

          {answer.chips?.length ? (
            <motion.div
              variants={cluster(at(answer.chips.length), 0.05)}
              className="grid grid-cols-2 gap-2 sm:grid-cols-3"
            >
              {answer.chips.map((c) => (
                <motion.div
                  key={c}
                  variants={wordV}
                  className="rounded-lg border border-border-strong/60 bg-background-elevated/60 px-3 py-2 text-center font-mono text-[0.64rem] uppercase tracking-widest text-subtle"
                >
                  {c}
                </motion.div>
              ))}
            </motion.div>
          ) : null}

          {answer.ctas?.length ? (
            <motion.div variants={fade(at(2))} className="flex flex-wrap gap-2 pt-1">
              {answer.ctas.map((c, i) => (
                <Link
                  key={c.href + c.label}
                  href={c.href}
                  onClick={() => {
                    if (c.href.startsWith("/deep-dives")) setDeepDiveOrigin("chat");
                  }}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    i === 0
                      ? "bg-accent text-accent-contrast hover:opacity-90"
                      : "border border-border-strong text-foreground hover:bg-surface",
                  )}
                >
                  {c.label}
                </Link>
              ))}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  );
}

function UserBubble({ text, animateIn }: { text: string; animateIn: boolean }) {
  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] rounded-2xl rounded-br-sm border border-accent/30 bg-accent/12 px-4 py-2.5 text-sm text-foreground">
        {text}
      </div>
    </motion.div>
  );
}

/* ---------- main component ---------- */

export function HeroConsole() {
  const reduced = usePrefersReducedMotion();
  const coreModel = heroModels[0];

  // Seed once: resume a persisted session if present; otherwise start fresh
  // (auto-play intro) or, on reduced-motion / in-app returns, park the next
  // question at "ready" with the intro answer already in the transcript.
  const initRef = useRef<{ seed: HeroSession; autoSend: boolean } | null>(null);
  if (initRef.current === null) {
    const restored = heroSession ? normalizeSession(heroSession) : null;
    if (restored) {
      initRef.current = { seed: restored, autoSend: false };
    } else {
      const preplayed = reduced || heroPlayedThisLoad;
      const history: Turn[] = preplayed
        ? [turnOf(coreModel.id, coreModel.name, introItem(coreModel))]
        : [];
      const current = preplayed
        ? nextUnasked(coreModel.id, history)
        : introItem(coreModel);
      const phase: Phase = preplayed ? (current ? "ready" : "end") : "idle";
      initRef.current = {
        seed: { modelId: coreModel.id, history, current, phase },
        autoSend: !preplayed,
      };
    }
  }
  const seed = initRef.current.seed;

  const [modelId, setModelId] = useState(seed.modelId);
  const [history, setHistory] = useState<Turn[]>(seed.history);
  const [current, setCurrent] = useState<QAItem | null>(seed.current);
  const [phase, setPhase] = useState<Phase>(seed.phase);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Only the very first question on a fresh load auto-sends (the signature
  // intro). Everything after that waits for the visitor to press Enter.
  const autoSendRef = useRef(initRef.current.autoSend);

  const model = heroModels.find((m) => m.id === modelId) ?? coreModel;
  const busy = phase === "typing" || phase === "thinking" || phase === "answering";
  const canSend = phase === "ready";

  // If the final answer already handed over contact + resume (Core's last
  // question does), the closer shouldn't repeat them - keep it to "switch lens".
  const lastAnswerHadContact = !!history[history.length - 1]?.answer.ctas?.some(
    (c) =>
      c.href.startsWith("mailto:") ||
      c.href === "/#contact" ||
      c.href === "/resources",
  );

  /* boot gate -> start typing the first question */
  useEffect(() => {
    if (phase !== "idle") return;
    const start = () => setPhase("typing");
    if (isBootDone()) {
      start();
      return;
    }
    return onBootDone(start);
  }, [phase]);

  /* snapshot the session so an in-app return resumes where we left off */
  useEffect(() => {
    heroSession = { modelId, history, current, phase };
  }, [modelId, history, current, phase]);

  /* typing -> auto-send (first only) or wait at "ready" */
  useEffect(() => {
    if (phase !== "typing" || !current) return;
    const dur = reduced ? 250 : current.question.length * TYPE_SPEED + 450;
    const t = setTimeout(() => {
      if (autoSendRef.current) {
        autoSendRef.current = false;
        setPhase("thinking");
      } else {
        setPhase("ready");
      }
    }, dur);
    return () => clearTimeout(t);
  }, [phase, current, reduced]);

  /* thinking -> answering */
  useEffect(() => {
    if (phase !== "thinking") return;
    const t = setTimeout(() => setPhase("answering"), reduced ? 200 : THINK_MS);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  /* answering finishes -> commit to history, queue the next question */
  useEffect(() => {
    if (phase !== "answering" || !current) return;
    const dur = reduced ? 400 : estimateAnswerMs(current.answer);
    const t = setTimeout(() => {
      heroPlayedThisLoad = true;
      const committed = [...history, turnOf(modelId, model.name, current)];
      setHistory(committed);
      const nxt = nextUnasked(modelId, committed);
      if (nxt) {
        autoSendRef.current = false;
        setCurrent(nxt);
        setPhase("typing");
      } else {
        setCurrent(null);
        setPhase("end");
      }
    }, dur);
    return () => clearTimeout(t);
  }, [phase, current, history, modelId, model.name, reduced]);

  /* on mount (incl. resumed session), jump straight to the newest message */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  /* keep the newest message in view as the tour progresses */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
    }
  }, [history.length, phase, reduced]);

  /* Enter sends the pending question */
  useEffect(() => {
    if (phase !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setPhase("thinking");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  /* close the model menu on outside click / Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function submit() {
    if (phase === "ready") setPhase("thinking");
  }

  function selectModel(id: string) {
    setMenuOpen(false);
    if (id === modelId) return;
    // Keep the transcript. If an answer is on screen, commit it first.
    let base = history;
    if (phase === "answering" && current) {
      base = [...history, turnOf(modelId, model.name, current)];
      setHistory(base);
      heroPlayedThisLoad = true;
    }
    setModelId(id);
    const nxt = nextUnasked(id, base);
    if (nxt) {
      autoSendRef.current = false;
      setCurrent(nxt);
      setPhase("typing");
    } else {
      setCurrent(null);
      setPhase("end");
    }
  }

  return (
    <div className="relative z-10 flex h-[82vh] max-h-[820px] min-h-[540px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background-elevated/40 backdrop-blur">
      {/* Transcript */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-8"
      >
        {history.map((turn) => (
          <div key={`${turn.modelId}:${turn.itemId}`} className="space-y-4">
            <UserBubble text={turn.question} animateIn={false} />
            <AssistantAnswer
              modelName={turn.modelName}
              answer={turn.answer}
              reveal
              instant
            />
          </div>
        ))}

        {(phase === "thinking" || phase === "answering") && current && (
          <UserBubble text={current.question} animateIn />
        )}

        {phase === "thinking" && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-surface/55 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-1.5 rounded-full bg-accent-soft"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}

        {phase === "answering" && current && (
          <AssistantAnswer
            key={`live:${current.id}`}
            modelName={model.name}
            answer={current.answer}
            reveal
            instant={reduced}
          />
        )}

        {phase === "end" && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="w-full max-w-[92%] rounded-2xl rounded-tl-sm border border-border bg-surface/55 p-4 text-sm leading-relaxed text-muted sm:p-5">
              That&apos;s the tour for the{" "}
              <span className="font-medium text-foreground">{model.name}</span>{" "}
              lens. Switch lenses below to explore AI infrastructure, backend
              systems, leadership, or the general overview
              {lastAnswerHadContact
                ? "."
                : " - or reach out when you'd like to talk it through directly."}
              {!lastAnswerHadContact && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/#contact"
                    className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-contrast hover:opacity-90"
                  >
                    Get in touch
                  </Link>
                  <Link
                    href="/resources"
                    className="rounded-full border border-border-strong px-4 py-2 text-xs font-medium text-foreground hover:bg-surface"
                  >
                    Resume
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar (bottom) - model selector lives here */}
      <div className="border-t border-border bg-surface/40 p-3 backdrop-blur sm:p-3.5">
        <div className="flex items-center gap-2 rounded-2xl border border-border-strong bg-background-elevated/70 px-3 py-2">
          <Plus className="size-4 shrink-0 text-subtle" />

          <div className="min-w-0 flex-1 truncate font-mono text-sm">
            {phase === "typing" && current ? (
              <TerminalText
                text={current.question}
                prompt=""
                speed={TYPE_SPEED}
                className="text-foreground/90"
              />
            ) : phase === "ready" && current ? (
              <span className="text-foreground/90">{current.question}</span>
            ) : phase === "end" ? (
              <span className="text-subtle">Switch a lens, or reach out</span>
            ) : (
              <span className="text-subtle">Ask {model.name}</span>
            )}
          </div>

          {canSend && (
            <span className="hidden shrink-0 font-mono text-[0.62rem] uppercase tracking-widest text-subtle sm:inline">
              press enter
            </span>
          )}

          {/* Model selector (menu opens upward) */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-foreground transition-colors hover:bg-surface"
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  busy ? "animate-pulse bg-warn" : "bg-online",
                )}
              />
              <span className="font-semibold">{model.name}</span>
              <ChevronDown
                className={cn(
                  "size-3.5 text-subtle transition-transform",
                  menuOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.ul
                  role="listbox"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute bottom-full right-0 z-30 mb-2 w-60 overflow-hidden rounded-lg border border-border bg-background-elevated shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                >
                  {heroModels.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={m.id === modelId}
                        onClick={() => selectModel(m.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-surface",
                          m.id === modelId && "bg-surface/60",
                        )}
                      >
                        <span className="flex flex-col">
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {m.name}
                          </span>
                          <span className="text-[0.68rem] text-subtle">
                            {m.role}
                          </span>
                        </span>
                        {m.id === modelId && (
                          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent-glow)]" />
                        )}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Send */}
          <div className="relative shrink-0">
            {canSend && !reduced && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full border border-accent"
                animate={{ opacity: [0.6, 0], scale: [1, 1.55] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <button
              type="button"
              disabled={!canSend}
              onClick={submit}
              aria-label={canSend ? "Send question" : "Waiting"}
              className={cn(
                "relative grid size-8 place-items-center rounded-full transition",
                canSend
                  ? "cursor-pointer bg-accent text-accent-contrast shadow-[0_0_16px_var(--accent-glow)] hover:opacity-90"
                  : "cursor-not-allowed bg-accent/25 text-accent-contrast/50",
              )}
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

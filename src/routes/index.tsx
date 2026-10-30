import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PixelBackground } from "@/components/PixelBackground";
import { cards, type PortfolioCard } from "@/data/cards";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Kavisha alwis" },
      { name: "description", content: "A retro, card-based portfolio of a first-year physical science student." },
      { property: "og:title", content: "Portfolio — Kavisha Alwis" },
      { property: "og:description", content: "Cs, maths and side quests — a retro card portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const toneClass: Record<PortfolioCard["tone"], string> = {
  primary: "bg-primary text-primary-foreground",
  paper: "bg-paper text-paper-foreground",
  dark: "bg-card text-card-foreground border border-border",
};

const spring = { type: "spring", stiffness: 220, damping: 28 } as const;

function Index() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const n = cards.length;

  const go = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) {
        if (e.key === "Escape") setOpen(null);
        return;
      }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Enter") setOpen(cards[active]?.id ?? null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active, go]);

  const openCard = cards.find((c) => c.id === open);

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden">
      <PixelBackground />

      {/* Header */}
      <header className="relative z-10 flex items-start justify-between px-6 pt-6 md:px-12 md:pt-10">
        <div className="font-pixel text-xs leading-tight text-muted-foreground">
          Welcome
          <br />
          to my
        </div>
        <div className="font-term text-xl text-phosphor">
          ● REC <span className="blink">_</span>
        </div>
      </header>

      <section className="relative z-10 mx-auto mt-4 w-full max-w-6xl px-6 text-center">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
          className="absolute inset-y-0 left-0 right-0 mx-auto w-[18%] origin-top bg-primary"
        />
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 font-display text-[15vw] leading-[0.85] tracking-tight md:text-[10rem]"
        >
          <span className="text-outline">PORT</span>FOLIO
        </motion.h1>
        <div className="relative mt-3 flex justify-between font-pixel text-[10px] uppercase text-muted-foreground md:text-xs">
          <span>KAVISHA ALWIS</span>
          <span>Physical Science · Y1</span>
        </div>
      </section>

      {/* Card fan */}
      <section className="relative z-10 flex flex-1 items-center justify-center" style={{ perspective: 1400 }}>
        <motion.div
          className="relative h-[380px] w-full md:h-[440px]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
        >
          {cards.map((card, i) => {
            let off = i - active;
            if (off > n / 2) off -= n;
            if (off < -n / 2) off += n;
            const abs = Math.abs(off);
            const hidden = open === card.id;
            return (
              <motion.button
                key={card.id}
                layoutId={`card-${card.id}`}
                onClick={() => (off === 0 ? setOpen(card.id) : setActive(i))}
                className={cn(
                  "shadow-card absolute left-1/2 top-1/2 -ml-[115px] -mt-[160px] flex h-[320px] w-[230px] flex-col justify-between rounded-[var(--radius)] p-5 text-left md:-ml-[135px] md:-mt-[190px] md:h-[380px] md:w-[270px]",
                  toneClass[card.tone],
                )}
                animate={{
                  x: off * 190,
                  y: abs * abs * 18,
                  rotate: off * 9,
                  scale: 1 - abs * 0.08,
                  opacity: hidden ? 0 : abs > 2 ? 0 : 1,
                  zIndex: 10 - abs,
                }}
                whileHover={off === 0 ? { y: -14, rotate: 0 } : { y: abs * abs * 18 - 8 }}
                transition={spring}
                style={{ borderRadius: 20 }}
              >
                <CardFace card={card} />
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* Controls */}
      <footer className="relative z-10 flex items-center justify-center gap-6 pb-8 font-pixel text-xs">
        <button onClick={() => go(-1)} className="rounded border border-border px-3 py-2 hover:bg-secondary" aria-label="Previous">
          ◀
        </button>
        <div className="flex gap-2">
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              aria-label={c.title}
              className={cn("h-2 w-2 transition-all", i === active ? "w-6 bg-primary" : "bg-muted-foreground/40")}
            />
          ))}
        </div>
        <button onClick={() => go(1)} className="rounded border border-border px-3 py-2 hover:bg-secondary" aria-label="Next">
          ▶
        </button>
        <span className="absolute right-6 hidden text-muted-foreground md:block">
          Press <span className="text-primary">Enter</span> to start
        </span>
      </footer>

      <AnimatePresence>{openCard && <Expanded card={openCard} onClose={() => setOpen(null)} />}</AnimatePresence>
    </main>
  );
}

function CardFace({ card }: { card: PortfolioCard }) {
  return (
    <>
      <div className="flex items-center justify-between font-pixel text-[10px] uppercase opacity-80">
        <span>{card.label}</span>
        <span>{card.index}</span>
      </div>
      <div className="grid flex-1 place-items-center">
        <span className="font-display text-7xl md:text-8xl">{card.glyph}</span>
      </div>
      <div>
        <div className="mb-2 h-px w-full bg-current opacity-30" />
        <h3 className="font-display text-2xl uppercase leading-none">{card.title}</h3>
      </div>
    </>
  );
}

const container: Variants = {
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 160, damping: 20 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.15 } },
};

function LinkIcon({ k }: { k: string }) {
  if (k === "GitHub") return <Github className="h-5 w-5" />;
  if (k === "LinkedIn") return <Linkedin className="h-5 w-5" />;
  return <Mail className="h-5 w-5" />;
}

function Expanded({ card, onClose }: { card: PortfolioCard; onClose: () => void }) {
  return (
    <motion.div
      layoutId={`card-${card.id}`}
      transition={spring}
      style={{ borderRadius: 0 }}
      className={cn("fixed inset-0 z-50 overflow-y-auto", toneClass[card.tone])}
    >
      <div className="scanlines pointer-events-none fixed inset-0 opacity-40" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="relative mx-auto flex min-h-full max-w-5xl flex-col px-6 py-8 md:px-12 md:py-12"
      >
        <motion.div variants={item} className="flex items-center justify-between font-pixel text-xs uppercase">
          <span>
            {card.index} / {card.label}
          </span>
          <button onClick={onClose} className="rounded border border-current px-3 py-2 opacity-80 hover:opacity-100">
            ✕ Esc
          </button>
        </motion.div>

        <div className="mt-12 grid flex-1 items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <motion.h2 variants={item} className="font-display text-6xl uppercase leading-[0.9] md:text-8xl">
              {card.title}
            </motion.h2>
            <motion.p variants={item} className="mt-6 max-w-xl text-lg opacity-85 md:text-xl">
              {card.intro}
            </motion.p>
          </div>
          <motion.div
            variants={{
              hidden: { scale: 0, rotate: -90 },
              show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 12, delay: 0.4 } },
              exit: { scale: 0 },
            }}
            className="font-display text-[10rem] leading-none md:text-[14rem]"
          >
            {card.glyph}
          </motion.div>
        </div>

        {card.comingSoon ? (
          <motion.div
            variants={item}
            className="mx-auto mt-12 w-full max-w-xl self-center border-2 border-current bg-black/70 p-6 text-center shadow-[0_0_0_4px_rgba(0,0,0,0.35)] md:p-8"
          >
            <p className="font-pixel text-[10px] uppercase tracking-widest opacity-70">
              SYSTEM MESSAGE · ERR_JOURNAL_EMPTY (0x2A)
            </p>
            <p className="mt-5 font-term text-3xl md:text-4xl">
              ▓▒░ COMING SOON ░▒▓
            </p>
            <p className="mt-5 font-term text-sm leading-relaxed opacity-85">
              {">"} rebooting logbook...
              <br />
              {">"} loading entries... 0/3
              <br />
              {">"} ERROR: the author is still levelling up.
            </p>
            <p className="mt-6 font-pixel text-[10px] uppercase opacity-60">
              press any key to continue <span className="inline-block animate-pulse">▮</span>
            </p>
          </motion.div>
        ) : (
          <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-current/20 md:grid-cols-2">
            {card.items.map((it, i) => (
              <motion.li
                key={i}
                variants={item}
                className="flex items-baseline justify-between gap-4 border-b border-current/15 p-5 last:border-b-0"
              >
                <span className="font-pixel text-[10px] uppercase opacity-70">{it.k}</span>
                {it.href ? (
                  <span className="inline-flex items-center gap-3">
                    {it.k !== "LinkedIn" && <span className="font-term text-2xl">{it.v}</span>}
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={it.k}
                      className="inline-flex items-center justify-center rounded border border-current/40 p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <LinkIcon k={it.k} />
                    </a>
                  </span>
                ) : (
                  <span className="font-term text-2xl">{it.v}</span>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
}

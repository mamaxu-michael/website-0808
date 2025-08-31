"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Item = {
  title: string;
  summary: string;
  details?: string[];
  gradient?: string;     // Tailwind 渐变，如 "from-fuchsia-500 to-violet-500"
  mediaSrc?: string;     // 可选：/public 下图片或 mp4
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);
  return reduced;
}

function AutoVideo({ src, className }: { src: string; className?: string }) {
  const [ref, setRef] = useState<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!ref) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) ref.play().catch(() => {});
      else ref.pause();
    }, { threshold: 0.4 });
    io.observe(ref);
    return () => io.disconnect();
  }, [ref]);
  return (
    <video
      ref={setRef}
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}

export default function ExpandableCards({
  items,
  className = "",
}: {
  items: Item[];
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  // 触摸设备：改为点击展开
  const isTouch = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || (navigator as any).maxTouchPoints > 0;
  }, []);

  // reveal 动效 token
  const reveal = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
  };

  return (
    <motion.div
      layout
      className={`mx-auto max-w-6xl px-6 ${className}`}
    >
      <div
        className="flex flex-wrap justify-center gap-6"
        // 为了更平滑的布局变化，外层也可换成 motion.div layout
      >
        {items.map((it, i) => {
          const isActive = active === i;
          // 激活时放大 flex-basis；否则为常规宽度
          const base = "basis-[320px] md:basis-[360px]";
          const grow = "md:basis-[560px]"; // 激活后的目标宽度

          return (
            <motion.div
              key={it.title + i}
              layout
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={reveal}
              onHoverStart={() => !isTouch && setActive(i)}
              onHoverEnd={() => !isTouch && setActive(null)}
              onClick={() => isTouch && setActive(isActive ? null : i)}
              aria-expanded={isActive}
              transition={
                reduced
                  ? undefined
                  : { layout: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } }
              }
              className={[
                "group relative overflow-hidden rounded-2xl border border-white/10",
                "bg-white/[0.04] text-white shadow-[0_10px_30px_rgba(0,0,0,.25)]",
                isActive ? grow : base,
                "w-full md:w-auto", // 允许在 flex-wrap 中按 basis 排列
                "cursor-pointer select-none",
                isActive ? "ring-1 ring-white/30" : "ring-1 ring-white/10",
                isActive ? "shadow-[0_16px_40px_rgba(0,0,0,.35)]" : "",
              ].join(" ")}
              style={{
                filter:
                  active !== null && !isActive ? "brightness(0.85) saturate(0.9)" : "none",
              }}
            >
              {/* 渐变雾罩（悬停更明显） */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${it.gradient ?? "from-violet-500/20 to-cyan-500/20"} opacity-0 blur-2xl transition duration-500 group-hover:opacity-100`}
              />

              {/* 媒体位：图片或视频 */}
              <div className="aspect-[16/10] w-full overflow-hidden">
                {it.mediaSrc?.endsWith(".mp4") ? (
                  <AutoVideo src={it.mediaSrc} className="h-full w-full object-cover" />
                ) : it.mediaSrc ? (
                  <img src={it.mediaSrc} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-neutral-900 to-neutral-800" />
                )}
              </div>

              {/* 文案区 */}
              <div className="p-6">
                <div className="text-lg md:text-xl font-semibold">{it.title}</div>
                <p className="mt-2 text-sm text-white/80">{it.summary}</p>

                {/* 展开后的更多内容 */}
                <AnimatePresence initial={false}>
                  {isActive && (it.details?.length ?? 0) > 0 && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                      exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
                      className="mt-4 space-y-2 text-sm text-white/80"
                    >
                      {it.details!.map((d, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                          <span>{d}</span>
                        </div>
                      ))}
                      <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-neutral-900 text-sm font-medium hover:scale-[1.02] transition">
                        Get started <span aria-hidden>→</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 描边随光增强 */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/30" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";

export type StudioFrag = {
  id: number;
  kind: "photo" | "note" | "ticket" | "sticker" | "audio";
  x: number;
  y: number;
  r: number;
  w: number;
  src?: string;
  text?: string;
  color?: string;
  tape?: string;
  [k: string]: unknown;
};

type PlanId = "editorial" | "scrapbook" | "postcard";

const PLANS: { id: PlanId; index: string; name: string; why: string }[] = [
  {
    id: "editorial",
    index: "方案 01",
    name: "Editorial",
    why: "将照片作为视觉主体，文字作为辅助信息。",
  },
  {
    id: "scrapbook",
    index: "方案 02",
    name: "Scrapbook",
    why: "让碎片自由倾斜交叠，模仿手工剪贴的随意感。",
  },
  {
    id: "postcard",
    index: "方案 03",
    name: "Postcard",
    why: "根据图片与文字的内容关系，尝试建立视觉层次。",
  },
];

const KIND_LABEL: Record<string, string> = {
  photo: "照片",
  note: "文字",
  ticket: "地图",
  sticker: "贴纸",
  audio: "音频",
};

const KIND_READS: { kind: string; label: string; read: string }[] = [
  { kind: "photo", label: "照片", read: "视觉内容" },
  { kind: "note", label: "文字", read: "信息内容" },
  { kind: "ticket", label: "地图", read: "地点关系" },
  { kind: "sticker", label: "贴纸", read: "情绪标记" },
  { kind: "audio", label: "音频", read: "现场氛围" },
];

function arrange(frags: StudioFrag[], plan: PlanId): StudioFrag[] {
  const photos = frags.filter((f) => f.kind === "photo" || f.kind === "ticket");
  const rest = frags.filter((f) => f.kind !== "photo" && f.kind !== "ticket");
  const out: StudioFrag[] = [];

  if (plan === "editorial") {
    photos.forEach((f, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      out.push({ ...f, x: 160 + col * 330, y: 110 + row * 320, w: 260, r: col === 0 ? -1.5 : 1.5 });
    });
    rest.forEach((f, i) => {
      out.push({ ...f, x: 860, y: 140 + i * 170, w: f.kind === "sticker" ? 90 : 250, r: i % 2 ? 2 : -2 });
    });
  } else if (plan === "scrapbook") {
    frags.forEach((f, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      out.push({
        ...f,
        x: 130 + col * 300 + (row % 2 ? 60 : 0),
        y: 100 + row * 270,
        w: f.kind === "sticker" ? 95 : 210 + ((i * 17) % 60),
        r: ((i % 2 ? 1 : -1) * (4 + (i * 3) % 9)),
      });
    });
  } else {
    const [hero, ...others] = photos;
    if (hero) out.push({ ...hero, x: 140, y: 120, w: 420, r: -2 });
    others.forEach((f, i) => {
      out.push({ ...f, x: 640 + (i % 2) * 250, y: 130 + Math.floor(i / 2) * 250, w: 220, r: i % 2 ? 3 : -3 });
    });
    rest.forEach((f, i) => {
      out.push({ ...f, x: 160 + i * 260, y: 620, w: f.kind === "sticker" ? 85 : 240, r: i % 2 ? -2 : 2 });
    });
  }
  return out;
}

export function AiLayoutStudio({
  items,
  onApply,
  onClose,
}: {
  items: StudioFrag[];
  onApply: (frags: StudioFrag[]) => void;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<"pick" | "analyze" | "plans">("pick");
  const [picked, setPicked] = useState<number[]>(() => items.slice(0, 4).map((i) => i.id));
  const [chosen, setChosen] = useState<PlanId | null>(null);
  const [progress, setProgress] = useState(0);

  const selected = useMemo(() => items.filter((i) => picked.includes(i.id)), [items, picked]);

  const kindsPresent = useMemo(
    () => KIND_READS.filter((k) => selected.some((s) => s.kind === k.kind)),
    [selected],
  );

  useEffect(() => {
    if (stage !== "analyze") return;
    setProgress(0);
    const total = kindsPresent.length + 1;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= total) {
          clearInterval(t);
          return p;
        }
        return p + 1;
      });
    }, 650);
    return () => clearInterval(t);
  }, [stage, kindsPresent.length]);

  const analyzeDone = progress >= kindsPresent.length + 1;

  const toggle = (id: number) =>
    setPicked((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length >= 6 ? p : [...p, id],
    );

  const canStart = picked.length >= 3 && picked.length <= 6;

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm grid place-items-center p-4 sm:p-8">
      <div className="relative w-full max-w-5xl max-h-[88vh] overflow-auto bg-cream border border-charcoal/15 rounded-[28px] scrap-shadow">
        <div className="paper-texture absolute inset-0 pointer-events-none rounded-[28px]" />
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute top-4 right-4 z-10 size-8 grid place-items-center rounded-full border border-charcoal/15 bg-white/80 hover:bg-white"
        >
          <X className="size-4" strokeWidth={1.6} />
        </button>

        <div className="relative p-7 sm:p-10">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/45">
            {["选择素材", "AI 分析", "生成版面", "你来决定"].map((label, i) => {
              const active =
                (stage === "pick" && i === 0) ||
                (stage === "analyze" && i === 1) ||
                (stage === "plans" && (chosen ? i === 3 : i === 2));
              return (
                <span key={label} className={active ? "text-charcoal" : ""}>
                  {`0${i + 1}`} {label}
                  {i < 3 && <span className="ml-3 text-charcoal/25">/</span>}
                </span>
              );
            })}
          </div>

          {stage === "pick" && (
            <section className="mt-6">
              <h2 className="font-serif italic text-4xl">选择一些你的碎片</h2>
              <p className="text-charcoal/60 mt-2 text-sm leading-relaxed">
                AI 会根据这些素材，尝试为你生成不同的视觉组合。
                <span className="font-hand text-lg text-dusty ml-2">（请选择 3–6 个）</span>
              </p>

              <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3">
                {items.map((it) => {
                  const on = picked.includes(it.id);
                  return (
                    <button
                      key={it.id}
                      onClick={() => toggle(it.id)}
                      className={`relative text-left bg-white border p-2 pb-6 transition scrap-shadow ${
                        on ? "border-charcoal -translate-y-0.5" : "border-charcoal/10 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="aspect-square bg-ivory overflow-hidden grid place-items-center">
                        {it.src ? (
                          <img src={it.src} alt="" className="w-full h-full object-cover" />
                        ) : it.kind === "sticker" ? (
                          <span className={`${it.color ?? "bg-pinkv"} size-8 rounded-full`} />
                        ) : (
                          <span className="font-hand text-sm px-2 text-charcoal/70 line-clamp-3">
                            {it.text ?? "碎片"}
                          </span>
                        )}
                      </div>
                      <span className="absolute bottom-1.5 left-2 text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
                        {KIND_LABEL[it.kind] ?? it.kind}
                      </span>
                      {on && (
                        <span className="absolute -top-2 -right-2 size-6 rounded-full bg-charcoal text-cream text-[10px] grid place-items-center">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <p className="text-xs text-charcoal/50">已选 {picked.length} / 6</p>
                <button
                  disabled={!canStart}
                  onClick={() => setStage("analyze")}
                  className="px-6 py-2.5 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85 disabled:opacity-40"
                >
                  开始分析 →
                </button>
              </div>
            </section>
          )}

          {stage === "analyze" && (
            <section className="mt-6 max-w-xl">
              <h2 className="font-serif italic text-4xl">正在观察你的碎片……</h2>
              <ul className="mt-8 space-y-4">
                {kindsPresent.map((k, i) => (
                  <li
                    key={k.kind}
                    className={`flex items-baseline gap-4 border-b border-dashed border-charcoal/20 pb-3 transition-opacity duration-500 ${
                      progress > i ? "opacity-100" : "opacity-25"
                    }`}
                  >
                    <span className="font-serif italic text-2xl w-16">{k.label}</span>
                    <span className="text-charcoal/40">→</span>
                    <span className="text-sm tracking-wide">{k.read}</span>
                    <span className="ml-auto font-hand text-lg text-dusty">
                      {progress > i ? `${selected.filter((s) => s.kind === k.kind).length} 片` : "…"}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-hand text-2xl text-charcoal/75">
                AI 正在尝试理解这些碎片之间的关系。
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.3em] ${
                    analyzeDone ? "text-charcoal" : "text-charcoal/35"
                  }`}
                >
                  {analyzeDone ? "已完成" : "分析中"}
                </span>
                <button
                  disabled={!analyzeDone}
                  onClick={() => setStage("plans")}
                  className="px-6 py-2.5 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85 disabled:opacity-30"
                >
                  继续生成版面 →
                </button>
              </div>
            </section>
          )}

          {stage === "plans" && (
            <section className="mt-6">
              <h2 className="font-serif italic text-4xl">AI 给出了 3 种可能。</h2>
              <p className="text-charcoal/60 mt-2 text-sm">你更喜欢哪一种？</p>

              <div className="mt-7 grid md:grid-cols-3 gap-5">
                {PLANS.map((p) => {
                  const frags = arrange(selected, p.id);
                  const on = chosen === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setChosen(p.id)}
                      className={`text-left bg-white border p-3 scrap-shadow transition ${
                        on ? "border-charcoal -translate-y-1" : "border-charcoal/10 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="relative w-full aspect-[4/3] bg-ivory overflow-hidden border border-charcoal/10">
                        <div className="dot-grid absolute inset-0 opacity-40" />
                        <div className="absolute inset-0 origin-top-left" style={{ transform: "scale(0.22)" }}>
                          {frags.map((f) => (
                            <div
                              key={f.id}
                              className="absolute"
                              style={{ left: f.x, top: f.y, width: f.w, transform: `rotate(${f.r}deg)` }}
                            >
                              {f.src ? (
                                <div className="bg-white p-2 border border-charcoal/10">
                                  <img src={f.src} alt="" className="block w-full aspect-square object-cover" />
                                </div>
                              ) : f.kind === "sticker" ? (
                                <div
                                  className={`${f.color ?? "bg-pinkv"} rounded-full border border-charcoal/10`}
                                  style={{ height: f.w }}
                                />
                              ) : (
                                <div className="bg-butter/50 border border-charcoal/10 p-3 font-hand text-3xl leading-tight">
                                  {f.text ?? "笔记"}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/45 mt-3">{p.index}</p>
                      <p className="font-serif italic text-2xl">{p.name}</p>
                      <p className="text-[11px] text-charcoal/55 mt-2 leading-relaxed">
                        <span className="italic">为什么这样排列？</span>
                        <br />
                        {p.why}
                      </p>
                      {on && (
                        <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-pinkv font-bold">已选择 ✦</p>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  disabled={!chosen}
                  onClick={() => chosen && onApply(arrange(selected, chosen))}
                  className="px-6 py-2.5 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85 disabled:opacity-40"
                >
                  使用这个方案
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full border border-charcoal/20 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white"
                >
                  自己修改
                </button>
                <button
                  onClick={() => { setChosen(null); setStage("pick"); }}
                  className="text-xs uppercase tracking-[0.2em] text-charcoal/50 hover:text-charcoal"
                >
                  ← 重新选择素材
                </button>
              </div>
            </section>
          )}

          {/* AI 小知识 */}
          <aside className="mt-10 max-w-sm ml-auto rotate-[-1deg] bg-butter/40 border border-charcoal/15 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/55">AI 小知识</p>
            <p className="mt-2 text-[13px] leading-relaxed text-charcoal/75">
              AI 不是真的“懂得”你的旅行记忆。它只能根据你提供的信息，尝试分析和组合这些内容。
              <br />
              所以，AI 可以帮你生成，但最后的选择仍然由你决定。
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { generateAiLayout, type AiLayoutResult, type AiPlan } from "@/lib/ai-layout.functions";

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

const KIND_LABEL: Record<string, string> = {
  photo: "照片",
  note: "文字",
  ticket: "地图",
  sticker: "贴纸",
  audio: "音频",
};

const CANVAS = { w: 1300, h: 820 };

/** 将画布上的图片压缩成小尺寸 data URL，供 AI 真正"看"图。 */
async function toThumbDataUrl(src: string, max = 320): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        if (!ctx) return resolve("");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", 0.72));
      } catch {
        resolve("");
      }
    };
    img.onerror = () => resolve("");
    img.src = src;
  });
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/** 把 AI 返回的版面数据映射回画布碎片 */
function applyPlan(plan: AiPlan, selected: StudioFrag[]): StudioFrag[] {
  return selected.map((f) => {
    const p = plan.placements.find((pl) => String(pl.id) === String(f.id));
    if (!p) return f;
    const w = clamp(p.w, f.kind === "sticker" ? 60 : 120, CANVAS.w * 0.5);
    return {
      ...f,
      x: clamp(p.x, 20, CANVAS.w - w - 20),
      y: clamp(p.y, 20, CANVAS.h - 60),
      w,
      r: clamp(p.rotate, -12, 12),
      z: p.z,
      aspect: p.crop === "none" ? undefined : p.crop,
      aiRole: p.role,
    } as StudioFrag;
  });
}

export function AiLayoutStudio({
  items,
  city = "",
  style = "",
  onApply,
  onClose,
}: {
  items: StudioFrag[];
  city?: string;
  style?: string;
  onApply: (frags: StudioFrag[]) => void;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<"pick" | "analyze" | "plans">("pick");
  const [picked, setPicked] = useState<number[]>(() => items.slice(0, 4).map((i) => i.id));
  const [chosen, setChosen] = useState<string | null>(null);
  const [result, setResult] = useState<AiLayoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = useMemo(() => items.filter((i) => picked.includes(i.id)), [items, picked]);

  const toggle = (id: number) =>
    setPicked((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length >= 6 ? p : [...p, id],
    );

  const canStart = picked.length >= 3 && picked.length <= 6;

  const runAnalysis = async () => {
    setStage("analyze");
    setBusy(true);
    setError(null);
    setResult(null);
    setChosen(null);
    try {
      const fragments = await Promise.all(
        selected.map(async (f) => ({
          id: String(f.id),
          kind: f.kind,
          text: (f.text as string) ?? "",
          image: f.src ? await toThumbDataUrl(f.src) : "",
        })),
      );
      const res = await generateAiLayout({
        data: { city, style, canvas: CANVAS, fragments },
      });
      if (!res.ok) {
        setError(res.error ?? "AI 暂时无法生成版面");
        setResult(null);
      } else {
        setResult(res);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI 请求出错");
    } finally {
      setBusy(false);
    }
  };

  const plans = result?.plans ?? [];

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
                AI 会真的看这些图片，分析主体、视觉重点与色彩，再为你生成版面。
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
                  onClick={runAnalysis}
                  className="px-6 py-2.5 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85 disabled:opacity-40"
                >
                  开始分析 →
                </button>
              </div>
            </section>
          )}

          {stage === "analyze" && (
            <section className="mt-6 max-w-2xl">
              <h2 className="font-serif italic text-4xl">正在观察你的碎片……</h2>

              <ul className="mt-8 space-y-4">
                {selected.map((f) => {
                  const read = result?.reads.find((r) => String(r.id) === String(f.id));
                  return (
                    <li
                      key={f.id}
                      className={`flex items-center gap-4 border-b border-dashed border-charcoal/20 pb-3 transition-opacity duration-500 ${
                        read ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      <span className="size-10 bg-ivory border border-charcoal/10 overflow-hidden grid place-items-center shrink-0">
                        {f.src ? (
                          <img src={f.src} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-charcoal/50">{KIND_LABEL[f.kind]}</span>
                        )}
                      </span>
                      <span className="font-serif italic text-xl w-14 shrink-0">{KIND_LABEL[f.kind]}</span>
                      <span className="text-charcoal/40">→</span>
                      <span className="text-sm tracking-wide">
                        {read ? `${read.subject} · ${read.focus}` : busy ? "分析中…" : "—"}
                      </span>
                      <span className="ml-auto font-hand text-lg text-dusty shrink-0">
                        {read?.palette ?? "…"}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-8 font-hand text-2xl text-charcoal/75">
                {result?.relation || "AI 正在尝试理解这些碎片之间的关系。"}
              </p>

              {error && (
                <p className="mt-4 text-sm text-pinkv border border-pinkv/40 bg-pinkv/10 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <div className="mt-8 flex items-center gap-4">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 ${
                    result ? "text-charcoal" : "text-charcoal/35"
                  }`}
                >
                  {busy && <Loader2 className="size-3 animate-spin" />}
                  {busy ? "分析中" : result ? "已完成" : "未完成"}
                </span>
                {error ? (
                  <button
                    onClick={runAnalysis}
                    className="px-6 py-2.5 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85"
                  >
                    重试
                  </button>
                ) : (
                  <button
                    disabled={!result}
                    onClick={() => setStage("plans")}
                    className="px-6 py-2.5 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85 disabled:opacity-30"
                  >
                    继续生成版面 →
                  </button>
                )}
              </div>
            </section>
          )}

          {stage === "plans" && (
            <section className="mt-6">
              <h2 className="font-serif italic text-4xl">AI 给出了 {plans.length} 种可能。</h2>
              <p className="text-charcoal/60 mt-2 text-sm">你更喜欢哪一种？</p>

              <div className="mt-7 grid md:grid-cols-3 gap-5">
                {plans.map((p) => {
                  const frags = applyPlan(p, selected);
                  const on = chosen === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setChosen(p.id)}
                      className={`text-left bg-white border p-3 scrap-shadow transition ${
                        on ? "border-charcoal -translate-y-1" : "border-charcoal/10 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="relative w-full aspect-[1300/820] bg-ivory overflow-hidden border border-charcoal/10">
                        <div className="dot-grid absolute inset-0 opacity-40" />
                        <div
                          className="absolute inset-0 origin-top-left"
                          style={{ transform: "scale(0.2)", width: CANVAS.w, height: CANVAS.h }}
                        >
                          <div
                            className="absolute border border-dashed border-charcoal/15"
                            style={{
                              left: p.whitespace.x,
                              top: p.whitespace.y,
                              width: p.whitespace.w,
                              height: p.whitespace.h,
                            }}
                          />
                          {p.decorations.map((d, i) => (
                            <div
                              key={i}
                              className={`absolute ${
                                d.kind === "line" ? "bg-charcoal/25 h-1" : "bg-dusty/60 rounded-full"
                              }`}
                              style={{
                                left: d.x,
                                top: d.y,
                                width: d.w,
                                height: d.kind === "line" ? 4 : d.w,
                              }}
                            />
                          ))}
                          {frags
                            .slice()
                            .sort((a, b) => Number(a.z ?? 0) - Number(b.z ?? 0))
                            .map((f) => (
                              <div
                                key={f.id}
                                className="absolute"
                                style={{ left: f.x, top: f.y, width: f.w, transform: `rotate(${f.r}deg)` }}
                              >
                                {f.src ? (
                                  <div className="bg-white p-2 border border-charcoal/10">
                                    <img
                                      src={f.src}
                                      alt=""
                                      className={`block w-full object-cover ${
                                        f.aspect === "portrait"
                                          ? "aspect-[3/4]"
                                          : f.aspect === "landscape"
                                            ? "aspect-[4/3]"
                                            : "aspect-square"
                                      }`}
                                    />
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
                          <div
                            className="absolute font-serif italic text-6xl text-charcoal/70"
                            style={{ left: p.title.x, top: p.title.y }}
                          >
                            标题
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/45 mt-3">
                        方案 {String(plans.indexOf(p) + 1).padStart(2, "0")}
                      </p>
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
                  onClick={() => {
                    const plan = plans.find((p) => p.id === chosen);
                    if (plan) onApply(applyPlan(plan, selected));
                  }}
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
                  onClick={() => {
                    setChosen(null);
                    setStage("pick");
                  }}
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
              AI 不是真的"懂得"你的旅行记忆。它只能根据你提供的信息，尝试分析和组合这些内容。
              <br />
              所以，AI 可以帮你生成，但最后的选择仍然由你决定。
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

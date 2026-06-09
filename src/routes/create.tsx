import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import polaroidTrain from "@/assets/polaroid-train.jpg";
import polaroidItaly from "@/assets/polaroid-italy.jpg";
import polaroidKyoto from "@/assets/polaroid-kyoto.jpg";
import ticket from "@/assets/ticket-paris.jpg";
import envelope from "@/assets/envelope-airmail.jpg";
import stamps from "@/assets/stamps.jpg";
import tokyo from "@/assets/map-tokyo-torn.jpg";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "创作 — Fragmented" },
      { name: "description", content: "一张无限的拼贴画布。把照片、车票、笔记、贴纸和音频拖拽成一篇视觉故事。" },
      { property: "og:title", content: "创作 — Fragmented" },
      { property: "og:description", content: "在无限画布上搭建你专属的数字旅行剪贴簿。" },
    ],
  }),
  component: Create,
});

type Frag = {
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
};

const initial: Frag[] = [
  { id: 1, kind: "photo", x: 120, y: 90, r: -6, w: 240, src: polaroidTrain, text: "伯尔尼纳快线", tape: "tape" },
  { id: 2, kind: "photo", x: 520, y: 60, r: 5, w: 200, src: polaroidItaly, text: "五渔村", tape: "tape-pink" },
  { id: 3, kind: "photo", x: 880, y: 140, r: -3, w: 210, src: polaroidKyoto, text: "京都，秋", tape: "tape-blue" },
  { id: 4, kind: "ticket", x: 200, y: 420, r: 4, w: 220, src: ticket },
  { id: 5, kind: "ticket", x: 760, y: 460, r: -7, w: 200, src: tokyo },
  { id: 6, kind: "ticket", x: 500, y: 520, r: 2, w: 180, src: envelope },
  { id: 7, kind: "sticker", x: 460, y: 320, r: 12, w: 90, color: "bg-pinkv" },
  { id: 8, kind: "sticker", x: 1100, y: 360, r: -10, w: 100, src: stamps },
  { id: 9, kind: "note", x: 820, y: 280, r: -2, w: 240, text: "佛罗伦萨的咖啡，喝起来像旧故事和清晨的雨。" },
  { id: 10, kind: "note", x: 90, y: 360, r: 3, w: 200, text: "午餐前迷路了三条小巷。强烈推荐。" },
  { id: 11, kind: "audio", x: 540, y: 700, r: 1, w: 240, text: "海，拉各斯 · 0:10" },
];

const tools = [
  { icon: "🖼", label: "照片" },
  { icon: "✎", label: "笔记" },
  { icon: "🗺", label: "地图" },
  { icon: "♪", label: "音频" },
  { icon: "✷", label: "贴纸" },
  { icon: "✂", label: "胶带" },
];

function Create() {
  const [items, setItems] = useState<Frag[]>(initial);
  const [zoom, setZoom] = useState(0.85);
  const [dragging, setDragging] = useState<number | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  const onDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    offset.current = { x: e.clientX - item.x * zoom, y: e.clientY - item.y * zoom };
    setDragging(id);
  };
  const onMove = (e: React.MouseEvent) => {
    if (dragging == null) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === dragging
          ? { ...i, x: (e.clientX - offset.current.x) / zoom, y: (e.clientY - offset.current.y) / zoom }
          : i,
      ),
    );
  };
  const onUp = () => setDragging(null);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteNav />

      <div className="pt-28 px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50">
            未命名日志 · 已自动保存
          </p>
          <h1 className="font-serif text-3xl italic">里斯本的一个小小春天。</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full border border-charcoal/15 hover:bg-white">
            预览
          </button>
          <button className="px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full bg-charcoal text-cream hover:bg-charcoal/85">
            发布
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="mt-6 px-6 pb-6 flex-1">
        <div
          className="relative w-full h-[760px] bg-ivory border border-charcoal/10 rounded-[28px] overflow-hidden shadow-inner cursor-grab active:cursor-grabbing"
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
        >
          <div className="absolute inset-0 dot-grid opacity-50" />
          <div className="paper-texture absolute inset-0 pointer-events-none" />

          <div className="absolute inset-0 origin-top-left" style={{ transform: `scale(${zoom})` }}>
            {items.map((it) => (
              <Fragment key={it.id} it={it} onDown={onDown} />
            ))}
          </div>

          {/* Floating toolbar */}
          <div className="absolute top-5 left-5 bg-white/85 backdrop-blur-md border border-charcoal/10 rounded-2xl p-2 flex flex-col gap-1 scrap-shadow">
            {tools.map((t) => (
              <button
                key={t.label}
                title={t.label}
                className="size-11 grid place-items-center rounded-xl hover:bg-cream text-lg font-semibold"
              >
                <span aria-hidden>{t.icon}</span>
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-5 left-5 bg-white/85 backdrop-blur-md border border-charcoal/10 rounded-full px-3 py-1.5 flex items-center gap-2 scrap-shadow text-sm">
            <button onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))} className="size-7 grid place-items-center">−</button>
            <span className="text-xs font-semibold tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))} className="size-7 grid place-items-center">+</button>
          </div>

          {/* AI panel */}
          <div className="absolute top-5 right-5 w-72 bg-white border border-charcoal/10 rounded-2xl p-4 scrap-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50">
                AI 排版工作室
              </span>
              <span className="size-1.5 rounded-full bg-pinkv animate-pulse" />
            </div>
            <p className="font-serif italic text-lg mt-3 leading-snug">
              要把这 11 片碎片排成一篇杂志版面吗？
            </p>
            <div className="grid grid-cols-3 gap-1.5 mt-3">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-[3/4] bg-cream border border-charcoal/10 rounded-md grid grid-cols-2 grid-rows-2 gap-[2px] p-1">
                  <span className="bg-dusty/40" /><span className="bg-pinkv/40" /><span className="bg-butter/50" /><span className="bg-charcoal/70" />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-charcoal text-cream rounded-full py-2 text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85">
              生成版面
            </button>
          </div>

          {/* Layers panel */}
          <div className="absolute bottom-5 right-5 w-60 bg-white/90 backdrop-blur-md border border-charcoal/10 rounded-2xl p-3 scrap-shadow">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50 mb-2">
              图层 · {items.length}
            </p>
            <ul className="space-y-1 max-h-40 overflow-auto text-xs">
              {items.slice().reverse().map((i) => (
                <li key={i.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-cream">
                  <span className="size-2 rounded-full bg-charcoal/50" />
                  <span className="capitalize">{i.kind}</span>
                  <span className="ml-auto text-charcoal/40">#{i.id}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fragment({ it, onDown }: { it: Frag; onDown: (e: React.MouseEvent, id: number) => void }) {
  const base = "absolute select-none";
  const styleBase: React.CSSProperties = {
    left: it.x,
    top: it.y,
    width: it.w,
    transform: `rotate(${it.r}deg)`,
  };

  if (it.kind === "photo") {
    return (
      <div className={`${base}`} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
        <div className="relative bg-white p-2 pb-9 scrap-shadow border border-charcoal/10 cursor-grab">
          {it.tape && <span className={`${it.tape} absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rotate-[-3deg]`} />}
          <img src={it.src} alt="" draggable={false} className="block w-full aspect-square object-cover" />
          <span className="absolute bottom-2 left-3 right-3 font-hand text-base">{it.text}</span>
        </div>
      </div>
    );
  }
  if (it.kind === "ticket") {
    return (
      <div className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
        <img src={it.src} alt="" draggable={false} className="block w-full scrap-shadow border border-charcoal/10 cursor-grab" />
      </div>
    );
  }
  if (it.kind === "sticker") {
    if (it.src) {
      return (
        <div className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
          <img src={it.src} alt="" draggable={false} className="block w-full rounded-md scrap-shadow border border-charcoal/10 cursor-grab" />
        </div>
      );
    }
    return (
      <div className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
        <div className={`${it.color} size-full aspect-square rounded-full grid place-items-center border border-charcoal/10 scrap-shadow cursor-grab`}>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-charcoal text-center leading-tight">
            里斯本<br />’26
          </span>
        </div>
      </div>
    );
  }
  if (it.kind === "note") {
    return (
      <div className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
        <div className="bg-butter/40 border border-charcoal/10 p-4 scrap-shadow cursor-grab">
          <p className="font-hand text-2xl leading-tight">{it.text}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
      <div className="bg-charcoal text-cream rounded-full px-4 py-2 flex items-center gap-3 scrap-shadow cursor-grab">
        <span className="size-7 rounded-full bg-butter text-charcoal grid place-items-center text-xs">▶</span>
        <span className="text-xs font-semibold">{it.text}</span>
      </div>
    </div>
  );
}
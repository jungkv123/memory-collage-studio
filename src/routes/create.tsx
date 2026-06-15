import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Type, Brush, Music, Sticker, Crop, X, RotateCw } from "lucide-react";
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
  aspect?: "square" | "portrait" | "landscape";
  doodle?: string;
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

const stickerPalette = ["bg-pinkv", "bg-butter", "bg-dusty", "bg-charcoal"];
const doodlePaths = [
  "M10 60 Q 40 10 80 50 T 150 40",
  "M20 20 C 60 80, 100 0, 150 60 S 200 20, 230 50",
  "M10 50 Q 50 0 90 50 Q 130 100 170 50",
  "M20 80 L 60 20 L 100 80 L 140 20 L 180 80",
];
const stickerEmojis = ["✿", "★", "☀", "♥", "✈", "☕"];

type StickerDef = {
  id: string;
  kind: "tape" | "stamp" | "heart" | "star" | "travel";
  label: string;
  // visual config
  color?: string;
  emoji?: string;
  tape?: string;
  w?: number;
};

const stickerLibrary: { name: string; key: string; items: StickerDef[] }[] = [
  {
    name: "胶带",
    key: "tape",
    items: [
      { id: "tape-cream", kind: "tape", label: "奶油胶带", tape: "tape", w: 120 },
      { id: "tape-pink", kind: "tape", label: "粉色胶带", tape: "tape-pink", w: 120 },
      { id: "tape-blue", kind: "tape", label: "蓝色胶带", tape: "tape-blue", w: 120 },
    ],
  },
  {
    name: "邮票",
    key: "stamp",
    items: [
      { id: "stamp-pinkv", kind: "stamp", label: "巴黎邮票", color: "bg-pinkv", emoji: "✦", w: 90 },
      { id: "stamp-butter", kind: "stamp", label: "罗马邮票", color: "bg-butter", emoji: "☼", w: 90 },
      { id: "stamp-dusty", kind: "stamp", label: "京都邮票", color: "bg-dusty", emoji: "鳥", w: 90 },
      { id: "stamp-charcoal", kind: "stamp", label: "夜车邮票", color: "bg-charcoal", emoji: "✺", w: 90 },
    ],
  },
  {
    name: "爱心",
    key: "heart",
    items: [
      { id: "heart-pink", kind: "heart", label: "粉心", color: "bg-pinkv", emoji: "♥", w: 70 },
      { id: "heart-butter", kind: "heart", label: "黄心", color: "bg-butter", emoji: "♥", w: 70 },
      { id: "heart-dusty", kind: "heart", label: "雾心", color: "bg-dusty", emoji: "♥", w: 70 },
    ],
  },
  {
    name: "星星",
    key: "star",
    items: [
      { id: "star-pink", kind: "star", label: "粉星", color: "bg-pinkv", emoji: "★", w: 70 },
      { id: "star-butter", kind: "star", label: "金星", color: "bg-butter", emoji: "✦", w: 70 },
      { id: "star-charcoal", kind: "star", label: "夜星", color: "bg-charcoal", emoji: "✸", w: 70 },
    ],
  },
  {
    name: "旅行",
    key: "travel",
    items: [
      { id: "tv-plane", kind: "travel", label: "飞机", color: "bg-dusty", emoji: "✈", w: 80 },
      { id: "tv-coffee", kind: "travel", label: "咖啡", color: "bg-butter", emoji: "☕", w: 80 },
      { id: "tv-camera", kind: "travel", label: "相机", color: "bg-charcoal", emoji: "📷", w: 80 },
      { id: "tv-map", kind: "travel", label: "地图", color: "bg-pinkv", emoji: "✺", w: 80 },
      { id: "tv-sun", kind: "travel", label: "太阳", color: "bg-butter", emoji: "☀", w: 80 },
      { id: "tv-flower", kind: "travel", label: "花", color: "bg-pinkv", emoji: "✿", w: 80 },
    ],
  },
];

function Create() {
  const [items, setItems] = useState<Frag[]>(initial);
  const [zoom, setZoom] = useState(0.85);
  const [dragging, setDragging] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  const stickerDragRef = useRef<StickerDef | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const imgInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(100);
  const canvasRef = useRef<HTMLDivElement>(null);
  const interaction = useRef<
    | { mode: "resize"; id: number; startX: number; startY: number; startW: number }
    | { mode: "rotate"; id: number; cx: number; cy: number; startAngle: number; startR: number }
    | null
  >(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const addFragment = (frag: Omit<Frag, "id">) => {
    const id = nextId.current++;
    setItems((p) => [...p, { ...frag, id }]);
    setSelectedId(id);
  };

  const randPos = () => ({
    x: 200 + Math.random() * 600,
    y: 200 + Math.random() * 300,
    r: Math.round((Math.random() - 0.5) * 16),
  });

  const handleAddImage = () => imgInputRef.current?.click();
  const onImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addFragment({ kind: "photo", ...randPos(), w: 220, src: url, text: "新照片", tape: "tape" });
    e.target.value = "";
    flash("已添加照片");
  };

  const handleAddText = () => {
    const text = window.prompt("写下一段笔记：", "今天的天空像棉花糖。");
    if (!text) return;
    addFragment({ kind: "note", ...randPos(), w: 220, text });
    flash("已添加笔记");
  };

  const handleAddDoodle = () => {
    const path = doodlePaths[Math.floor(Math.random() * doodlePaths.length)];
    addFragment({ kind: "sticker", ...randPos(), w: 200, doodle: path });
    flash("已添加涂鸦");
  };

  const handleAddMusic = () => audioInputRef.current?.click();
  const onAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addFragment({ kind: "audio", ...randPos(), w: 240, src: url, text: file.name.replace(/\.[^.]+$/, "") });
    e.target.value = "";
    flash("已添加背景音乐");
  };

  const handleAddSticker = () => {
    setShowStickers((s) => !s);
  };

  const addStickerToCanvas = (def: StickerDef, pos?: { x: number; y: number }) => {
    const p = pos ?? randPos();
    const w = def.w ?? 90;
    if (def.kind === "tape") {
      addFragment({ kind: "sticker", x: p.x, y: p.y, r: Math.round((Math.random() - 0.5) * 20), w, tape: def.tape });
    } else {
      addFragment({
        kind: "sticker",
        x: p.x,
        y: p.y,
        r: Math.round((Math.random() - 0.5) * 16),
        w,
        color: def.color,
        text: def.emoji,
      });
    }
    flash(`已添加 ${def.label}`);
  };

  const handleCrop = () => {
    const target = items.find((i) => i.id === selectedId && i.kind === "photo");
    if (!target) {
      flash("先选择一张照片再裁剪");
      return;
    }
    const next: Frag["aspect"] =
      target.aspect === "portrait" ? "landscape" : target.aspect === "landscape" ? "square" : "portrait";
    setItems((p) => p.map((i) => (i.id === target.id ? { ...i, aspect: next } : i)));
    flash("已调整裁剪比例");
  };

  const tools = [
    { Icon: ImagePlus, label: "添加图片", onClick: handleAddImage },
    { Icon: Type, label: "添加文字", onClick: handleAddText },
    { Icon: Brush, label: "添加涂鸦", onClick: handleAddDoodle },
    { Icon: Music, label: "添加背景音乐", onClick: handleAddMusic },
    { Icon: Sticker, label: "添加素材", onClick: handleAddSticker },
    { Icon: Crop, label: "裁剪图片", onClick: handleCrop },
  ];

  const onDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    offset.current = { x: e.clientX - item.x * zoom, y: e.clientY - item.y * zoom };
    setDragging(id);
    setSelectedId(id);
  };
  const onMove = (e: React.MouseEvent) => {
    if (interaction.current) {
      const act = interaction.current;
      if (act.mode === "resize") {
        const dx = (e.clientX - act.startX) / zoom;
        const newW = Math.max(60, act.startW + dx);
        setItems((prev) => prev.map((i) => (i.id === act.id ? { ...i, w: newW } : i)));
      } else if (act.mode === "rotate") {
        const angle = (Math.atan2(e.clientY - act.cy, e.clientX - act.cx) * 180) / Math.PI;
        const delta = angle - act.startAngle;
        setItems((prev) => prev.map((i) => (i.id === act.id ? { ...i, r: act.startR + delta } : i)));
      }
      return;
    }
    if (dragging == null) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === dragging
          ? { ...i, x: (e.clientX - offset.current.x) / zoom, y: (e.clientY - offset.current.y) / zoom }
          : i,
      ),
    );
  };
  const onUp = () => {
    setDragging(null);
    interaction.current = null;
  };

  const startResize = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    const it = items.find((i) => i.id === id);
    if (!it) return;
    interaction.current = { mode: "resize", id, startX: e.clientX, startY: e.clientY, startW: it.w };
  };

  const startRotate = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    const it = items.find((i) => i.id === id);
    const el = (e.currentTarget as HTMLElement).closest("[data-frag]") as HTMLElement | null;
    if (!it || !el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startAngle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
    interaction.current = { mode: "rotate", id, cx, cy, startAngle, startR: it.r };
  };

  const deleteItem = (id: number) => {
    setItems((p) => p.filter((i) => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId != null) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        deleteItem(selectedId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  const onCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    const sticker = stickerDragRef.current;
    if (sticker) {
      const x = rect ? (e.clientX - rect.left) / zoom - (sticker.w ?? 90) / 2 : 300;
      const y = rect ? (e.clientY - rect.top) / zoom - (sticker.w ?? 90) / 2 : 300;
      addStickerToCanvas(sticker, { x, y });
      stickerDragRef.current = null;
      return;
    }
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    files.forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      const x = rect ? (e.clientX - rect.left) / zoom - 110 + idx * 20 : 200 + idx * 30;
      const y = rect ? (e.clientY - rect.top) / zoom - 110 + idx * 20 : 200 + idx * 30;
      addFragment({
        kind: "photo",
        x,
        y,
        r: Math.round((Math.random() - 0.5) * 14),
        w: 220,
        src: url,
        text: file.name.replace(/\.[^.]+$/, ""),
        tape: "tape",
      });
    });
    flash(`已添加 ${files.length} 张照片`);
  };

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
          ref={canvasRef}
          className="relative w-full h-[760px] bg-ivory border border-charcoal/10 rounded-[28px] overflow-hidden shadow-inner cursor-grab active:cursor-grabbing"
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onCanvasDrop}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <div className="absolute inset-0 dot-grid opacity-50" />
          <div className="paper-texture absolute inset-0 pointer-events-none" />

          <div className="absolute inset-0 origin-top-left" style={{ transform: `scale(${zoom})` }}>
            {items.map((it) => (
              <Fragment
                key={it.id}
                it={it}
                onDown={onDown}
                selected={selectedId === it.id}
                onResizeStart={startResize}
                onRotateStart={startRotate}
                onDelete={deleteItem}
              />
            ))}
          </div>

          {/* Floating toolbar */}
          <div className="absolute top-5 left-5 bg-white/85 backdrop-blur-md border border-charcoal/10 rounded-2xl p-2 flex flex-col gap-1 scrap-shadow">
            {tools.map((t) => (
              <button
                key={t.label}
                title={t.label}
                onClick={t.onClick}
                className="size-11 grid place-items-center rounded-xl hover:bg-cream text-charcoal/80 hover:text-charcoal transition-colors"
              >
                <t.Icon className="size-[18px]" strokeWidth={1.6} aria-hidden />
              </button>
            ))}
            <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={onImageFile} />
            <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={onAudioFile} />
          </div>

          {toast && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-charcoal text-cream text-xs px-4 py-2 rounded-full scrap-shadow">
              {toast}
            </div>
          )}

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

function Fragment({
  it,
  onDown,
  selected,
  onResizeStart,
  onRotateStart,
  onDelete,
}: {
  it: Frag;
  onDown: (e: React.MouseEvent, id: number) => void;
  selected?: boolean;
  onResizeStart: (e: React.MouseEvent, id: number) => void;
  onRotateStart: (e: React.MouseEvent, id: number) => void;
  onDelete: (id: number) => void;
}) {
  const base = `absolute select-none ${selected ? "ring-2 ring-pinkv ring-offset-2 ring-offset-ivory rounded-md" : ""}`;
  const styleBase: React.CSSProperties = {
    left: it.x,
    top: it.y,
    width: it.w,
    transform: `rotate(${it.r}deg)`,
  };

  const Handles = selected ? (
    <>
      <button
        type="button"
        title="删除"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(it.id);
        }}
        className="absolute -top-3 -right-3 size-6 rounded-full bg-charcoal text-cream grid place-items-center scrap-shadow hover:bg-pinkv hover:text-charcoal z-30"
      >
        <X className="size-3" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        title="旋转"
        onMouseDown={(e) => onRotateStart(e, it.id)}
        className="absolute -top-3 -left-3 size-6 rounded-full bg-white border border-charcoal/20 text-charcoal grid place-items-center scrap-shadow cursor-grab z-30"
      >
        <RotateCw className="size-3" strokeWidth={2} />
      </button>
      <span
        title="缩放"
        onMouseDown={(e) => onResizeStart(e, it.id)}
        className="absolute -bottom-2 -right-2 size-4 bg-white border border-charcoal/40 rounded-sm cursor-se-resize z-30"
      />
    </>
  ) : null;

  if (it.kind === "photo") {
    const aspectClass =
      it.aspect === "portrait" ? "aspect-[3/4]" : it.aspect === "landscape" ? "aspect-[4/3]" : "aspect-square";
    return (
      <div data-frag className={`${base}`} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
        <div className="relative bg-white p-2 pb-9 scrap-shadow border border-charcoal/10 cursor-grab">
          {it.tape && <span className={`${it.tape} absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rotate-[-3deg]`} />}
          <img src={it.src} alt="" draggable={false} className={`block w-full ${aspectClass} object-cover`} />
          <span className="absolute bottom-2 left-3 right-3 font-hand text-base">{it.text}</span>
        </div>
        {Handles}
      </div>
    );
  }
  if (it.kind === "ticket") {
    return (
      <div data-frag className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
        <img src={it.src} alt="" draggable={false} className="block w-full scrap-shadow border border-charcoal/10 cursor-grab" />
        {Handles}
      </div>
    );
  }
  if (it.kind === "sticker") {
    if (it.doodle) {
      return (
        <div data-frag className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
          <svg viewBox="0 0 240 100" className="block w-full cursor-grab">
            <path d={it.doodle} stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-charcoal" />
          </svg>
          {Handles}
        </div>
      );
    }
    if (it.src) {
      return (
        <div data-frag className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
          <img src={it.src} alt="" draggable={false} className="block w-full rounded-md scrap-shadow border border-charcoal/10 cursor-grab" />
          {Handles}
        </div>
      );
    }
    return (
      <div data-frag className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
        <div className={`${it.color} size-full aspect-square rounded-full grid place-items-center border border-charcoal/10 scrap-shadow cursor-grab`}>
          <span className="text-xl font-bold text-cream text-center leading-tight">
            {it.text ?? "里斯本"}
          </span>
        </div>
        {Handles}
      </div>
    );
  }
  if (it.kind === "note") {
    return (
      <div data-frag className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
        <div className="bg-butter/40 border border-charcoal/10 p-4 scrap-shadow cursor-grab">
          <p className="font-hand text-2xl leading-tight">{it.text}</p>
        </div>
        {Handles}
      </div>
    );
  }
  return (
    <div data-frag className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
      <div className="bg-charcoal text-cream rounded-full px-4 py-2 flex items-center gap-3 scrap-shadow cursor-grab">
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (it.src) new Audio(it.src).play().catch(() => {});
          }}
          className="size-7 rounded-full bg-butter text-charcoal grid place-items-center text-xs"
        >
          ▶
        </button>
        <span className="text-xs font-semibold">{it.text}</span>
      </div>
      {Handles}
    </div>
  );
}
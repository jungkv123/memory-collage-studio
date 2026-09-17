import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Type, Brush, Music, Sticker, Crop, X, RotateCw, ArrowUp, ArrowDown, Lock, Unlock, Trash2 } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { AiLayoutStudio } from "@/components/create/AiLayoutStudio";
import { addJournal } from "@/data/journals-store";
import { generateJournalText } from "@/lib/ai-journal.functions";
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
  locked?: boolean;
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

// ────────────────────────────────────────────────────────────
// AI Studio workflow types
// ────────────────────────────────────────────────────────────
type Step = "upload" | "style" | "layout" | "editor";

type StyleKey = "neo-retro" | "y2k" | "film" | "postcard";
const STYLES: { key: StyleKey; name: string; desc: string; swatch: string }[] = [
  { key: "neo-retro", name: "Neo Retro", desc: "奶油底色 · 拼贴胶带", swatch: "bg-butter" },
  { key: "y2k", name: "Y2K Scrapbook", desc: "粉色高光 · 闪贴感", swatch: "bg-pinkv" },
  { key: "film", name: "Film Diary", desc: "雾蓝胶片 · 手写笔记", swatch: "bg-dusty" },
  { key: "postcard", name: "Postcard", desc: "炭灰邮戳 · 路线明信片", swatch: "bg-charcoal" },
];

type Upload = { id: string; url: string; name: string };

type LayoutId = "grid" | "scatter" | "magazine";
const LAYOUT_DEFS: { id: LayoutId; name: string; hint: string }[] = [
  { id: "grid", name: "整齐网格", hint: "对称排版，留白克制" },
  { id: "scatter", name: "随手拼贴", hint: "旋转角度自由，胶带交叠" },
  { id: "magazine", name: "杂志版面", hint: "焦点照片大幅，配小图与笔记" },
];

function styleTape(style: StyleKey, i: number): string {
  const tapes =
    style === "y2k"
      ? ["tape-pink", "tape-pink", "tape"]
      : style === "film"
        ? ["tape-blue", "tape", "tape-blue"]
        : style === "postcard"
          ? ["tape", "tape-blue", "tape"]
          : ["tape", "tape-pink", "tape-blue"];
  return tapes[i % tapes.length];
}

function styleAccentColor(style: StyleKey): string {
  return style === "y2k"
    ? "bg-pinkv"
    : style === "film"
      ? "bg-dusty"
      : style === "postcard"
        ? "bg-charcoal"
        : "bg-butter";
}

function buildLayout(uploads: Upload[], style: StyleKey, layout: LayoutId): Frag[] {
  const items: Frag[] = [];
  let nid = 1;
  const accent = styleAccentColor(style);
  if (uploads.length === 0) return initial;

  if (layout === "grid") {
    const cols = Math.min(3, Math.max(2, Math.ceil(Math.sqrt(uploads.length))));
    const w = 230;
    const gx = 80;
    const gy = 70;
    uploads.forEach((u, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      items.push({
        id: nid++, kind: "photo",
        x: 120 + col * (w + gx), y: 80 + row * (w + gy),
        r: ((i % 2 === 0 ? -1 : 1) * 2),
        w, src: u.url, text: u.name, tape: styleTape(style, i),
      });
    });
  } else if (layout === "scatter") {
    uploads.forEach((u, i) => {
      items.push({
        id: nid++, kind: "photo",
        x: 80 + (i * 137) % 900,
        y: 60 + ((i * 211) % 520),
        r: Math.round(Math.sin(i * 1.7) * 14),
        w: 200 + ((i * 23) % 80),
        src: u.url, text: u.name, tape: styleTape(style, i),
      });
    });
  } else {
    // magazine: first hero, rest smaller
    uploads.forEach((u, i) => {
      if (i === 0) {
        items.push({
          id: nid++, kind: "photo",
          x: 100, y: 90, r: -2, w: 420,
          src: u.url, text: u.name, tape: styleTape(style, i), aspect: "landscape",
        });
      } else {
        const col = (i - 1) % 2;
        const row = Math.floor((i - 1) / 2);
        items.push({
          id: nid++, kind: "photo",
          x: 580 + col * 240, y: 90 + row * 260,
          r: col === 0 ? 3 : -3, w: 210,
          src: u.url, text: u.name, tape: styleTape(style, i),
        });
      }
    });
  }

  // Sprinkle one accent sticker per layout
  items.push({
    id: nid++, kind: "sticker",
    x: 60, y: 600, r: -8, w: 80,
    color: accent, text: style === "y2k" ? "★" : style === "film" ? "✺" : style === "postcard" ? "✈" : "☀",
  });
  return items;
}

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || `journal-${Date.now()}`
  );
}

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
  const navigate = useNavigate();

  // Wizard state
  const [step, setStep] = useState<Step>("upload");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [city, setCity] = useState("");
  const [hints, setHints] = useState("");
  const [chosenStyle, setChosenStyle] = useState<StyleKey>("neo-retro");
  const [selectedLayout, setSelectedLayout] = useState<LayoutId | null>(null);

  // Publish modal state
  const [publishOpen, setPublishOpen] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  const [aiStory, setAiStory] = useState("");

  const [items, setItems] = useState<Frag[]>(initial);
  const [zoom, setZoom] = useState(0.85);
  const [dragging, setDragging] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  const [aiStudioOpen, setAiStudioOpen] = useState(false);
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

  // Layout previews are deterministic for the chosen style + uploads
  const layoutPreviews = useMemo(
    () => LAYOUT_DEFS.map((l) => ({ ...l, frags: buildLayout(uploads, chosenStyle, l.id) })),
    [uploads, chosenStyle],
  );

  const onWizardFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Upload[] = [];
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith("image/")) return;
      next.push({ id: `${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f), name: f.name.replace(/\.[^.]+$/, "") });
    });
    if (next.length) setUploads((p) => [...p, ...next]);
  };

  const removeUpload = (id: string) => setUploads((p) => p.filter((u) => u.id !== id));

  const openInEditor = (layoutId: LayoutId) => {
    setSelectedLayout(layoutId);
    const built = buildLayout(uploads, chosenStyle, layoutId);
    setItems(built);
    nextId.current = Math.max(100, ...built.map((b) => b.id)) + 1;
    setStep("editor");
  };

  const openPublish = async () => {
    setPublishOpen(true);
    setAiBusy(true);
    setAiTitle("");
    setAiStory("");
    try {
      const res = await generateJournalText({
        data: {
          style: STYLES.find((s) => s.key === chosenStyle)?.name ?? chosenStyle,
          city,
          hints,
          photoCount: items.filter((i) => i.kind === "photo").length,
        },
      });
      setAiTitle(res.title);
      setAiStory(res.story);
    } catch {
      setAiTitle(city ? `${city}的一段小日子` : "未命名的一段小日子");
      setAiStory("这次旅行的细节，会在再次翻看照片时慢慢回来。");
    } finally {
      setAiBusy(false);
    }
  };

  const regenerateAI = async () => {
    setAiBusy(true);
    try {
      const res = await generateJournalText({
        data: {
          style: STYLES.find((s) => s.key === chosenStyle)?.name ?? chosenStyle,
          city,
          hints,
          photoCount: items.filter((i) => i.kind === "photo").length,
        },
      });
      setAiTitle(res.title);
      setAiStory(res.story);
    } finally {
      setAiBusy(false);
    }
  };

  const publishJournal = () => {
    const title = aiTitle.trim() || (city ? `${city}的一段小日子` : "未命名的旅行");
    const slug = slugify(title);
    const photos = items.filter((i) => i.kind === "photo");
    const notes = items.filter((i) => i.kind === "note");
    const stickers = items.filter((i) => i.kind === "sticker" && (i.text || i.color));
    const cover = photos[0]?.src ?? uploads[0]?.url ?? polaroidTrain;
    const accent = styleAccentColor(chosenStyle);
    addJournal({
      slug,
      title,
      date: new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long" }),
      city: city || "未命名的城市",
      cover,
      route: city || "—",
      photos: photos.map((p) => ({ src: p.src!, caption: p.text, tape: p.tape })),
      notes: notes.length
        ? notes.map((n) => ({ text: n.text ?? "", color: "bg-butter/40" }))
        : [{ text: aiStory, color: "bg-butter/40" }],
      stickers: stickers.slice(0, 6).map((s) => ({ emoji: s.text ?? "✦", color: s.color ?? accent })),
      status: "published",
    });
    setPublishOpen(false);
    flash("已发布到我的档案");
    setTimeout(() => navigate({ to: "/profile" }), 600);
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
    setSelectedId(id);
    if (item.locked) return;
    offset.current = { x: e.clientX - item.x * zoom, y: e.clientY - item.y * zoom };
    setDragging(id);
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
    if (!it || it.locked) return;
    interaction.current = { mode: "resize", id, startX: e.clientX, startY: e.clientY, startW: it.w };
  };

  const startRotate = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    const it = items.find((i) => i.id === id);
    const el = (e.currentTarget as HTMLElement).closest("[data-frag]") as HTMLElement | null;
    if (!it || !el || it.locked) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startAngle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
    interaction.current = { mode: "rotate", id, cx, cy, startAngle, startR: it.r };
  };

  const deleteItem = (id: number) => {
    setItems((p) => {
      const t = p.find((i) => i.id === id);
      if (t?.locked) return p;
      return p.filter((i) => i.id !== id);
    });
    if (selectedId === id) setSelectedId(null);
  };

  const bringForward = (id: number) => {
    setItems((p) => {
      const idx = p.findIndex((i) => i.id === id);
      if (idx < 0 || idx === p.length - 1) return p;
      const next = p.slice();
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const sendBackward = (id: number) => {
    setItems((p) => {
      const idx = p.findIndex((i) => i.id === id);
      if (idx <= 0) return p;
      const next = p.slice();
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return next;
    });
  };

  const toggleLock = (id: number) => {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, locked: !i.locked } : i)));
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

  // ────────────────────────────────────────────────────────────
  // Wizard pre-editor screens
  // ────────────────────────────────────────────────────────────
  if (step !== "editor") {
    return (
      <div className="min-h-screen bg-cream">
        <SiteNav />
        <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
          <WizardSteps step={step} />

          {step === "upload" && (
            <section className="mt-10">
              <h1 className="font-serif text-5xl italic">先上传一些照片与素材。</h1>
              <p className="text-charcoal/60 mt-3">支持拖拽多张图片。可以选填城市与几句备忘。</p>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onWizardFiles(e.dataTransfer.files);
                }}
                className="mt-8 border-2 border-dashed border-charcoal/20 rounded-[28px] p-12 text-center bg-ivory hover:border-pinkv transition-colors"
              >
                <ImagePlus className="mx-auto size-10 text-charcoal/50" strokeWidth={1.4} />
                <p className="font-serif italic text-2xl mt-3">把照片拖到这里</p>
                <p className="text-xs text-charcoal/50 mt-1">或者</p>
                <label className="inline-block mt-3 cursor-pointer px-5 py-2 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85">
                  选择文件
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onWizardFiles(e.target.files)}
                  />
                </label>
              </div>

              {uploads.length > 0 && (
                <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {uploads.map((u) => (
                    <div key={u.id} className="relative group aspect-square">
                      <img src={u.url} alt={u.name} className="block w-full h-full object-cover rounded-md border border-charcoal/10 scrap-shadow" />
                      <button
                        onClick={() => removeUpload(u.id)}
                        className="absolute -top-2 -right-2 size-6 rounded-full bg-charcoal text-cream grid place-items-center opacity-0 group-hover:opacity-100"
                        aria-label="移除"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50">城市 / 地点</span>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="例如：里斯本"
                    className="mt-2 w-full bg-white border border-charcoal/15 rounded-lg px-3 py-2 font-serif italic text-lg"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50">几句关键词（可选）</span>
                  <input
                    value={hints}
                    onChange={(e) => setHints(e.target.value)}
                    placeholder="例如：海风、柠檬冰沙、慢车"
                    className="mt-2 w-full bg-white border border-charcoal/15 rounded-lg px-3 py-2"
                  />
                </label>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  disabled={uploads.length === 0}
                  onClick={() => setStep("style")}
                  className="px-6 py-2.5 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  下一步：选择风格 →
                </button>
              </div>
            </section>
          )}

          {step === "style" && (
            <section className="mt-10">
              <h1 className="font-serif text-5xl italic">挑一种视觉风格。</h1>
              <p className="text-charcoal/60 mt-3">这会决定胶带颜色、贴纸与版面气质。</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                {STYLES.map((s) => {
                  const active = chosenStyle === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setChosenStyle(s.key)}
                      className={`text-left bg-white border ${active ? "border-charcoal" : "border-charcoal/10"} rounded-2xl p-5 scrap-shadow transition hover:-translate-y-0.5`}
                    >
                      <div className={`${s.swatch} size-12 rounded-full border border-charcoal/15`} />
                      <p className="font-serif italic text-2xl mt-3">{s.name}</p>
                      <p className="text-sm text-charcoal/60 mt-1">{s.desc}</p>
                      {active && (
                        <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-pinkv font-bold">已选择 ✦</p>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-10 flex justify-between">
                <button onClick={() => setStep("upload")} className="text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:text-charcoal">
                  ← 返回
                </button>
                <button
                  onClick={() => setStep("layout")}
                  className="px-6 py-2.5 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85"
                >
                  下一步：生成版面 →
                </button>
              </div>
            </section>
          )}

          {step === "layout" && (
            <section className="mt-10">
              <h1 className="font-serif text-5xl italic">三种排版预览。</h1>
              <p className="text-charcoal/60 mt-3">选择一个进入编辑器自由调整。</p>
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                {layoutPreviews.map((lp) => (
                  <button
                    key={lp.id}
                    onClick={() => openInEditor(lp.id)}
                    className="group text-left bg-white border border-charcoal/10 rounded-2xl p-3 scrap-shadow hover:-translate-y-1 transition cursor-pointer"
                  >
                    <div className="relative w-full aspect-[4/3] bg-ivory rounded-lg overflow-hidden border border-charcoal/10">
                      <div className="dot-grid absolute inset-0 opacity-40" />
                      <div className="absolute inset-0 origin-top-left" style={{ transform: "scale(0.25)" }}>
                        {lp.frags.map((it) =>
                          it.kind === "photo" && it.src ? (
                            <div
                              key={it.id}
                              className="absolute bg-white p-1 border border-charcoal/10 scrap-shadow"
                              style={{ left: it.x, top: it.y, width: it.w, transform: `rotate(${it.r}deg)` }}
                            >
                              <img src={it.src} alt="" className="block w-full aspect-square object-cover" />
                            </div>
                          ) : it.kind === "sticker" ? (
                            <div
                              key={it.id}
                              className={`absolute ${it.color ?? "bg-pinkv"} rounded-full grid place-items-center border border-charcoal/10`}
                              style={{ left: it.x, top: it.y, width: it.w, height: it.w, transform: `rotate(${it.r}deg)` }}
                            >
                              <span className="text-cream text-xl">{it.text}</span>
                            </div>
                          ) : null,
                        )}
                      </div>
                    </div>
                    <p className="font-serif italic text-xl mt-3">{lp.name}</p>
                    <p className="text-xs text-charcoal/60 mt-1">{lp.hint}</p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-charcoal/50 group-hover:text-pinkv">
                      打开此版面 →
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-10 flex justify-between">
                <button onClick={() => setStep("style")} className="text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:text-charcoal">
                  ← 返回
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteNav />

      <div className="pt-28 px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50">
            {STYLES.find((s) => s.key === chosenStyle)?.name} · {selectedLayout ?? "自定义"} 版面
          </p>
          <h1 className="font-serif text-3xl italic">{city || "未命名"}的一段小日子。</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep("layout")}
            className="px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full border border-charcoal/15 hover:bg-white"
          >
            ← 换版面
          </button>
          <button
            onClick={openPublish}
            className="px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full bg-charcoal text-cream hover:bg-charcoal/85"
          >
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

          {/* Sticker panel */}
          {showStickers && (
            <div className="absolute top-5 left-20 w-72 bg-white/95 backdrop-blur-md border border-charcoal/10 rounded-2xl p-4 scrap-shadow z-20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50">
                  贴纸库
                </span>
                <button
                  onClick={() => setShowStickers(false)}
                  className="size-6 grid place-items-center rounded-full hover:bg-cream text-charcoal/60"
                >
                  <X className="size-3.5" strokeWidth={2} />
                </button>
              </div>
              <p className="text-[10px] text-charcoal/50 mb-3 italic">拖到画布上 · 或点击添加</p>
              <div className="max-h-[460px] overflow-auto pr-1 space-y-4">
                {stickerLibrary.map((cat) => (
                  <div key={cat.key}>
                    <p className="font-serif italic text-sm mb-2 text-charcoal/80">{cat.name}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {cat.items.map((def) => (
                        <button
                          key={def.id}
                          draggable
                          onDragStart={(e) => {
                            stickerDragRef.current = def;
                            e.dataTransfer.effectAllowed = "copy";
                            e.dataTransfer.setData("text/plain", def.id);
                          }}
                          onDragEnd={() => {
                            // ref cleared in onCanvasDrop on success
                          }}
                          onClick={() => addStickerToCanvas(def)}
                          title={def.label}
                          className="aspect-square rounded-lg bg-cream/60 border border-charcoal/10 hover:border-pinkv hover:bg-cream grid place-items-center transition-colors cursor-grab active:cursor-grabbing overflow-hidden p-2"
                        >
                          <StickerPreview def={def} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              要把这 {items.length} 片碎片排成一篇杂志版面吗？
            </p>
            <div className="grid grid-cols-3 gap-1.5 mt-3">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-[3/4] bg-cream border border-charcoal/10 rounded-md grid grid-cols-2 grid-rows-2 gap-[2px] p-1">
                  <span className="bg-dusty/40" /><span className="bg-pinkv/40" /><span className="bg-butter/50" /><span className="bg-charcoal/70" />
                </div>
              ))}
            </div>
            <button
              onClick={() => setAiStudioOpen(true)}
              className="w-full mt-4 bg-charcoal text-cream rounded-full py-2 text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85"
            >
              生成版面
            </button>
          </div>

          {/* Layers panel */}
          <div className="absolute bottom-5 right-5 w-60 bg-white/90 backdrop-blur-md border border-charcoal/10 rounded-2xl p-3 scrap-shadow">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50 mb-2">
              图层 · {items.length}
            </p>
            <ul className="space-y-1 max-h-56 overflow-auto text-xs">
              {items.slice().reverse().map((i) => {
                const isSel = selectedId === i.id;
                return (
                  <li
                    key={i.id}
                    onClick={() => setSelectedId(i.id)}
                    className={`group flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer ${
                      isSel ? "bg-pinkv/20" : "hover:bg-cream"
                    }`}
                  >
                    <span className="size-2 rounded-full bg-charcoal/50 shrink-0" />
                    <span className="capitalize truncate flex-1">{i.kind}</span>
                    <button
                      title="上移一层"
                      onClick={(e) => { e.stopPropagation(); bringForward(i.id); }}
                      className="size-5 grid place-items-center rounded hover:bg-white text-charcoal/60 hover:text-charcoal"
                    >
                      <ArrowUp className="size-3" strokeWidth={2} />
                    </button>
                    <button
                      title="下移一层"
                      onClick={(e) => { e.stopPropagation(); sendBackward(i.id); }}
                      className="size-5 grid place-items-center rounded hover:bg-white text-charcoal/60 hover:text-charcoal"
                    >
                      <ArrowDown className="size-3" strokeWidth={2} />
                    </button>
                    <button
                      title={i.locked ? "解锁" : "锁定"}
                      onClick={(e) => { e.stopPropagation(); toggleLock(i.id); }}
                      className={`size-5 grid place-items-center rounded hover:bg-white ${
                        i.locked ? "text-pinkv" : "text-charcoal/60 hover:text-charcoal"
                      }`}
                    >
                      {i.locked ? <Lock className="size-3" strokeWidth={2} /> : <Unlock className="size-3" strokeWidth={2} />}
                    </button>
                    <button
                      title="删除图层"
                      onClick={(e) => { e.stopPropagation(); deleteItem(i.id); }}
                      className="size-5 grid place-items-center rounded hover:bg-white text-charcoal/60 hover:text-pinkv disabled:opacity-30"
                      disabled={i.locked}
                    >
                      <Trash2 className="size-3" strokeWidth={2} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {aiStudioOpen && (
        <AiLayoutStudio
          items={items}
          city={city}
          style={STYLES.find((s) => s.key === chosenStyle)?.name ?? chosenStyle}
          onClose={() => setAiStudioOpen(false)}
          onApply={(frags) => {
            const ids = new Set(frags.map((f) => f.id));
            setItems((prev) => [
              ...prev.filter((p) => !ids.has(p.id)),
              ...(frags as Frag[]),
            ]);
            setAiStudioOpen(false);
            flash("已套用 AI 版面");
          }}
        />
      )}

      {publishOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 grid place-items-center p-6"
          onClick={() => setPublishOpen(false)}
        >
          <div
            className="bg-cream border border-charcoal/10 rounded-2xl p-6 max-w-lg w-full scrap-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="font-serif italic text-3xl">发布为日志</h3>
              <button
                onClick={() => setPublishOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-charcoal/50 hover:text-charcoal"
              >
                取消
              </button>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50">AI 标题</span>
              <input
                value={aiTitle}
                onChange={(e) => setAiTitle(e.target.value)}
                placeholder={aiBusy ? "正在生成…" : "标题"}
                className="mt-2 w-full bg-white border border-charcoal/15 rounded-lg px-3 py-2 font-serif italic text-xl"
              />
            </label>

            <label className="block mt-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50">AI 旅行短文</span>
              <textarea
                value={aiStory}
                onChange={(e) => setAiStory(e.target.value)}
                placeholder={aiBusy ? "正在根据照片与风格写一段短文…" : "短文"}
                rows={5}
                className="mt-2 w-full bg-white border border-charcoal/15 rounded-lg px-3 py-2 font-hand text-lg leading-snug"
              />
            </label>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={regenerateAI}
                disabled={aiBusy}
                className="text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:text-charcoal disabled:opacity-50"
              >
                {aiBusy ? "生成中…" : "↻ 重新生成"}
              </button>
              <button
                onClick={publishJournal}
                disabled={aiBusy || !aiTitle.trim()}
                className="px-6 py-2.5 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85 disabled:opacity-40"
              >
                保存到我的档案 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WizardSteps({ step }: { step: Step }) {
  const labels: { id: Step; label: string }[] = [
    { id: "upload", label: "01 · 上传" },
    { id: "style", label: "02 · 风格" },
    { id: "layout", label: "03 · 版面" },
    { id: "editor", label: "04 · 编辑" },
  ];
  const idx = labels.findIndex((l) => l.id === step);
  return (
    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em]">
      {labels.map((l, i) => (
        <div key={l.id} className="flex items-center gap-3">
          <span className={i <= idx ? "text-charcoal" : "text-charcoal/30"}>{l.label}</span>
          {i < labels.length - 1 && (
            <span className={`h-px w-6 ${i < idx ? "bg-charcoal" : "bg-charcoal/20"}`} />
          )}
        </div>
      ))}
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
  return <AudioFragment it={it} base={base} styleBase={styleBase} onDown={onDown} handles={Handles} />;
}

function AudioFragment({
  it,
  base,
  styleBase,
  onDown,
  handles,
}: {
  it: Frag;
  base: string;
  styleBase: React.CSSProperties;
  onDown: (e: React.MouseEvent, id: number) => void;
  handles: React.ReactNode;
}) {
  const player = useAudioPlayer();
  const audioId = `frag-${it.id}`;
  const isCurrent = player.id === audioId;
  const isPlaying = isCurrent && player.playing;
  const progress = isCurrent ? player.progress : 0;

  return (
    <div data-frag className={base} style={styleBase} onMouseDown={(e) => onDown(e, it.id)}>
      <div
        className={`bg-charcoal text-cream rounded-full px-4 py-2 flex items-center gap-3 scrap-shadow cursor-grab ${
          isCurrent ? "ring-2 ring-butter/70" : ""
        }`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          toggleAudio(audioId, it.src);
        }}
      >
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            toggleAudio(audioId, it.src);
          }}
          className="size-7 rounded-full bg-butter text-charcoal grid place-items-center"
        >
          {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </button>
        <span className="min-w-0 flex-1">
          <span className="text-xs font-semibold block truncate">{it.text}</span>
          <span className="mt-1 flex items-end gap-[2px] h-3">
            {Array.from({ length: 18 }, (_, i) => {
              const h = 0.3 + Math.abs(Math.sin(i * 0.8 + it.id)) * 0.7;
              const played = Math.round(progress * 18);
              return (
                <span
                  key={i}
                  className={`w-[2px] rounded-full ${
                    isCurrent && i < played ? "bg-butter" : "bg-cream/40"
                  } ${isPlaying && i >= played ? "bar bg-cream/80" : ""}`}
                  style={{ height: `${h * 100}%`, animationDelay: `${i * 0.05}s` }}
                />
              );
            })}
          </span>
        </span>
      </div>
      {handles}
    </div>
  );
}

function StickerPreview({ def }: { def: StickerDef }) {
  if (def.kind === "tape") {
    return <span className={`${def.tape} block w-full h-4 rotate-[-4deg] rounded-sm`} />;
  }
  if (def.kind === "stamp") {
    return (
      <div className={`${def.color} w-full h-full grid place-items-center border border-charcoal/15`} style={{ borderStyle: "dashed" }}>
        <span className="text-cream text-lg">{def.emoji}</span>
      </div>
    );
  }
  // heart / star / travel — circular badge
  return (
    <div className={`${def.color} size-10 rounded-full grid place-items-center border border-charcoal/10`}>
      <span className="text-cream text-base leading-none">{def.emoji}</span>
    </div>
  );
}
import { Link } from "@tanstack/react-router";
import { useMemo, useSyncExternalStore } from "react";
import { CalendarDays, ChevronRight, Pause, Play, Plus, Sparkles, Archive } from "lucide-react";
import { journals as seedJournals } from "@/data/journals";
import { snapshotJournals, subscribeJournals } from "@/data/journals-store";
import { toggleAudio, useAudioPlayer } from "@/lib/audio-player";
import seaAudio from "@/assets/sea.mp3.asset.json";
import trainAudio from "@/assets/train.mp3.asset.json";
import marketAudio from "@/assets/market.mp3.asset.json";
import stampsImg from "@/assets/stamps.jpg";
import polaroidFrame from "@/assets/stickers/fragmented-a-09.png.asset.json";
import travelLabel from "@/assets/stickers/fragmented-b-07.png.asset.json";
import silverStar from "@/assets/stickers/fragmented-b-02.png.asset.json";
import blueBow from "@/assets/stickers/fragmented-c-10.png.asset.json";

// Existing ambient clips matched to the seed journals that list audio.
const journalAudio: Record<string, string> = {
  "slow-train-west": trainAudio.url,
  "colorful-houses": seaAudio.url,
  "lanterns-and-saffron": marketAudio.url,
};

/* Cycling collage shapes so no two fragments share the same size or tilt. */
type Shape = { span: string; aspect: string; rot: string; tape: string; tapePos: string };
const SHAPES: Shape[] = [
  { span: "col-span-2", aspect: "aspect-[5/4]", rot: "-rotate-1", tape: "tape", tapePos: "left-6 -rotate-3" },
  { span: "col-span-1", aspect: "aspect-[3/4]", rot: "rotate-2", tape: "tape-pink", tapePos: "right-4 rotate-6" },
  { span: "col-span-1", aspect: "aspect-square", rot: "-rotate-2", tape: "tape-blue", tapePos: "left-3 -rotate-6" },
  { span: "col-span-1", aspect: "aspect-[4/5]", rot: "rotate-1", tape: "tape", tapePos: "right-5 rotate-3" },
  { span: "col-span-1", aspect: "aspect-[3/4]", rot: "-rotate-1", tape: "tape-pink", tapePos: "left-4 rotate-4" },
  { span: "col-span-2", aspect: "aspect-[16/9]", rot: "rotate-1", tape: "tape-blue", tapePos: "right-8 -rotate-2" },
];

export function MobileHome() {
  const all = useSyncExternalStore(subscribeJournals, snapshotJournals, snapshotJournals);
  const published = useMemo(() => all.filter((j) => j.status === "published"), [all]);
  const drafts = useMemo(() => all.filter((j) => j.status === "draft"), [all]);
  const collected = useMemo(() => all.filter((j) => j.collected), [all]);
  const stats = useMemo(() => {
    const cities = new Set(published.map((j) => j.city));
    const fragments = published.reduce((n, j) => n + j.photos.length + j.notes.length + j.stickers.length, 0);
    const sounds = published.reduce((n, j) => n + (j.audio?.length ?? 0), 0);
    return { cities: cities.size, fragments, sounds };
  }, [published]);
  const featured = seedJournals.filter((j) => j.status === "published");
  const player = useAudioPlayer();

  // Wall order: new canvas slot → drafts (unfinished) → published memories.
  const wall = [
    { kind: "new" as const },
    ...drafts.map((j) => ({ kind: "draft" as const, j })),
    ...published.map((j) => ({ kind: "published" as const, j })),
  ];

  return (
    <div className="min-h-screen bg-cream text-charcoal pb-28 overflow-x-hidden">
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 pb-3 bg-cream/92 backdrop-blur-xl border-b border-charcoal/10"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <div className="relative">
          <Link to="/" className="font-serif italic text-2xl tracking-tight">Fragmented</Link>
          <span className="tape absolute -bottom-1.5 left-0 h-[3px] w-14 -rotate-1" aria-hidden />
        </div>
        <Link
          to="/calendar"
          aria-label="日历"
          className="relative grid size-10 place-items-center rounded-full border border-charcoal/15 bg-ivory active:scale-95 transition"
        >
          <CalendarDays className="size-4" />
          <span className="tape-pink absolute -top-1 -right-1 h-3 w-6 rotate-12" aria-hidden />
        </Link>
      </header>

      <main className="px-5 pt-6 space-y-12">
        {/* ── 操作台 ─────────────────────────────────────── */}
        <section className="relative">
          <p className="font-hand text-2xl text-charcoal/60 -rotate-1">今天想拼贴哪段记忆？</p>
          <Link
            to="/create"
            className="relative mt-2 block overflow-hidden bg-butter border border-charcoal/10 p-5 pt-6 scrap-shadow active:scale-[0.98] transition torn-bottom"
          >
            <span className="tape absolute -top-1 right-10 h-6 w-16 rotate-6" aria-hidden />
            <span className="pin absolute top-8 left-4 size-3 rounded-full" aria-hidden />
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-serif text-4xl leading-none">开始拼贴</h1>
                <p className="mt-2 text-sm text-charcoal/70 leading-relaxed">
                  照片、票据、文字与声音，
                  <br />
                  都放进一张无限画布。
                </p>
              </div>
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-charcoal text-cream">
                <Plus className="size-6" />
              </span>
            </div>
            {/* peeking fragment stack */}
            <div className="pointer-events-none absolute -bottom-4 right-4 flex items-end">
              <img
                src={polaroidFrame.url}
                alt=""
                className="w-16 rotate-[-7deg] translate-y-1 opacity-90"
              />
            </div>
          </Link>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <QuickLink to="/collections" Icon={Archive} label="记忆收藏集" tint="bg-pinkv/25" sticker={blueBow} />
            <QuickLink to="/explore" Icon={Sparkles} label="探索拼贴" tint="bg-dusty/25" sticker={silverStar} />
          </div>
        </section>

        {/* ── 最近创作 · 拼贴墙 ─────────────────────────── */}
        <section className="relative">
          <SectionTitle title="最近创作" to="/profile" note="草稿可继续 · 已发布可查看" />
          <div className="relative">
            <img
              src={travelLabel.url}
              alt=""
              className="pointer-events-none absolute -top-5 -right-2 z-20 w-20 rotate-6 opacity-95"
            />
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 pt-2">
              {wall.map((entry, i) => {
                const shape = SHAPES[i % SHAPES.length];
                if (entry.kind === "new") {
                  return (
                    <Link
                      key="new"
                      to="/create"
                      className={`${shape.span} ${shape.rot} grid ${shape.aspect} place-items-center border-2 border-dashed border-charcoal/25 bg-ivory/40 text-center text-xs text-charcoal/60 active:scale-95 transition`}
                    >
                      <span>
                        <Plus className="mx-auto mb-1 size-5" />
                        新建画布
                      </span>
                    </Link>
                  );
                }
                const j = entry.j;
                const isDraft = entry.kind === "draft";
                const inner = (
                  <Polaroid
                    src={j.cover}
                    caption={j.title}
                    sub={isDraft ? "进入创作页继续" : j.date}
                    tag={isDraft ? "草稿" : "已发布"}
                    tagClass={isDraft ? "bg-pinkv" : "bg-butter"}
                    shape={shape}
                    faded={isDraft}
                  />
                );
                return isDraft ? (
                  <Link key={j.slug} to="/create" className="active:scale-[0.97] transition">
                    {inner}
                  </Link>
                ) : (
                  <Link
                    key={j.slug}
                    to="/journal/$slug"
                    params={{ slug: j.slug }}
                    className="active:scale-[0.97] transition"
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 记忆收藏 · 散落明信片 ─────────────────────── */}
        <section>
          <SectionTitle title="记忆收藏" to="/collections" />
          {collected.length === 0 ? (
            <Link
              to="/collections"
              className="block bg-ivory border border-dashed border-charcoal/25 p-4 text-sm text-charcoal/60 active:scale-[0.98] transition"
            >
              还没有收藏，去收藏集看看 →
            </Link>
          ) : (
            <div className="-mx-5 px-5 flex items-start gap-3 overflow-x-auto no-scrollbar pb-3 pt-2">
              {collected.slice(0, 4).map((j, i) => (
                <Link
                  key={j.slug}
                  to="/journal/$slug"
                  params={{ slug: j.slug }}
                  className={`shrink-0 ${i === 0 ? "w-40" : i === 1 ? "w-28" : "w-32"} ${
                    i % 2 ? "rotate-2 translate-y-2" : "-rotate-2"
                  } active:scale-95 transition`}
                >
                  <div className="relative bg-white p-1.5 pb-6 border border-charcoal/10 scrap-shadow">
                    <span
                      className={`${i % 2 ? "tape-blue" : "tape"} absolute -top-2 left-1/2 -translate-x-1/2 h-5 w-12 -rotate-2`}
                      aria-hidden
                    />
                    <img src={j.cover} alt={j.title} className="block w-full aspect-[4/5] object-cover" />
                    <p className="absolute bottom-1 left-2 right-2 truncate font-hand text-base leading-none">
                      {j.city}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                to="/collections"
                className="shrink-0 w-24 -rotate-1 grid place-items-center bg-ivory border border-charcoal/15 p-3 text-center text-[11px] text-charcoal/60 active:scale-95 transition"
              >
                查看全部
                <ChevronRight className="mx-auto mt-1 size-4" />
              </Link>
            </div>
          )}
        </section>

        {/* ── 记忆星球 · 统计入口 ───────────────────────── */}
        <section>
          <Link
            to="/profile"
            search={{ tab: "planet" }}
            className="relative flex items-center gap-4 overflow-hidden bg-charcoal text-cream p-5 pb-7 scrap-shadow active:scale-[0.98] transition torn-bottom"
          >
            <div className="paper-texture absolute inset-0 pointer-events-none" />
            <span className="tape absolute -top-1 left-8 h-6 w-16 -rotate-6" aria-hidden />
            <div className="relative grid size-16 shrink-0 place-items-center">
              <span className="absolute inset-0 rounded-full border border-cream/25 orbit-spin" />
              <span className="absolute inset-2 rounded-full border border-dashed border-pinkv/50" />
              <span className="size-7 rounded-full bg-pinkv flicker" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cream/50">记忆星球</p>
              <p className="mt-1 font-serif text-lg leading-snug">
                {stats.cities} 座城市 · {stats.fragments} 片碎片 · {stats.sounds} 段声音
              </p>
            </div>
            <img
              src={stampsImg}
              alt=""
              className="pointer-events-none absolute -bottom-2 -right-2 w-14 rotate-6 opacity-80"
            />
          </Link>
        </section>

        {/* ── 拼贴灵感 · 杂志式流 ───────────────────────── */}
        <section>
          <SectionTitle title="拼贴灵感" to="/explore" note="点开可看 · 可试听" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {featured.map((j, i) => {
              const src = journalAudio[j.slug];
              const id = `mobile-home-${j.slug}`;
              const active = player.id === id;
              const wide = i === 0 || i === 3;
              return (
                <article
                  key={j.slug}
                  className={`relative ${wide ? "col-span-2" : ""} ${
                    i % 2 ? "rotate-1" : "-rotate-1"
                  } ${i === 2 ? "translate-y-4" : ""}`}
                >
                  <span
                    className={`${i % 2 ? "tape-pink" : "tape"} absolute -top-2 ${
                      i % 2 ? "right-6 rotate-3" : "left-5 -rotate-3"
                    } h-5 w-14 z-10`}
                    aria-hidden
                  />
                  <div className="bg-white p-2 pb-4 border border-charcoal/10 scrap-shadow">
                    <div className={wide ? "flex gap-3" : ""}>
                      <Link
                        to="/journal/$slug"
                        params={{ slug: j.slug }}
                        className={`block ${wide ? "w-2/5 shrink-0" : ""}`}
                      >
                        <img
                          src={j.cover}
                          alt={j.title}
                          className={`block w-full object-cover ${wide ? "aspect-[3/4]" : i % 2 ? "aspect-square" : "aspect-[4/5]"}`}
                        />
                      </Link>
                      <div className={wide ? "min-w-0 flex-1 pt-1" : "min-w-0"}>
                        <Link to="/journal/$slug" params={{ slug: j.slug }} className="block">
                          <h3 className="font-serif text-lg leading-tight">{j.title}</h3>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 mt-0.5">
                            {j.city} · {j.date}
                          </p>
                        </Link>
                        {src && j.audio?.[0] && (
                          <button
                            type="button"
                            onClick={() => toggleAudio(id, src)}
                            className="mt-2 flex w-full items-center gap-2 bg-cream border border-charcoal/10 px-2 py-1.5 text-left text-[11px] active:scale-95 transition"
                            aria-label={active && player.playing ? "暂停声音" : "试听声音"}
                          >
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-charcoal text-cream">
                              {active && player.playing ? <Pause className="size-3" /> : <Play className="size-3" />}
                            </span>
                            <span className="relative min-w-0 flex-1 truncate">
                              {j.audio[0].title}
                              <span
                                className="absolute -bottom-0.5 left-0 h-0.5 bg-dusty"
                                style={{ width: `${active ? player.progress * 100 : 0}%` }}
                              />
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {i === 1 && (
                    <img
                      src={silverStar.url}
                      alt=""
                      className="pointer-events-none absolute -left-3 -bottom-4 w-12 -rotate-12 opacity-90"
                    />
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function Polaroid({
  src,
  caption,
  sub,
  tag,
  tagClass,
  shape,
  faded,
}: {
  src: string;
  caption: string;
  sub: string;
  tag: string;
  tagClass: string;
  shape: Shape;
  faded?: boolean;
}) {
  return (
    <div className={`${shape.span} ${shape.rot} relative`}>
      <span className={`${shape.tape} absolute -top-2 ${shape.tapePos} z-10 h-5 w-14`} aria-hidden />
      <div className="bg-white p-1.5 pb-5 border border-charcoal/10 scrap-shadow">
        <img
          src={src}
          alt={caption}
          loading="lazy"
          className={`block w-full ${shape.aspect} object-cover ${faded ? "opacity-75 saturate-[0.55]" : ""}`}
        />
        <p className="mt-1.5 truncate px-0.5 font-hand text-base leading-none text-charcoal/85">{caption}</p>
        <p className="px-0.5 mt-0.5 truncate text-[10px] text-charcoal/45">{sub}</p>
      </div>
      <span className={`absolute right-2 top-2 z-10 px-2 py-0.5 text-[10px] font-bold ${tagClass}`}>{tag}</span>
    </div>
  );
}

function QuickLink({
  to,
  Icon,
  label,
  tint,
  sticker,
}: {
  to: "/collections" | "/explore";
  Icon: typeof Plus;
  label: string;
  tint: string;
  sticker: { url: string };
}) {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-2 overflow-hidden border border-charcoal/10 px-3 py-3.5 text-sm font-medium active:scale-95 transition ${tint}`}
    >
      <Icon className="size-4 text-charcoal/70" />
      {label}
      <img src={sticker.url} alt="" className="pointer-events-none absolute -bottom-2 -right-2 w-9 rotate-6 opacity-80" />
    </Link>
  );
}

function SectionTitle({
  title,
  to,
  note,
}: {
  title: string;
  to: "/profile" | "/collections" | "/explore";
  note?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-serif text-2xl leading-none">{title}</h2>
        {note && <p className="mt-1 font-hand text-base text-charcoal/50 -rotate-1">{note}</p>}
      </div>
      <Link
        to={to}
        className="shrink-0 border border-charcoal/15 bg-ivory px-3 py-1 text-[11px] text-charcoal/60 active:scale-95 transition"
      >
        全部 →
      </Link>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { useMemo, useSyncExternalStore } from "react";
import { CalendarDays, ChevronRight, Pause, Play, Plus, Sparkles, Archive } from "lucide-react";
import { journals as seedJournals } from "@/data/journals";
import { snapshotJournals, subscribeJournals } from "@/data/journals-store";
import { toggleAudio, useAudioPlayer } from "@/lib/audio-player";
import sea from "@/assets/sea.mp3.asset.json";
import train from "@/assets/train.mp3.asset.json";
import market from "@/assets/market.mp3.asset.json";

// Existing ambient clips matched to the seed journals that list audio.
const journalAudio: Record<string, string> = {
  "slow-train-west": train.url,
  "colorful-houses": sea.url,
  "lanterns-and-saffron": market.url,
};

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

  return (
    <div className="min-h-screen bg-cream text-charcoal pb-28 overflow-x-hidden">
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 pb-3 bg-cream/90 backdrop-blur-xl border-b border-charcoal/5"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <Link to="/" className="font-serif italic text-2xl tracking-tight">Fragmented</Link>
        <Link to="/calendar" aria-label="日历" className="grid size-10 place-items-center rounded-full border border-charcoal/15 bg-ivory active:scale-95 transition">
          <CalendarDays className="size-4" />
        </Link>
      </header>

      <main className="px-5 pt-5 space-y-8">
        {/* 顶部操作区 */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">今天想拼贴哪段记忆？</p>
          <Link
            to="/create"
            className="relative mt-3 block overflow-hidden rounded-3xl bg-butter border border-charcoal/10 p-5 scrap-shadow active:scale-[0.98] transition"
          >
            <span className="tape absolute -top-1 right-8 w-16 h-5 rotate-6" aria-hidden />
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl leading-none">开始拼贴</h1>
                <p className="mt-2 text-sm text-charcoal/70">照片、票据、文字与声音，<br />都放进一张无限画布。</p>
              </div>
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-charcoal text-cream">
                <Plus className="size-6" />
              </span>
            </div>
          </Link>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <QuickLink to="/collections" Icon={Archive} label="记忆收藏集" />
            <QuickLink to="/explore" Icon={Sparkles} label="探索拼贴" />
          </div>
        </section>

        {/* 最近创作 */}
        <section>
          <SectionTitle title="最近创作" to="/profile" />
          <div className="-mx-5 px-5 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none]">
            <Link to="/create" className="snap-start shrink-0 w-32 aspect-[3/4] rounded-2xl border-2 border-dashed border-charcoal/25 grid place-items-center text-center text-xs text-charcoal/60 active:scale-95 transition">
              <span><Plus className="mx-auto mb-1 size-5" />新建画布</span>
            </Link>
            {drafts.map((j) => (
              <Link key={j.slug} to="/create" className="snap-start shrink-0 w-32 active:scale-95 transition">
                <Card cover={j.cover} title={j.title} tag="草稿" tagClass="bg-pinkv" sub="进入创作页" faded />
              </Link>
            ))}
            {published.slice(0, 6).map((j) => (
              <Link key={j.slug} to="/journal/$slug" params={{ slug: j.slug }} className="snap-start shrink-0 w-32 active:scale-95 transition">
                <Card cover={j.cover} title={j.title} tag="已发布" tagClass="bg-butter" sub={j.date} />
              </Link>
            ))}
          </div>
        </section>

        {/* 记忆收藏 */}
        <section>
          <SectionTitle title="记忆收藏" to="/collections" />
          {collected.length === 0 ? (
            <Link to="/collections" className="block rounded-2xl bg-ivory border border-charcoal/10 p-4 text-sm text-charcoal/60">还没有收藏，去收藏集看看 →</Link>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {collected.slice(0, 3).map((j, i) => (
                <Link key={j.slug} to="/journal/$slug" params={{ slug: j.slug }} className={`bg-ivory p-1.5 pb-3 border border-charcoal/10 scrap-shadow ${i % 2 ? "rotate-2" : "-rotate-2"} active:scale-95 transition`}>
                  <img src={j.cover} alt={j.title} className="aspect-square w-full object-cover" />
                  <p className="mt-1.5 truncate font-hand text-base leading-none">{j.city}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 记忆星球 */}
        <section>
          <Link
            to="/profile"
            search={{ tab: "planet" }}
            className="relative flex items-center gap-4 overflow-hidden rounded-3xl bg-charcoal text-cream p-5 active:scale-[0.98] transition"
          >
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
            <ChevronRight className="size-5 text-cream/60" />
          </Link>
        </section>

        {/* 拼贴灵感流 */}
        <section>
          <SectionTitle title="拼贴灵感" to="/explore" />
          <div className="grid grid-cols-2 gap-3">
            {featured.map((j, i) => {
              const src = journalAudio[j.slug];
              const id = `mobile-home-${j.slug}`;
              const active = player.id === id;
              return (
                <article key={j.slug} className={`relative bg-ivory border border-charcoal/10 p-2 pb-3 scrap-shadow ${i % 2 ? "mt-6 rotate-1" : "-rotate-1"}`}>
                  <Link to="/journal/$slug" params={{ slug: j.slug }} className="block">
                    <img src={j.cover} alt={j.title} className="aspect-[4/5] w-full object-cover" />
                    <h3 className="mt-2 font-serif text-base leading-tight">{j.title}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50">{j.city}</p>
                  </Link>
                  {src && j.audio?.[0] && (
                    <button
                      type="button"
                      onClick={() => toggleAudio(id, src)}
                      className="mt-2 flex w-full items-center gap-2 rounded-full bg-cream border border-charcoal/10 px-2 py-1.5 text-left text-[11px] active:scale-95 transition"
                      aria-label={active && player.playing ? "暂停声音" : "试听声音"}
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-charcoal text-cream">
                        {active && player.playing ? <Pause className="size-3" /> : <Play className="size-3" />}
                      </span>
                      <span className="relative min-w-0 flex-1 truncate">
                        {j.audio[0].title}
                        <span className="absolute -bottom-0.5 left-0 h-0.5 bg-dusty" style={{ width: `${active ? player.progress * 100 : 0}%` }} />
                      </span>
                    </button>
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

function QuickLink({ to, Icon, label }: { to: "/collections" | "/explore"; Icon: typeof Plus; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 rounded-2xl bg-ivory border border-charcoal/10 px-4 py-3.5 text-sm font-medium active:scale-95 transition">
      <Icon className="size-4 text-dusty" />
      {label}
    </Link>
  );
}

function SectionTitle({ title, to }: { title: string; to: "/profile" | "/collections" | "/explore" }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="font-serif text-2xl">{title}</h2>
      <Link to={to} className="text-xs text-charcoal/50 py-2 pl-3">全部 →</Link>
    </div>
  );
}

function Card({ cover, title, tag, tagClass, sub, faded }: { cover: string; title: string; tag: string; tagClass: string; sub: string; faded?: boolean }) {
  return (
    <div className="rounded-2xl bg-ivory border border-charcoal/10 p-1.5 pb-2.5">
      <div className="relative">
        <img src={cover} alt={title} className={`aspect-square w-full rounded-xl object-cover ${faded ? "opacity-75 grayscale-[30%]" : ""}`} />
        <span className={`absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${tagClass}`}>{tag}</span>
      </div>
      <p className="mt-2 px-1 truncate font-serif text-sm">{title}</p>
      <p className="px-1 text-[10px] text-charcoal/50 truncate">{sub}</p>
    </div>
  );
}

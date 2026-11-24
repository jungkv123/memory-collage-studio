import { Link } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import { CalendarDays, ChevronRight, Plus, Orbit } from "lucide-react";
import { journals as seedJournals } from "@/data/journals";
import { snapshotJournals, subscribeJournals } from "@/data/journals-store";
import { Button } from "@/components/ui/button";
import { homeJournalSections } from "./journal-presentation";
import { JournalComposition } from "./JournalComposition";

export function MobileHome() {
  const all = useSyncExternalStore(subscribeJournals, snapshotJournals, snapshotJournals);
  const { recent, featured, published } = homeJournalSections(all, seedJournals);
  const collected = all.filter((j) => j.collected);
  const cities = new Set(published.map((j) => j.city)).size;
  const fragments = published.reduce((n, j) => n + j.photos.length + j.notes.length + j.stickers.length, 0);
  const sounds = published.reduce((n, j) => n + (j.audio?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-cream text-charcoal pb-24">
      <header className="editorial-home-header sticky top-0 z-40 flex items-center justify-between bg-cream/95 m-page pb-3 backdrop-blur-xl border-b border-charcoal/10">
        <Link to="/" className="font-serif italic text-2xl">Fragmented</Link>
        <Button asChild variant="ghost" size="icon" className="size-11 rounded-full"><Link to="/calendar" aria-label="日历"><CalendarDays className="size-5" /></Link></Button>
      </header>
      <main className="m-page pt-6">
        <section>
          <p className="m-secondary mb-3">今天想留下哪段记忆？</p>
          <Button asChild className="h-auto w-full justify-start whitespace-normal rounded-lg bg-butter text-charcoal p-5 shadow-none hover:bg-butter">
            <Link to="/create"><Plus className="size-8 shrink-0" /><h1 className="m-display">开始拼贴</h1><ChevronRight className="ml-auto size-5" /></Link>
          </Button>
        </section>

        <section className="m-section" aria-label="最近创作">
          <SectionTitle title="最近创作" to="/profile" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {recent.map((j) => {
              const content = <><img src={j.cover} alt={j.title} className="m-media aspect-[4/3]" /><div className="mt-3 flex items-center gap-2"><span className={`rounded px-1.5 py-0.5 text-xs font-medium ${j.status === "draft" ? "bg-pinkv" : "bg-butter"}`}>{j.status === "draft" ? "草稿" : "已发布"}</span></div><h3 className="m-body mt-2 font-semibold">{j.title}</h3><p className="m-caption mt-1">{j.date}</p></>;
              return j.status === "draft" ? <Link key={j.slug} to="/create" aria-label={`打开草稿创作入口：${j.title}`} className="min-w-0">{content}</Link> : <Link key={j.slug} to="/journal/$slug" params={{ slug: j.slug }} className="min-w-0">{content}</Link>;
            })}
            <Button asChild variant="outline" className="h-24 self-start whitespace-normal border-dashed bg-ivory shadow-none">
              <Link to="/create" aria-label="新建画布"><Plus /><span>新建画布</span></Link>
            </Button>
          </div>
          {recent.length === 0 && <p className="m-body mt-4">还没有作品。</p>}
        </section>

        <section className="m-section" aria-label="记忆收藏">
          <SectionTitle title="记忆收藏" to="/collections" />
          <div className="border-y border-charcoal/15">
            {collected.length ? collected.slice(0, 2).map((j) => <Link key={j.slug} to="/journal/$slug" params={{ slug: j.slug }} className="flex min-h-16 items-center justify-between gap-4 py-3"><div className="min-w-0"><p className="m-body font-medium">{j.title}</p><p className="m-caption mt-1">{j.city} · {j.date}</p></div><ChevronRight className="size-4 shrink-0" /></Link>) : <Link to="/collections" className="m-body block py-4">还没有收藏，去收藏集看看 →</Link>}
          </div>
        </section>

        <section className="m-section">
          <Link to="/profile" search={{ tab: "planet" }} className="flex items-center gap-4 rounded-lg bg-pinkv/30 p-4" aria-label="记忆星球">
            <Orbit className="size-10 shrink-0" strokeWidth={1.2} />
            <div className="min-w-0 flex-1"><h2 className="m-h2">记忆星球</h2><p className="m-secondary mt-2">{cities} 座城市 · {fragments} 片碎片</p><p className="m-caption mt-1">{sounds} 段声音</p></div><ChevronRight className="size-4 shrink-0" />
          </Link>
        </section>

        <section className="m-section" aria-label="拼贴灵感">
          <SectionTitle title="拼贴灵感" to="/explore" />
          <div className="space-y-8">{featured.map((j, i) => <JournalComposition key={j.slug} journal={j} index={i} />)}</div>
          {featured.length === 0 && <Link to="/explore" className="m-body block py-4">去探索看看 →</Link>}
        </section>
      </main>
    </div>
  );
}

function SectionTitle({ title, to }: { title: string; to: "/profile" | "/collections" | "/explore" }) {
  return <div className="m-section-head"><h2 className="m-h2">{title}</h2><Button asChild variant="ghost" className="h-11 px-0 text-sm"><Link to={to} aria-label={`查看全部${title}`}>全部<ChevronRight /></Link></Button></div>;
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import stamps from "@/assets/stamps.jpg";
import { journals as allJournals, getCities, type Journal } from "@/data/journals";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "我的 — Fragmented" },
      { name: "description", content: "你的旅行档案：日志、碎片，以及一颗私密的记忆星球。" },
      { property: "og:title", content: "我的 — Fragmented" },
      { property: "og:description", content: "你在 Fragmented 上的私人旅行剪贴簿。" },
    ],
  }),
  component: Profile,
});

const TABS = ["日志", "草稿", "收藏", "星球"] as const;
type Tab = (typeof TABS)[number];

function Profile() {
  const [tab, setTab] = useState<Tab>("日志");
  const [journals, setJournals] = useState<Journal[]>(allJournals);
  const [openCity, setOpenCity] = useState<string | null>(null);

  const published = useMemo(() => journals.filter((j) => j.status === "published"), [journals]);
  const drafts = useMemo(() => journals.filter((j) => j.status === "draft"), [journals]);
  const collected = useMemo(() => journals.filter((j) => j.collected), [journals]);
  const cities = useMemo(() => {
    const map = new Map<string, Journal[]>();
    for (const j of journals) {
      if (j.status !== "published") continue;
      const list = map.get(j.city) ?? [];
      list.push(j);
      map.set(j.city, list);
    }
    return Array.from(map, ([city, items]) => ({ city, items }));
  }, [journals]);

  const deleteDraft = (slug: string) => {
    if (!window.confirm("删除这份草稿？")) return;
    setJournals((p) => p.filter((j) => j.slug !== slug));
  };
  const removeFromCollection = (slug: string) => {
    setJournals((p) => p.map((j) => (j.slug === slug ? { ...j, collected: false } : j)));
  };

  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />

      <header className="pt-40 pb-12 px-6 max-w-6xl mx-auto grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
            §— 个人档案
          </span>
          <h1 className="font-serif text-6xl md:text-8xl mt-3 leading-[0.95]">
            Clara <span className="italic text-dusty">M.</span>
          </h1>
          <p className="font-hand text-2xl text-charcoal/60 mt-4 -rotate-1">
            收据收藏家，火车声的聆听者
          </p>
        </div>
        <div className="md:col-span-5 relative">
          <div className="bg-white border border-charcoal/10 rounded-2xl p-5 scrap-shadow rotate-[-2deg]">
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat n="14" label="日志" />
              <Stat n="312" label="碎片" />
              <Stat n="22" label="城市" />
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-charcoal/10 pt-4">
              <img src={stamps} alt="" className="size-12 rounded-full object-cover border border-charcoal/10" />
              <div className="text-xs">
                <p className="font-bold uppercase tracking-[0.2em] text-charcoal/50">加入</p>
                <p className="font-serif italic text-lg">第 02 卷 · 2024 春</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="max-w-6xl mx-auto px-6 mb-10 flex gap-6 border-b border-charcoal/10 text-sm">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 font-bold uppercase tracking-[0.2em] text-xs cursor-pointer transition-colors ${
              tab === t ? "border-b-2 border-charcoal text-charcoal" : "text-charcoal/40 hover:text-charcoal"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <section className="max-w-6xl mx-auto px-6 pb-20 animate-in fade-in duration-300" key={tab}>
        {tab === "日志" && <JournalGrid items={published} />}

        {tab === "草稿" && (
          drafts.length === 0 ? (
            <EmptyState text="还没有草稿。开始写一段碎片吧。" cta="去创作" toCreate />
          ) : (
            <div className="grid md:grid-cols-4 gap-8">
              {drafts.map((j, i) => (
                <article
                  key={j.slug}
                  className={`group bg-white border border-charcoal/10 p-3 pb-4 scrap-shadow ${
                    i % 2 ? "rotate-1" : "-rotate-1"
                  } hover:rotate-0 transition`}
                >
                  <Link to="/journal/$slug" params={{ slug: j.slug }} className="block cursor-pointer">
                    <img src={j.cover} alt="" className="block w-full aspect-square object-cover opacity-80" />
                    <h3 className="font-serif italic text-xl mt-3 leading-tight">{j.title}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 mt-1">
                      草稿 · {j.date}
                    </p>
                  </Link>
                  <div className="mt-3 flex gap-2 text-[10px] uppercase tracking-[0.2em]">
                    <Link
                      to="/journal/$slug"
                      params={{ slug: j.slug }}
                      className="flex-1 text-center py-1.5 rounded-full bg-charcoal text-cream hover:bg-charcoal/85"
                    >
                      继续编辑
                    </Link>
                    <button
                      onClick={() => deleteDraft(j.slug)}
                      className="flex-1 py-1.5 rounded-full border border-charcoal/15 hover:bg-pinkv/20 cursor-pointer"
                    >
                      删除
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )
        )}

        {tab === "收藏" && (
          collected.length === 0 ? (
            <EmptyState text="收藏夹还是空的。" cta="去逛逛" toExplore />
          ) : (
            <div className="grid md:grid-cols-4 gap-8">
              {collected.map((j, i) => (
                <article
                  key={j.slug}
                  className={`group bg-white border border-charcoal/10 p-3 pb-4 scrap-shadow ${
                    i % 2 ? "rotate-1" : "-rotate-1"
                  } hover:rotate-0 transition`}
                >
                  <Link to="/journal/$slug" params={{ slug: j.slug }} className="block cursor-pointer">
                    <img src={j.cover} alt="" className="block w-full aspect-square object-cover" />
                    <h3 className="font-serif italic text-xl mt-3 leading-tight">{j.title}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 mt-1">{j.date}</p>
                  </Link>
                  <div className="mt-3 flex gap-2 text-[10px] uppercase tracking-[0.2em]">
                    <Link
                      to="/journal/$slug"
                      params={{ slug: j.slug }}
                      className="flex-1 text-center py-1.5 rounded-full bg-charcoal text-cream hover:bg-charcoal/85"
                    >
                      打开
                    </Link>
                    <button
                      onClick={() => removeFromCollection(j.slug)}
                      className="flex-1 py-1.5 rounded-full border border-charcoal/15 hover:bg-pinkv/20 cursor-pointer"
                    >
                      取消收藏
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )
        )}

        {tab === "星球" && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50 mb-6">
              你的记忆星球 · {cities.length} 颗
            </p>
            <div className="flex flex-wrap gap-10 items-center justify-center min-h-[360px] bg-ivory border border-charcoal/10 rounded-[28px] p-10 dot-grid">
              {cities.map(({ city, items }, i) => (
                <button
                  key={city}
                  onClick={() => setOpenCity(city)}
                  style={{ animationDelay: `${i * 0.4}s` }}
                  className="group flex flex-col items-center gap-2 cursor-pointer float-y"
                >
                  <span
                    className={`size-24 rounded-full grid place-items-center scrap-shadow border border-charcoal/10 transition-transform group-hover:scale-110 group-hover:-rotate-6 ${
                      ["bg-pinkv", "bg-butter", "bg-dusty", "bg-charcoal"][i % 4]
                    }`}
                  >
                    <span className="font-serif italic text-cream text-lg">{city}</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/60">
                    {items.length} 篇日志
                  </span>
                </button>
              ))}
            </div>

            {openCity && (
              <div
                className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 grid place-items-center p-6 animate-in fade-in duration-200"
                onClick={() => setOpenCity(null)}
              >
                <div
                  className="bg-cream border border-charcoal/10 rounded-2xl p-6 max-w-2xl w-full scrap-shadow"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="font-serif italic text-3xl">{openCity}</h3>
                    <button
                      onClick={() => setOpenCity(null)}
                      className="text-xs uppercase tracking-[0.2em] text-charcoal/50 hover:text-charcoal cursor-pointer"
                    >
                      关闭
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(cities.find((c) => c.city === openCity)?.items ?? []).map((j) => (
                      <Link
                        key={j.slug}
                        to="/journal/$slug"
                        params={{ slug: j.slug }}
                        className="bg-white border border-charcoal/10 p-3 scrap-shadow hover:-rotate-1 transition cursor-pointer"
                      >
                        <img src={j.cover} alt="" className="block w-full aspect-[4/3] object-cover" />
                        <h4 className="font-serif italic text-lg mt-2">{j.title}</h4>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50">{j.date}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

function JournalGrid({ items }: { items: Journal[] }) {
  if (items.length === 0) return <EmptyState text="还没有发布的日志。" cta="去创作" toCreate />;
  return (
    <div className="grid md:grid-cols-4 gap-8">
      {items.map((j, i) => (
        <Link
          key={j.slug}
          to="/journal/$slug"
          params={{ slug: j.slug }}
          className={`block bg-white border border-charcoal/10 p-3 pb-8 scrap-shadow ${
            i % 2 ? "rotate-1" : "-rotate-1"
          } hover:rotate-0 hover:-translate-y-1 transition cursor-pointer`}
        >
          <img src={j.cover} alt="" className="block w-full aspect-square object-cover" />
          <h3 className="font-serif italic text-xl mt-3 leading-tight">{j.title}</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 mt-1">{j.date}</p>
        </Link>
      ))}
    </div>
  );
}

function EmptyState({
  text,
  cta,
  toCreate,
  toExplore,
}: {
  text: string;
  cta: string;
  toCreate?: boolean;
  toExplore?: boolean;
}) {
  const cls =
    "inline-block mt-6 px-5 py-2 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-charcoal/85";
  return (
    <div className="text-center py-20 border border-dashed border-charcoal/15 rounded-[28px]">
      <p className="font-serif italic text-2xl text-charcoal/60">{text}</p>
      {toCreate && <Link to="/create" className={cls}>{cta}</Link>}
      {toExplore && <Link to="/explore" className={cls}>{cta}</Link>}
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-3xl italic">{n}</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/50 mt-1">{label}</p>
    </div>
  );
}
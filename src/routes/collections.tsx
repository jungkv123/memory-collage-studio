import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { collections, getJournalsForCollection } from "@/data/journals";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "收藏集 — Fragmented" },
      { name: "description", content: "按季节、心情或同行者精心整理的旅行日志盒。" },
      { property: "og:title", content: "收藏集 — Fragmented" },
      { property: "og:description", content: "由社区策划的旅行拼贴合辑。" },
    ],
  }),
  component: Collections,
});

function Collections() {
  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      <header className="pt-40 pb-12 px-6 max-w-6xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
          §— 合辑盒子
        </span>
        <div className="mt-3 flex items-end justify-between gap-6 flex-wrap">
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.95]">
            收藏集。<br />
            <span className="italic text-pinkv">一架子</span>的盒子。
          </h1>
          <p className="text-charcoal/65 max-w-sm">
            把日志整理进一个个小盒子——按季节、按城市、按"暂离日常"的那种感觉。
          </p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 pb-20">
        {collections.map((c, i) => {
          const count = getJournalsForCollection(c).length;
          return (
          <article
            key={c.title}
            className={`relative bg-white border border-charcoal/10 rounded-[24px] p-6 scrap-shadow ${i % 2 ? "md:translate-y-12" : ""} group`}
          >
            <div className={`absolute -top-3 left-8 ${c.accent} h-6 w-24 rotate-[-3deg] border border-charcoal/10`} />
            <div className="grid grid-cols-3 gap-2">
              <img src={c.cover} alt="" className="col-span-2 row-span-2 aspect-square object-cover rounded-md border border-charcoal/10" />
              <div className="aspect-square bg-cream border border-charcoal/10 rounded-md grid place-items-center text-2xl font-serif italic">{count}</div>
              <div className={`aspect-square ${c.accent} rounded-md border border-charcoal/10`} />
              <div className="aspect-square bg-charcoal text-cream rounded-md grid place-items-center text-[10px] font-bold uppercase tracking-[0.2em]">盒</div>
              <div className="aspect-square bg-ivory border border-charcoal/10 rounded-md" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <h3 className="font-serif text-3xl italic">{c.title}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mt-1">{count.toString().padStart(2, "0")} 篇日志 · {c.subtitle}</p>
              </div>
              <Link
                to="/collection/$slug"
                params={{ slug: c.slug }}
                className="text-xs font-bold uppercase tracking-[0.2em] underline underline-offset-4 decoration-charcoal/30 hover:decoration-charcoal"
              >
                打开盒子 →
              </Link>
            </div>
          </article>
          );
        })}
      </section>

      <SiteFooter />
    </div>
  );
}
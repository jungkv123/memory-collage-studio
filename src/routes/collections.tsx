import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import italy from "@/assets/polaroid-italy.jpg";
import kyoto from "@/assets/polaroid-kyoto.jpg";
import morocco from "@/assets/polaroid-morocco.jpg";
import train from "@/assets/polaroid-train.jpg";

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

const collections = [
  { title: "慢车时光", subtitle: "12 篇日志", cover: train, accent: "bg-dusty/30", count: 12 },
  { title: "海边的午后", subtitle: "08 篇日志", cover: italy, accent: "bg-pinkv/30", count: 8 },
  { title: "雨中的城市", subtitle: "14 篇日志", cover: kyoto, accent: "bg-butter/40", count: 14 },
  { title: "市集与香料", subtitle: "06 篇日志", cover: morocco, accent: "bg-charcoal/15", count: 6 },
];

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
        {collections.map((c, i) => (
          <article
            key={c.title}
            className={`relative bg-white border border-charcoal/10 rounded-[24px] p-6 scrap-shadow ${i % 2 ? "md:translate-y-12" : ""} group`}
          >
            <div className={`absolute -top-3 left-8 ${c.accent} h-6 w-24 rotate-[-3deg] border border-charcoal/10`} />
            <div className="grid grid-cols-3 gap-2">
              <img src={c.cover} alt="" className="col-span-2 row-span-2 aspect-square object-cover rounded-md border border-charcoal/10" />
              <div className="aspect-square bg-cream border border-charcoal/10 rounded-md grid place-items-center text-2xl font-serif italic">{c.count}</div>
              <div className={`aspect-square ${c.accent} rounded-md border border-charcoal/10`} />
              <div className="aspect-square bg-charcoal text-cream rounded-md grid place-items-center text-[10px] font-bold uppercase tracking-[0.2em]">盒</div>
              <div className="aspect-square bg-ivory border border-charcoal/10 rounded-md" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <h3 className="font-serif text-3xl italic">{c.title}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mt-1">{c.subtitle}</p>
              </div>
              <button className="text-xs font-bold uppercase tracking-[0.2em] underline underline-offset-4 decoration-charcoal/30 hover:decoration-charcoal">
                打开盒子 →
              </button>
            </div>
          </article>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}
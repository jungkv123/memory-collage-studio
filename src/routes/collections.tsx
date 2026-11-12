import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { collections, getJournalsForCollection } from "@/data/journals";
import blueFrame from "@/assets/stickers/fragmented-c-02.png.asset.json";
import heartFrame from "@/assets/stickers/fragmented-a-09.png.asset.json";
import linedNote from "@/assets/stickers/fragmented-b-05.png.asset.json";
import blueBow from "@/assets/stickers/fragmented-c-10.png.asset.json";

const boxStickers = [blueFrame.url, heartFrame.url, linedNote.url, blueBow.url];

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
      <header className="pt-28 md:pt-40 pb-12 px-5 md:px-6 max-w-6xl mx-auto">
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

      {/* Phone: boxes as overlapping paper folders */}
      <section className="md:hidden px-5 pb-16 space-y-12">
        {collections.map((c, i) => {
          const count = getJournalsForCollection(c).length;
          return (
            <article
              key={c.title}
              className={`relative ${i % 2 ? "rotate-1 -translate-x-1" : "-rotate-1 translate-x-1"}`}
            >
              <span
                className={`${i % 2 ? "tape-pink" : "tape"} absolute -top-3 left-8 z-20 h-6 w-20 -rotate-3`}
                aria-hidden
              />
              <div className="relative border border-charcoal/10 bg-ivory p-3 pb-5 scrap-shadow torn-bottom">
                <div className="paper-texture absolute inset-0 pointer-events-none" />
                <div className="relative">
                  <img
                    src={c.cover}
                    alt=""
                    className="block w-full aspect-[4/3] object-cover border border-charcoal/10"
                  />
                  <span className="absolute -right-3 -top-3 grid size-12 place-items-center rounded-full bg-charcoal font-serif text-lg italic text-cream scrap-shadow">
                    {count.toString().padStart(2, "0")}
                  </span>
                  <span className="pin absolute -left-1.5 top-4 size-3 rounded-full" aria-hidden />
                </div>
                <div className="relative mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-serif italic text-2xl leading-none">{c.title}</h3>
                    <p className="mt-1.5 font-hand text-lg leading-none text-charcoal/60">{c.subtitle}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-charcoal/45">
                      {count.toString().padStart(2, "0")} 篇日志
                    </p>
                  </div>
                  <Link
                    to="/collection/$slug"
                    params={{ slug: c.slug }}
                    className="shrink-0 bg-charcoal px-3 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-cream active:scale-95 transition"
                  >
                    打开盒子
                  </Link>
                </div>
              </div>
              <img
                src={boxStickers[i % boxStickers.length]}
                alt=""
                className={`pointer-events-none absolute w-14 opacity-90 ${
                  i % 2 ? "-bottom-4 -right-2 -rotate-6" : "-bottom-5 -left-2 rotate-6"
                }`}
              />
            </article>
          );
        })}
      </section>

      <section className="hidden md:grid max-w-6xl mx-auto px-6 md:grid-cols-2 gap-10 pb-20">
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
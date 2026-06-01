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
      { title: "Collections — Fragmented" },
      { name: "description", content: "Curated boxes of travel journals — by season, mood, or company." },
      { property: "og:title", content: "Collections — Fragmented" },
      { property: "og:description", content: "Boxed sets of travel collages, curated by the community." },
    ],
  }),
  component: Collections,
});

const collections = [
  { title: "Slow trains", subtitle: "12 journals", cover: train, accent: "bg-dusty/30", count: 12 },
  { title: "Coastal afternoons", subtitle: "08 journals", cover: italy, accent: "bg-pinkv/30", count: 8 },
  { title: "Cities in the rain", subtitle: "14 journals", cover: kyoto, accent: "bg-butter/40", count: 14 },
  { title: "Markets & spices", subtitle: "06 journals", cover: morocco, accent: "bg-charcoal/15", count: 6 },
];

function Collections() {
  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      <header className="pt-40 pb-12 px-6 max-w-6xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
          §— Boxed Sets
        </span>
        <div className="mt-3 flex items-end justify-between gap-6 flex-wrap">
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.95]">
            Collections.<br />
            <span className="italic text-pinkv">A shelf of</span> boxes.
          </h1>
          <p className="text-charcoal/65 max-w-sm">
            Group journals into a little curated box — by season, by city, by
            the feeling of being out of office.
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
              <div className="aspect-square bg-charcoal text-cream rounded-md grid place-items-center text-[10px] font-bold uppercase tracking-[0.2em]">Box</div>
              <div className="aspect-square bg-ivory border border-charcoal/10 rounded-md" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <h3 className="font-serif text-3xl italic">{c.title}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mt-1">{c.subtitle}</p>
              </div>
              <button className="text-xs font-bold uppercase tracking-[0.2em] underline underline-offset-4 decoration-charcoal/30 hover:decoration-charcoal">
                Open box →
              </button>
            </div>
          </article>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}
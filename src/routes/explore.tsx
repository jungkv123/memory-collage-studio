import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import italy from "@/assets/polaroid-italy.jpg";
import kyoto from "@/assets/polaroid-kyoto.jpg";
import morocco from "@/assets/polaroid-morocco.jpg";
import envelope from "@/assets/envelope-airmail.jpg";
import stamps from "@/assets/stamps.jpg";
import ticket from "@/assets/ticket-paris.jpg";
import map from "@/assets/map-tokyo-torn.jpg";
import train from "@/assets/polaroid-train.jpg";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Fragmented" },
      { name: "description", content: "Wander through community-made travel collages, sound clips, and hand-drawn routes." },
      { property: "og:title", content: "Explore — Fragmented" },
      { property: "og:description", content: "A scrapbook feed of travel stories from around the world." },
    ],
  }),
  component: Explore,
});

type Card = {
  src: string;
  span: string;
  rotate: string;
  title: string;
  place: string;
  tape: string;
};

const items: Card[] = [
  { src: italy, span: "row-span-2", rotate: "-rotate-2", title: "Houses the color of fruit", place: "Cinque Terre", tape: "tape" },
  { src: kyoto, span: "", rotate: "rotate-1", title: "Rain through cedar", place: "Kyoto", tape: "tape-pink" },
  { src: envelope, span: "", rotate: "-rotate-1", title: "Letters I never sent", place: "Buenos Aires", tape: "tape-blue" },
  { src: morocco, span: "row-span-2", rotate: "rotate-2", title: "Lanterns and saffron", place: "Marrakesh", tape: "tape" },
  { src: train, span: "", rotate: "-rotate-1", title: "Window seat, west", place: "Swiss Alps", tape: "tape-pink" },
  { src: stamps, span: "", rotate: "rotate-2", title: "Postage from strangers", place: "Lisboa", tape: "tape-blue" },
  { src: ticket, span: "", rotate: "-rotate-2", title: "Stubs in my pocket", place: "Paris", tape: "tape" },
  { src: map, span: "row-span-2", rotate: "rotate-1", title: "A torn map of Shibuya", place: "Tokyo", tape: "tape-pink" },
];

const filters = ["All", "Coastal", "Cities", "Mountains", "Markets", "Quiet places", "Long trains"];

function Explore() {
  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      <header className="pt-40 pb-12 px-6 text-center max-w-4xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
          §— The Reading Room
        </span>
        <h1 className="font-serif text-6xl md:text-8xl mt-4 leading-[0.95]">
          Wander through<br />
          <span className="italic text-dusty">other people's</span> memories.
        </h1>
        <p className="font-hand text-2xl text-charcoal/60 mt-6 -rotate-1">
          a feed, but slower
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center gap-2 mb-12">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em] border transition ${
              i === 0
                ? "bg-charcoal text-cream border-charcoal"
                : "bg-ivory border-charcoal/15 hover:bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-6 pb-20">
        {items.map((it, i) => (
          <article
            key={i}
            className={`group relative ${it.span} ${it.rotate} transition-transform hover:rotate-0 hover:-translate-y-1`}
          >
            <div className="relative h-full w-full bg-white p-2 border border-charcoal/10 scrap-shadow overflow-hidden">
              <span className={`${it.tape} absolute -top-3 left-6 w-14 h-5 rotate-[-4deg] z-10`} />
              <img src={it.src} alt="" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cream/70">{it.place}</p>
                <p className="font-serif italic text-cream text-lg leading-tight">{it.title}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}
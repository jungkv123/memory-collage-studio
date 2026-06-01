import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import italy from "@/assets/polaroid-italy.jpg";
import kyoto from "@/assets/polaroid-kyoto.jpg";
import morocco from "@/assets/polaroid-morocco.jpg";
import train from "@/assets/polaroid-train.jpg";
import stamps from "@/assets/stamps.jpg";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Fragmented" },
      { name: "description", content: "Your travel archive: journals, fragments, and a private memory orb." },
      { property: "og:title", content: "Profile — Fragmented" },
      { property: "og:description", content: "Your personal scrapbook of travel memories on Fragmented." },
    ],
  }),
  component: Profile,
});

const journals = [
  { img: train, title: "Slow trains, west", date: "Jun 2024" },
  { img: italy, title: "Houses the color of fruit", date: "Jul 2024" },
  { img: kyoto, title: "Rain through cedar", date: "Oct 2024" },
  { img: morocco, title: "Lanterns and saffron", date: "Feb 2025" },
];

function Profile() {
  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />

      <header className="pt-40 pb-12 px-6 max-w-6xl mx-auto grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
            §— Personal Archive
          </span>
          <h1 className="font-serif text-6xl md:text-8xl mt-3 leading-[0.95]">
            Clara <span className="italic text-dusty">M.</span>
          </h1>
          <p className="font-hand text-2xl text-charcoal/60 mt-4 -rotate-1">
            collector of receipts, listener of trains
          </p>
        </div>
        <div className="md:col-span-5 relative">
          <div className="bg-white border border-charcoal/10 rounded-2xl p-5 scrap-shadow rotate-[-2deg]">
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat n="14" label="Journals" />
              <Stat n="312" label="Fragments" />
              <Stat n="22" label="Cities" />
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-charcoal/10 pt-4">
              <img src={stamps} alt="" className="size-12 rounded-full object-cover border border-charcoal/10" />
              <div className="text-xs">
                <p className="font-bold uppercase tracking-[0.2em] text-charcoal/50">Joined</p>
                <p className="font-serif italic text-lg">Vol. 02 · Spring 2024</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="max-w-6xl mx-auto px-6 mb-10 flex gap-6 border-b border-charcoal/10 text-sm">
        {["Journals", "Drafts", "Saved", "Orb"].map((t, i) => (
          <button
            key={t}
            className={`pb-3 font-bold uppercase tracking-[0.2em] text-xs ${i === 0 ? "border-b-2 border-charcoal text-charcoal" : "text-charcoal/40 hover:text-charcoal"}`}
          >
            {t}
          </button>
        ))}
      </nav>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 pb-20">
        {journals.map((j, i) => (
          <article
            key={j.title}
            className={`bg-white border border-charcoal/10 p-3 pb-8 scrap-shadow ${i % 2 ? "rotate-1" : "-rotate-1"} hover:rotate-0 transition`}
          >
            <img src={j.img} alt="" className="block w-full aspect-square object-cover" />
            <h3 className="font-serif italic text-xl mt-3 leading-tight">{j.title}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 mt-1">{j.date}</p>
          </article>
        ))}
      </section>

      <SiteFooter />
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
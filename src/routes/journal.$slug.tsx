import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getJournalBySlug, journals, type Journal } from "@/data/journals";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const journal = getJournalBySlug(params.slug);
    if (!journal) throw notFound();
    return { journal };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.journal.title} — Fragmented` },
          { name: "description", content: `${loaderData.journal.city} · ${loaderData.journal.date}` },
          { property: "og:title", content: `${loaderData.journal.title} — Fragmented` },
          { property: "og:description", content: `${loaderData.journal.city} · ${loaderData.journal.route}` },
          { property: "og:image", content: loaderData.journal.cover },
        ]
      : [{ title: "日志 — Fragmented" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-cream grid place-items-center px-6">
      <div className="text-center">
        <p className="font-serif italic text-3xl">这一页还没被写下。</p>
        <Link to="/profile" className="inline-block mt-6 px-5 py-2 rounded-full bg-charcoal text-cream text-xs uppercase tracking-[0.2em]">
          回到我的档案
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen bg-cream grid place-items-center">
      <button onClick={reset} className="px-5 py-2 rounded-full bg-charcoal text-cream text-xs uppercase tracking-[0.2em]">重试</button>
    </div>
  ),
  component: JournalDetail,
});

function JournalDetail() {
  const { journal: j } = Route.useLoaderData() as { journal: Journal };

  const rots = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-3", "rotate-3"];
  const related = journals.filter((x) => x.slug !== j.slug && x.status === "published").slice(0, 3);

  return (
    <div className="min-h-screen bg-cream animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SiteNav />

      {/* Cover */}
      <header className="pt-32 px-6 max-w-6xl mx-auto">
        <Link
          to="/profile"
          className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50 hover:text-charcoal"
        >
          ← 回到档案
        </Link>
        <div className="mt-6 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7 relative">
            <div className="bg-white border border-charcoal/10 p-3 pb-10 scrap-shadow -rotate-1">
              <img src={j.cover} alt={j.title} className="block w-full aspect-[4/3] object-cover" />
              <span className="absolute bottom-3 left-6 font-hand text-2xl">{j.city}</span>
            </div>
            <span className="tape absolute -top-3 left-12 w-24 h-6 rotate-[-4deg]" />
          </div>
          <div className="md:col-span-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">§— 日志</p>
            <h1 className="font-serif text-5xl md:text-6xl italic leading-[1.05] mt-3">{j.title}</h1>
            <dl className="mt-6 space-y-2 text-sm">
              <Row k="日期" v={j.date} />
              <Row k="地点" v={j.city} />
              <Row k="路线" v={j.route} />
            </dl>
          </div>
        </div>
      </header>

      {/* Collage canvas */}
      <section className="mt-16 px-6 max-w-6xl mx-auto">
        <SectionLabel>照片 · 碎片</SectionLabel>
        <div className="relative mt-6 bg-ivory border border-charcoal/10 rounded-[28px] p-8 md:p-12 paper-texture overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
          <div className="relative grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {j.photos.map((p, i) => (
              <figure
                key={i}
                className={`relative bg-white border border-charcoal/10 p-3 pb-8 scrap-shadow ${rots[i % rots.length]} hover:rotate-0 transition-transform`}
              >
                {p.tape && (
                  <span className={`${p.tape} absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rotate-[-3deg]`} />
                )}
                <img src={p.src} alt={p.caption ?? ""} className="block w-full aspect-square object-cover" />
                {p.caption && (
                  <figcaption className="absolute bottom-2 left-3 right-3 font-hand text-base">
                    {p.caption}
                  </figcaption>
                )}
              </figure>
            ))}

            {j.notes.map((n, i) => (
              <div
                key={`n-${i}`}
                className={`${n.color ?? "bg-butter/40"} border border-charcoal/10 p-5 scrap-shadow ${rots[(i + 2) % rots.length]} hover:rotate-0 transition-transform`}
              >
                <p className="font-hand text-2xl leading-snug">{n.text}</p>
              </div>
            ))}
          </div>

          {/* Stickers floating */}
          <div className="relative mt-10 flex flex-wrap items-center gap-5">
            {j.stickers.map((s, i) => (
              <span
                key={i}
                style={{ animationDelay: `${i * 0.4}s` }}
                className={`${s.color} size-14 rounded-full grid place-items-center border border-charcoal/10 scrap-shadow float-y`}
              >
                <span className="text-cream text-xl">{s.emoji}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Audio */}
      {j.audio && j.audio.length > 0 && (
        <section className="mt-16 px-6 max-w-6xl mx-auto">
          <SectionLabel>声音记忆</SectionLabel>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {j.audio.map((a, i) => (
              <div
                key={i}
                className="bg-charcoal text-cream rounded-full px-5 py-3 flex items-center gap-4 scrap-shadow"
              >
                <span className="size-8 rounded-full bg-butter text-charcoal grid place-items-center text-xs">▶</span>
                <div className="flex-1">
                  <p className="font-serif italic text-lg leading-tight">{a.title}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60">{a.duration}</p>
                </div>
                <div className="flex items-end gap-0.5 h-6">
                  {[0.6, 0.9, 0.4, 0.8, 0.5, 0.7, 0.3].map((h, k) => (
                    <span
                      key={k}
                      style={{ animationDelay: `${k * 0.1}s`, height: `${h * 100}%` }}
                      className="w-0.5 bg-butter bar"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      <section className="mt-20 px-6 max-w-6xl mx-auto pb-24">
        <SectionLabel>同一本剪贴簿里</SectionLabel>
        <div className="mt-6 grid md:grid-cols-3 gap-8">
          {related.map((r, i) => (
            <Link
              key={r.slug}
              to="/journal/$slug"
              params={{ slug: r.slug }}
              className={`block bg-white border border-charcoal/10 p-3 pb-6 scrap-shadow ${i % 2 ? "rotate-1" : "-rotate-1"} hover:rotate-0 hover:-translate-y-1 transition cursor-pointer`}
            >
              <img src={r.cover} alt="" className="block w-full aspect-[4/3] object-cover" />
              <h3 className="font-serif italic text-xl mt-3 leading-tight">{r.title}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 mt-1">{r.city} · {r.date}</p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4 border-b border-charcoal/10 pb-2">
      <dt className="w-16 text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50 pt-1">{k}</dt>
      <dd className="flex-1 font-serif italic text-lg">{v}</dd>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
      §— {children}
    </p>
  );
}
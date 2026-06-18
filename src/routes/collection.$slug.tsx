import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getCollectionBySlug,
  getJournalsForCollection,
  type Collection,
  type Journal,
} from "@/data/journals";

export const Route = createFileRoute("/collection/$slug")({
  loader: ({ params }) => {
    const collection = getCollectionBySlug(params.slug);
    if (!collection) throw notFound();
    return { collection, items: getJournalsForCollection(collection) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.collection.title} — Fragmented` },
          { name: "description", content: loaderData.collection.description },
          { property: "og:title", content: `${loaderData.collection.title} — Fragmented` },
          { property: "og:description", content: loaderData.collection.description },
          { property: "og:image", content: loaderData.collection.cover },
        ]
      : [{ title: "收藏集 — Fragmented" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-cream grid place-items-center px-6">
      <div className="text-center">
        <p className="font-serif italic text-3xl">这个盒子还是空的。</p>
        <Link to="/collections" className="inline-block mt-6 px-5 py-2 rounded-full bg-charcoal text-cream text-xs uppercase tracking-[0.2em]">
          回到合辑
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen bg-cream grid place-items-center">
      <button onClick={reset} className="px-5 py-2 rounded-full bg-charcoal text-cream text-xs uppercase tracking-[0.2em]">重试</button>
    </div>
  ),
  component: CollectionDetail,
});

type ExtraPhoto = { id: string; src: string; caption: string };

function CollectionDetail() {
  const { collection: c, items } = Route.useLoaderData() as {
    collection: Collection;
    items: Journal[];
  };
  const fileRef = useRef<HTMLInputElement>(null);
  const [extras, setExtras] = useState<ExtraPhoto[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const tapes = ["tape", "tape-pink", "tape-blue"];
  const rots = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-3", "rotate-3"];

  const onUpload = (files: FileList | null) => {
    if (!files) return;
    const next: ExtraPhoto[] = [];
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith("image/")) return;
      next.push({ id: crypto.randomUUID(), src: URL.createObjectURL(f), caption: "新的记忆" });
    });
    setExtras((prev) => [...prev, ...next]);
  };

  return (
    <div className="min-h-screen bg-cream animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SiteNav />

      <header className="pt-40 pb-10 px-6 max-w-6xl mx-auto">
        <Link to="/collections" className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50 hover:text-charcoal">
          ← 回到合辑盒子
        </Link>
        <div className="mt-3 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span className={`inline-block ${c.accent} px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] rotate-[-2deg] border border-charcoal/10`}>
              §— 打开盒子
            </span>
            <h1 className="mt-4 font-serif text-6xl md:text-8xl leading-[0.95]">
              {c.title}<span className="text-pinkv">。</span>
            </h1>
            <p className="mt-3 text-charcoal/65 max-w-lg">{c.description}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50">城市</p>
            <p className="font-serif italic text-2xl">{c.cities.join(" · ")}</p>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-serif italic text-3xl">那些旅程的记忆</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-charcoal/50">
            {items.length.toString().padStart(2, "0")} 篇
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-charcoal/50 italic font-serif">这个盒子里还没有日志。</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {items.map((j, i) => (
              <Link
                key={j.slug}
                to="/journal/$slug"
                params={{ slug: j.slug }}
                className={`group relative bg-white border border-charcoal/10 rounded-[20px] p-4 scrap-shadow ${rots[i % rots.length]} hover:rotate-0 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`absolute -top-3 left-6 h-5 w-20 ${tapes[i % tapes.length]} rotate-[-4deg]`} />
                <img src={j.cover} alt={j.title} className="aspect-[4/5] w-full object-cover rounded-md border border-charcoal/10" />
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50">{j.date}</p>
                  <h3 className="font-serif text-2xl italic mt-1">{j.title}</h3>
                  <p className="text-xs text-charcoal/60 mt-1">{j.route}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif italic text-3xl">添加进盒子</h2>
            <p className="text-charcoal/60 text-sm mt-1">把新的照片放进这个收藏。</p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal text-cream text-xs font-bold uppercase tracking-[0.2em] hover:bg-pinkv transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> 上传照片
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onUpload(e.target.files)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {extras.map((p, i) => (
            <div
              key={p.id}
              className={`relative bg-white border border-charcoal/10 rounded-[16px] p-3 scrap-shadow ${rots[i % rots.length]}`}
            >
              <div className={`absolute -top-3 left-5 h-5 w-16 ${tapes[i % tapes.length]} rotate-[-4deg]`} />
              <button
                onClick={() => setExtras((prev) => prev.filter((x) => x.id !== p.id))}
                className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-charcoal text-cream grid place-items-center hover:bg-pinkv"
                aria-label="删除"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <img src={p.src} alt={p.caption} className="aspect-square w-full object-cover rounded-md border border-charcoal/10" />
              {editingId === p.id ? (
                <input
                  autoFocus
                  value={p.caption}
                  onChange={(e) =>
                    setExtras((prev) => prev.map((x) => (x.id === p.id ? { ...x, caption: e.target.value } : x)))
                  }
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                  className="mt-2 w-full text-sm font-serif italic bg-transparent border-b border-charcoal/30 outline-none"
                />
              ) : (
                <button
                  onClick={() => setEditingId(p.id)}
                  className="mt-2 w-full text-left text-sm font-serif italic text-charcoal/80 hover:text-charcoal"
                >
                  {p.caption}
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-[16px] border-2 border-dashed border-charcoal/30 grid place-items-center text-charcoal/50 hover:text-charcoal hover:border-charcoal transition-colors bg-ivory/50"
          >
            <div className="text-center">
              <Plus className="w-6 h-6 mx-auto" />
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em]">添加照片</p>
            </div>
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
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
      { title: "我的 — Fragmented" },
      { name: "description", content: "你的旅行档案：日志、碎片，以及一颗私密的记忆星球。" },
      { property: "og:title", content: "我的 — Fragmented" },
      { property: "og:description", content: "你在 Fragmented 上的私人旅行剪贴簿。" },
    ],
  }),
  component: Profile,
});

const journals = [
  { img: train, title: "慢车，向西", date: "2024 年 6 月" },
  { img: italy, title: "像水果般颜色的房子", date: "2024 年 7 月" },
  { img: kyoto, title: "穿过雪松的雨", date: "2024 年 10 月" },
  { img: morocco, title: "灯笼与藏红花", date: "2025 年 2 月" },
];

function Profile() {
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
        {["日志", "草稿", "收藏", "星球"].map((t, i) => (
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
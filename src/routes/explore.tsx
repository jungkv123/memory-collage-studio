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
      { title: "探索 — Fragmented" },
      { name: "description", content: "在社区创作的旅行拼贴、声音片段与手绘路线之间漫游。" },
      { property: "og:title", content: "探索 — Fragmented" },
      { property: "og:description", content: "来自世界各地的旅行故事，像一本剪贴簿一样流动。" },
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
  { src: italy, span: "row-span-2", rotate: "-rotate-2", title: "像水果般颜色的房子", place: "五渔村", tape: "tape" },
  { src: kyoto, span: "", rotate: "rotate-1", title: "穿过雪松的雨", place: "京都", tape: "tape-pink" },
  { src: envelope, span: "", rotate: "-rotate-1", title: "那些没寄出去的信", place: "布宜诺斯艾利斯", tape: "tape-blue" },
  { src: morocco, span: "row-span-2", rotate: "rotate-2", title: "灯笼与藏红花", place: "马拉喀什", tape: "tape" },
  { src: train, span: "", rotate: "-rotate-1", title: "靠窗的座位，向西", place: "瑞士阿尔卑斯", tape: "tape-pink" },
  { src: stamps, span: "", rotate: "rotate-2", title: "来自陌生人的邮票", place: "里斯本", tape: "tape-blue" },
  { src: ticket, span: "", rotate: "-rotate-2", title: "口袋里的票根", place: "巴黎", tape: "tape" },
  { src: map, span: "row-span-2", rotate: "rotate-1", title: "一张撕开的涩谷地图", place: "东京", tape: "tape-pink" },
];

const filters = ["全部", "海边", "城市", "山野", "市集", "安静之地", "长途列车"];

function Explore() {
  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      <header className="pt-40 pb-12 px-6 text-center max-w-4xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
          §— 阅读室
        </span>
        <h1 className="font-serif text-6xl md:text-8xl mt-4 leading-[0.95]">
          漫游于<br />
          <span className="italic text-dusty">他人</span>的记忆。
        </h1>
        <p className="font-hand text-2xl text-charcoal/60 mt-6 -rotate-1">
          一种更慢的信息流
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
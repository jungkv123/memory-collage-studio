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
import blueBow from "@/assets/stickers/fragmented-c-10.png.asset.json";
import travelLabel from "@/assets/stickers/fragmented-b-07.png.asset.json";

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

/* Phone magazine flow: every fragment gets its own size, tilt and offset. */
const mobileShapes = [
  { span: "col-span-2", rot: "-rotate-1", off: "", aspect: "aspect-[4/3]" },
  { span: "col-span-1", rot: "rotate-2", off: "translate-y-3", aspect: "aspect-[3/4]" },
  { span: "col-span-1", rot: "-rotate-2", off: "translate-y-8", aspect: "aspect-[3/4]" },
  { span: "col-span-2", rot: "rotate-1", off: "", aspect: "aspect-[16/10]" },
  { span: "col-span-1", rot: "-rotate-1", off: "", aspect: "aspect-square" },
  { span: "col-span-1", rot: "rotate-2", off: "-translate-y-4", aspect: "aspect-square" },
  { span: "col-span-2", rot: "-rotate-1", off: "", aspect: "aspect-[5/4]" },
  { span: "col-span-1", rot: "rotate-1", off: "translate-y-2", aspect: "aspect-[3/4]" },
];

function Explore() {
  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      <header className="pt-28 md:pt-40 pb-12 px-5 md:px-6 text-center max-w-4xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
          §— 阅读室
        </span>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl mt-4 leading-[0.95]">
          漫游于<br />
          <span className="italic text-dusty">他人</span>的记忆。
        </h1>
        <p className="font-hand text-2xl text-charcoal/60 mt-6 -rotate-1">
          一种更慢的信息流
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-5 md:px-6 flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar md:overflow-visible mb-8 md:mb-12">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em] border transition ${
              i === 0
                ? "bg-charcoal text-cream border-charcoal"
                : "bg-ivory border-charcoal/15 hover:bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Phone: irregular magazine flow with visible captions */}
      <section className="md:hidden relative px-5 pb-16">
        <img
          src={blueBow.url}
          alt=""
          className="pointer-events-none absolute -top-8 right-4 z-20 w-14 -rotate-12 opacity-90"
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-7">
          {items.map((it, i) => {
            const s = mobileShapes[i % mobileShapes.length];
            return (
              <article key={i} className={`relative ${s.span} ${s.rot} ${s.off}`}>
                <span
                  className={`${it.tape} absolute -top-2 ${i % 2 ? "right-5 rotate-4" : "left-4 -rotate-4"} z-10 h-5 w-14`}
                  aria-hidden
                />
                <div className={`relative ${s.aspect} bg-white p-2 pb-7 border border-charcoal/10 scrap-shadow`}>
                  <img src={it.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  <p className="absolute bottom-1 left-3 right-3 truncate font-hand text-base leading-none text-charcoal/80">
                    {it.place}
                  </p>
                </div>
                <p className="mt-1.5 font-serif italic text-base leading-tight">{it.title}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-10 flex items-center gap-3 border border-charcoal/15 bg-ivory px-4 py-3 scrap-shadow -rotate-1">
          <img src={travelLabel.url} alt="" className="w-12 shrink-0 -rotate-6" />
          <p className="min-w-0 font-hand text-xl leading-tight text-charcoal/75">
            往下翻，还有更多别人留下的碎片。
          </p>
        </div>
      </section>

      <section className="hidden md:grid max-w-6xl mx-auto px-5 md:px-6 grid-cols-2 md:grid-cols-4 auto-rows-[150px] md:auto-rows-[180px] gap-4 md:gap-6 pb-20">
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
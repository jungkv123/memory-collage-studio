import { Link } from "@tanstack/react-router";
import { journals } from "@/data/journals";

const published = journals.filter((j) => j.status === "published");
const orbitMeta = [
  { angle: 0, dist: 230, r: -8 },
  { angle: 72, dist: 250, r: 6 },
  { angle: 144, dist: 235, r: -4 },
  { angle: 216, dist: 245, r: 10 },
  { angle: 288, dist: 230, r: -12 },
];
const orbits = published.map((j, i) => ({
  slug: j.slug,
  src: j.cover,
  label: j.city,
  title: j.title,
  ...orbitMeta[i % orbitMeta.length],
}));

export function MemoryGlobe() {
  return (
    <section className="relative mt-44 py-24 bg-ivory border-y border-charcoal/10 overflow-hidden">
      <div className="paper-texture absolute inset-0 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
            §02 — 记忆星球
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-[0.95]">
            你的旅程，<br />
            环绕在同一处
          </h2>
          <p className="text-charcoal/65 leading-relaxed max-w-md">
            每一本日志都化作宝丽来、贴纸或明信片，围绕着缓缓旋转的记忆球漂浮。悬停一窥，点击坠入故事。
          </p>
          <ul className="space-y-3 pt-2 text-sm">
            {[
              "穿梭于 2,481 段已收集的碎片之间",
              "按心情、季节或天气聚合",
              "与同行的人共享一个私密星球",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-charcoal" />
                <span className="text-charcoal/80">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-[520px] grid place-items-center">
          <div className="absolute inset-0 m-auto size-[420px] rounded-full border border-dashed border-charcoal/20 spin-slow" />
          <div className="absolute inset-0 m-auto size-[300px] rounded-full border border-dashed border-charcoal/15" />
          <div className="absolute inset-0 m-auto size-[480px] rounded-full bg-[radial-gradient(circle,theme(colors.transparent)_55%,rgba(141,169,196,0.18)_75%,transparent_85%)] blur-xl" />

          {/* Core */}
          <div className="relative size-44 rounded-full bg-cream border border-charcoal/10 scrap-shadow flex flex-col items-center justify-center text-center">
            <span className="font-serif italic text-4xl">2,481</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/50 mt-1">
              碎片
            </span>
            <span className="font-hand text-dusty text-xl mt-1">
              — 仍在增加
            </span>
          </div>

          {orbits.map((o, i) => {
            const rad = (o.angle * Math.PI) / 180;
            const x = Math.cos(rad) * o.dist;
            const y = Math.sin(rad) * o.dist;
            return (
              <Link
                key={i}
                to="/journal/$slug"
                params={{ slug: o.slug }}
                aria-label={`打开《${o.title}》— ${o.label}`}
                className="absolute float-y group cursor-pointer"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  ["--r" as string]: `${o.r}deg`,
                  animationDelay: `${i * 0.6}s`,
                }}
              >
                <div
                  className="w-28 bg-white p-1.5 pb-5 border border-charcoal/10 scrap-shadow flicker group-hover:scale-110 group-hover:animation-none transition-transform"
                  style={{ ["--flicker-delay" as string]: `${i * 0.7}s` }}
                >
                  <img src={o.src} alt={o.title} className="block w-full aspect-square object-cover" />
                  <span className="block text-center font-hand text-sm mt-0.5">{o.label}</span>
                </div>
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-7 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  打开《{o.title}》→
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import polaroidKyoto from "@/assets/polaroid-kyoto.jpg";
import polaroidItaly from "@/assets/polaroid-italy.jpg";
import polaroidMorocco from "@/assets/polaroid-morocco.jpg";
import stamps from "@/assets/stamps.jpg";
import ticket from "@/assets/ticket-paris.jpg";

const orbits = [
  { src: polaroidKyoto, label: "Kyoto", angle: 0, dist: 230, r: -8 },
  { src: polaroidItaly, label: "Cinque Terre", angle: 72, dist: 250, r: 6 },
  { src: polaroidMorocco, label: "Marrakesh", angle: 144, dist: 235, r: -4 },
  { src: stamps, label: "Lisboa", angle: 216, dist: 245, r: 10 },
  { src: ticket, label: "Paris", angle: 288, dist: 230, r: -12 },
];

export function MemoryGlobe() {
  return (
    <section className="relative mt-44 py-24 bg-ivory border-y border-charcoal/10 overflow-hidden">
      <div className="paper-texture absolute inset-0 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
            §02 — The Memory Globe
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-[0.95]">
            Your travels,<br />
            <span className="italic text-pinkv">orbiting</span> in one place.
          </h2>
          <p className="text-charcoal/65 leading-relaxed max-w-md">
            Every journal floats as a polaroid, sticker, or postcard around a
            slow-spinning orb. Hover to peek inside. Click to fall into the
            story.
          </p>
          <ul className="space-y-3 pt-2 text-sm">
            {[
              "Drift through 2,481 collected fragments",
              "Cluster by mood, season, or weather",
              "Share a private orb with a travel partner",
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
              Fragments
            </span>
            <span className="font-hand text-dusty text-xl mt-1">
              — and counting
            </span>
          </div>

          {orbits.map((o, i) => {
            const rad = (o.angle * Math.PI) / 180;
            const x = Math.cos(rad) * o.dist;
            const y = Math.sin(rad) * o.dist;
            return (
              <div
                key={i}
                className="absolute float-y"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  ["--r" as string]: `${o.r}deg`,
                  animationDelay: `${i * 0.6}s`,
                }}
              >
                <div className="w-28 bg-white p-1.5 pb-5 border border-charcoal/10 scrap-shadow hover:scale-110 transition-transform">
                  <img src={o.src} alt="" className="block w-full aspect-square object-cover" />
                  <span className="block text-center font-hand text-sm mt-0.5">{o.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import map from "@/assets/map-watercolor.jpg";

export function Features() {
  return (
    <section className="mt-32 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
      <div className="space-y-6 order-2 md:order-1">
        <span className="inline-block bg-dusty/15 text-dusty px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.25em]">
          §03 — Map Your Heart
        </span>
        <h2 className="font-serif text-5xl md:text-6xl leading-tight">
          Connected<br />
          <span className="italic">memories.</span>
        </h2>
        <p className="text-charcoal/65 leading-relaxed max-w-md">
          Fragmented doesn't just show where you went; it shows how you
          felt. Trace your route with hand-drawn paths that connect sensory
          snapshots into a single emotional geography.
        </p>
        <ul className="space-y-4 pt-2">
          {[
            "Dotted paths connect photo clusters",
            "Hand-drawn pins for every detour",
            "Elevation, weather & soundscapes",
          ].map((line) => (
            <li key={line} className="flex items-center gap-4 font-medium">
              <span className="size-6 border border-charcoal rounded-full flex items-center justify-center">
                <span className="size-2 bg-charcoal rounded-full" />
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative aspect-square bg-ivory p-6 border border-charcoal/10 rounded-[28px] overflow-hidden scrap-shadow order-1 md:order-2">
        <div className="relative w-full h-full rounded-[20px] overflow-hidden">
          <img src={map} alt="Hand drawn watercolor map" className="w-full h-full object-cover" />
        </div>
        {/* Pins */}
        <Pin top="22%" left="36%" color="bg-charcoal" label="Paris" />
        <Pin top="44%" left="58%" color="bg-pinkv" label="Roma" />
        <Pin top="64%" left="30%" color="bg-dusty" label="Lisboa" />
        {/* Dashed connector */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M36,22 Q50,30 58,44 Q44,55 30,64"
            fill="none"
            stroke="rgba(34,34,34,0.45)"
            strokeWidth="0.4"
            strokeDasharray="1.2 1.2"
          />
        </svg>
      </div>
    </section>
  );
}

function Pin({ top, left, color, label }: { top: string; left: string; color: string; label: string }) {
  return (
    <div className="absolute" style={{ top, left }}>
      <div className={`size-4 rounded-full ${color} ring-4 ring-white/70 scrap-shadow`} />
      <span className="absolute left-5 top-0 font-hand text-base text-charcoal whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
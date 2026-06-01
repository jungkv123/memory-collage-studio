const labels = ["Ocean waves, Lisboa", "Yamanote line, Tokyo", "Souk al-Attarine, Fez", "Café in Trastevere"];

export function AudioMemory() {
  return (
    <section className="mt-32 bg-charcoal text-cream py-24 relative overflow-hidden">
      <div className="paper-texture absolute inset-0 opacity-10 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cream/50">
            §04 — Audio Memory
          </span>
          <h2 className="font-serif text-5xl md:text-6xl italic mt-4 leading-tight">
            Ten seconds<br />of somewhere.
          </h2>
          <p className="text-cream/65 leading-relaxed mt-6 max-w-md">
            Pin an ambient clip to any fragment — ocean static, a train
            station, a market at dusk. Press play; the room changes.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-cream/10 backdrop-blur-sm border border-cream/15 rounded-full pl-2 pr-5 py-2">
            <span className="size-9 rounded-full bg-butter text-charcoal grid place-items-center text-base">
              ▶
            </span>
            <span className="font-hand text-2xl text-cream">listen to a memory</span>
          </div>
        </div>

        <div className="space-y-4">
          {labels.map((label, i) => (
            <Clip key={label} label={label} accent={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Clip({ label, accent }: { label: string; accent: number }) {
  const colors = ["bg-pinkv", "bg-butter", "bg-dusty", "bg-cream"];
  const bars = Array.from({ length: 36 }, (_, i) =>
    0.25 + Math.abs(Math.sin(i * 0.7 + accent)) * 0.75
  );
  return (
    <div className="bg-cream/5 border border-cream/10 rounded-2xl p-5 flex items-center gap-5 hover:bg-cream/10 transition">
      <button className={`size-11 rounded-full ${colors[accent]} text-charcoal grid place-items-center scrap-shadow shrink-0`}>
        ▶
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{label}</p>
        <div className="mt-2 flex items-end gap-[2px] h-7">
          {bars.map((h, i) => (
            <span
              key={i}
              className="bar w-[3px] bg-cream/80 rounded-full"
              style={{ height: `${h * 100}%`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
      <span className="font-hand text-cream/60 text-lg">0:10</span>
    </div>
  );
}
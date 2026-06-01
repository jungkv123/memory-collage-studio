export function Manifesto() {
  return (
    <section className="mt-32 max-w-5xl mx-auto px-6 text-center">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
        §06 — Manifesto
      </span>
      <p className="mt-8 font-serif text-3xl md:text-5xl italic leading-tight text-balance text-charcoal/90">
        “A trip is never the postcard. It's the smell of the bakery
        downstairs, the receipt you couldn't read, the song on the radio in
        the cab. We built <span className="not-italic font-semibold">Fragmented</span> to keep all of it.”
      </p>
      <p className="font-hand text-2xl text-dusty mt-6">— the studio, 2026</p>
    </section>
  );
}

export function Marquee() {
  const items = [
    "AI Layout Generator",
    "Hand-drawn Routes",
    "Audio Memory",
    "Infinite Canvas",
    "Collage Stickers",
    "Private Orbs",
  ];
  return (
    <div className="mt-20 bg-pinkv/30 border-y border-charcoal/10 py-6 overflow-hidden">
      <div className="flex gap-16 whitespace-nowrap marquee w-max">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-6 font-serif italic text-3xl text-charcoal">
            {t}
            <span className="size-2 rounded-full bg-charcoal/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
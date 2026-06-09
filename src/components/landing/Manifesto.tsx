export function Manifesto() {
  return (
    <section className="mt-32 max-w-5xl mx-auto px-6 text-center">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
        §06 — 宣言
      </span>
      <p className="mt-8 font-serif text-3xl md:text-5xl italic leading-tight text-balance text-charcoal/90">
        「一次旅行从来不是那张明信片。它是楼下面包房的香气、那张你读不懂的收据、出租车里收音机播的那首歌。我们做<span className="not-italic font-semibold">Fragmented</span>，是为了把这一切都留下来。」
      </p>
      <p className="font-hand text-2xl text-dusty mt-6">— 工作室，2026</p>
    </section>
  );
}

export function Marquee() {
  const items = [
    "AI 排版生成",
    "手绘路线",
    "声音记忆",
    "无限画布",
    "拼贴贴纸",
    "私密星球",
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
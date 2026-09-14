import { Link } from "@tanstack/react-router";
import polaroidTrain from "@/assets/polaroid-train.jpg";
import ticket from "@/assets/ticket-paris.jpg";

export function CanvasPreview() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 mt-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
            §01 — 无限画布
          </span>
          <h2 className="font-serif text-4xl md:text-5xl italic mt-2 text-balance">
            拖动 撕开&nbsp; 排列 重复
          </h2>
        </div>
        <p className="font-hand text-xl text-dusty hidden md:block max-w-[22ch]">
          像 Figma 遇上了外婆的剪贴簿。
        </p>
      </div>

      <div className="relative aspect-[16/10] bg-ivory rounded-[28px] border border-charcoal/10 shadow-inner overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Polaroid */}
        <div className="absolute top-[10%] left-[7%] rotate-[-5deg] group">
          <span className="tape absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 rotate-[-3deg] z-10" />
          <div className="w-56 md:w-64 bg-white p-3 pb-10 scrap-shadow border border-charcoal/5 transition-transform group-hover:scale-[1.03] group-hover:rotate-[-2deg]">
            <img src={polaroidTrain} alt="" className="block w-full aspect-square object-cover" />
            <span className="absolute bottom-3 left-4 font-hand text-lg">伯尔尼纳快线，2024</span>
          </div>
        </div>

        {/* Ticket + sticker */}
        <div className="absolute top-[36%] right-[12%] rotate-[4deg] group">
          <div className="absolute -top-5 -right-3 z-20 w-16 h-16 rotate-[15deg]">
            <div className="w-full h-full bg-pinkv rounded-full flex items-center justify-center border border-charcoal/10 scrap-shadow">
              <span className="text-[9px] font-bold uppercase tracking-tighter text-charcoal text-center leading-tight">
                巴黎<br />’23
              </span>
            </div>
          </div>
          <div className="w-56 border border-charcoal/10 scrap-shadow bg-cream overflow-hidden grayscale group-hover:grayscale-0 transition">
            <img src={ticket} alt="" className="block w-full h-auto" />
          </div>
        </div>

        {/* Handwritten note + audio */}
        <div className="absolute bottom-[12%] left-[26%] max-w-xs rotate-[-2deg]">
          <p className="font-hand text-[1.6rem] leading-tight text-charcoal/85">
            「佛罗伦萨的咖啡，喝起来像旧故事和清晨的雨。」
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Waveform />
            <span className="text-[10px] font-bold uppercase tracking-widest text-dusty">
              音频 · 0:12
            </span>
          </div>
        </div>

        {/* AI assistant card */}
        <div className="absolute bottom-6 right-6 w-56">
          <div className="bg-white border border-charcoal/10 rounded-2xl p-4 scrap-shadow space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50">
                AI 排版
              </span>
              <span className="size-1.5 rounded-full bg-pinkv animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="aspect-square bg-dusty/25 rounded-md" />
              <div className="aspect-square bg-pinkv/30 rounded-md" />
              <div className="aspect-square bg-butter/40 rounded-md" />
              <div className="aspect-square bg-charcoal/80 rounded-md" />
              <div className="aspect-square bg-ivory border border-charcoal/10 rounded-md" />
              <div className="aspect-square bg-dusty/15 rounded-md" />
            </div>
            <Link
              to="/create"
              className="w-full text-left text-xs font-bold text-charcoal flex items-center justify-between"
            >
              生成版面 <span>→</span>
            </Link>
          </div>
        </div>

        {/* Toolbar bottom-left */}
        <div className="absolute bottom-6 left-6 bg-white/85 backdrop-blur-md border border-charcoal/10 rounded-full px-3 py-2 flex items-center gap-1 scrap-shadow text-[11px]">
          {["照片", "笔记", "地图", "音频", "贴纸"].map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 rounded-full hover:bg-cream font-semibold text-charcoal/70 cursor-pointer"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Waveform() {
  const bars = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.4, 0.9, 0.6, 0.7];
  return (
    <div className="flex items-center gap-[2px] h-5">
      {bars.map((h, i) => (
        <span
          key={i}
          className="bar w-[3px] bg-dusty rounded-full"
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}
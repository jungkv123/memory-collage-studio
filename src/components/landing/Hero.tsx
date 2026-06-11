import { Link } from "@tanstack/react-router";
import polaroidItaly from "@/assets/polaroid-italy.jpg";
import envelope from "@/assets/envelope-airmail.jpg";
import tokyoMap from "@/assets/map-tokyo-torn.jpg";
import ticket from "@/assets/ticket-paris.jpg";
import stamps from "@/assets/stamps.jpg";

export function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden">
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      {/* Floating fragments */}
      <div
        className="absolute top-28 left-[-2%] md:left-[4%] w-56 float-y hidden sm:block"
        style={{ ["--r" as string]: "-12deg" }}
      >
        <div className="relative scrap-shadow bg-ivory p-2 border border-charcoal/10">
          <img src={envelope} alt="" className="block w-full h-auto" />
          <span className="tape-pink absolute -top-3 left-10 w-16 h-5 rotate-[-6deg]" />
        </div>
      </div>

      <div
        className="absolute top-44 right-[-4%] md:right-[2%] w-60 drift hidden sm:block"
        style={{ ["--r" as string]: "9deg" }}
      >
        <div className="relative scrap-shadow bg-white p-3 pb-10 border border-charcoal/10">
          <img src={polaroidItaly} alt="" className="block w-full h-auto aspect-square object-cover" />
          <span className="absolute bottom-2 left-3 right-3 font-hand text-lg text-charcoal/80">
            五渔村，七月
          </span>
          <span className="tape absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6" />
        </div>
      </div>

      <div
        className="absolute bottom-10 left-[8%] w-40 hidden lg:block float-y"
        style={{ ["--r" as string]: "6deg", animationDelay: "1.5s" }}
      >
        <img src={stamps} alt="" className="block w-full scrap-shadow border border-charcoal/10" />
      </div>

      <div
        className="absolute bottom-24 right-[10%] w-44 hidden lg:block drift"
        style={{ ["--r" as string]: "-4deg", animationDelay: "0.8s" }}
      >
        <div className="relative">
          <img src={tokyoMap} alt="" className="block w-full scrap-shadow" />
          <span className="tape-blue absolute -top-2 right-6 w-14 h-5 rotate-[8deg]" />
        </div>
      </div>

      <div
        className="absolute top-[58%] left-[18%] w-32 hidden xl:block float-y"
        style={{ ["--r" as string]: "-8deg", animationDelay: "2.3s" }}
      >
        <img src={ticket} alt="" className="block w-full scrap-shadow border border-charcoal/10" />
      </div>

      {/* Center */}
      <div className="relative max-w-5xl mx-auto text-center z-10">
        <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
          <span className="h-px w-8 bg-charcoal/30" />
          第 04 卷 · 一份视觉化的旅行档案
          <span className="h-px w-8 bg-charcoal/30" />
        </span>

        <h1 className="mt-8 font-serif text-[3.4rem] sm:text-7xl leading-[0.92] tracking-tight text-balance my-[27px] md:text-8xl whitespace-pre-line">
          旅行不是一条<span className="italic text-dusty">时间线</span>。{"\n"}
          它是一幅{" "}
          <span className="relative inline-block">
            拼贴画
            <span className="absolute -bottom-2 left-0 w-full h-2 bg-butter/70 -rotate-1 -z-10" />
          </span>
          {"\n\n"}
        </h1>

        <p className="mt-8 mx-auto max-w-xl text-lg md:text-xl text-charcoal/65 font-light text-pretty">
          把零散的记忆变成视觉故事——车票、宝丽来、地图与低声的笔记，自由地排列在一张无限画布上。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/create"
            className="px-9 py-4 bg-charcoal text-cream rounded-full font-serif text-xl hover:bg-charcoal/85 hover:scale-[1.02] transition flex items-center gap-3"
          >
            创作你的旅程
            <span aria-hidden>→</span>
          </Link>
          <Link
            to="/explore"
            className="px-9 py-4 border border-charcoal/15 rounded-full font-serif text-xl hover:bg-white/60 transition"
          >
            探索故事
          </Link>
        </div>

        <p className="font-hand text-2xl text-charcoal/55 mt-10 -rotate-1">
          附注 — 每一片碎片都是一种感觉。
        </p>
      </div>
    </section>
  );
}
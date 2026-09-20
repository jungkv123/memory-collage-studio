import { useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";
import polaroidTrain from "@/assets/polaroid-train.jpg";
import polaroidKyoto from "@/assets/polaroid-kyoto.jpg";
import ticket from "@/assets/ticket-paris.jpg";
import trainAudio from "@/assets/train.mp3.asset.json";
import cameraSticker from "@/assets/stickers/fragmented-b-01.png.asset.json";
import starSticker from "@/assets/stickers/fragmented-b-02.png.asset.json";
import letterSticker from "@/assets/stickers/fragmented-b-06.png.asset.json";
import bowSticker from "@/assets/stickers/fragmented-c-10.png.asset.json";
import ribbonSticker from "@/assets/stickers/fragmented-c-12.png.asset.json";
import { Button } from "@/components/ui/button";
import { toggleAudio, useAudioPlayer } from "@/lib/audio-player";

const AUDIO_ID = "home-canvas-train";
const bars = [0.38, 0.7, 1, 0.55, 0.88, 0.45, 0.76, 0.36, 0.92, 0.58, 0.72, 0.46, 0.82];

export function CanvasPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const audio = useAudioPlayer();
  const isPlaying = audio.id === AUDIO_ID && audio.playing;
  const progress = audio.id === AUDIO_ID ? audio.progress : 0;

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, scrollModule]) => {
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollModule.ScrollTrigger;
        const section = sectionRef.current;
        if (!section || cancelled) return;

        gsap.registerPlugin(ScrollTrigger);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        const context = gsap.context(() => {
          gsap.fromTo(
            "[data-collage-piece]",
            { y: -70, opacity: 0, rotation: (index) => (index % 2 ? 8 : -8), scale: 0.92 },
            {
              y: 0,
              opacity: 1,
              rotation: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.09,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 78%", once: true },
            },
          );

          gsap.utils.toArray<HTMLElement>("[data-float-sticker]").forEach((sticker, index) => {
            gsap.to(sticker, {
              y: index % 2 ? 6 : -7,
              rotation: index % 2 ? 1.5 : -1.5,
              duration: 3.2 + index * 0.45,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }, section);

        cleanup = () => context.revert();
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative mx-auto mt-10 max-w-6xl px-4 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase text-charcoal/50">§01 — 无限画布</span>
          <h2 className="mt-2 font-serif text-4xl italic text-balance md:text-5xl">拖动 撕开&nbsp; 排列 重复</h2>
        </div>
        <p className="hidden max-w-[22ch] font-hand text-xl text-dusty md:block">像 Figma 遇上了外婆的剪贴簿。</p>
      </div>

      <div className="relative min-h-[620px] overflow-hidden rounded-[28px] border border-charcoal/10 bg-ivory shadow-inner sm:min-h-[670px] lg:aspect-[16/10] lg:min-h-0">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <div className="paper-texture pointer-events-none absolute inset-0" />

        <div data-collage-piece className="group absolute left-[5%] top-[7%] z-20 -rotate-6 transition-transform duration-300 hover:z-40 hover:-translate-y-2 hover:rotate-[-2deg]">
          <span className="tape absolute -top-3 left-1/2 z-10 h-6 w-14 -translate-x-1/2 -rotate-3" />
          <div className="w-40 border border-charcoal/5 bg-card p-2 pb-8 scrap-shadow sm:w-52 md:w-60">
            <img src={polaroidTrain} alt="穿行雪山的伯尔尼纳列车" className="block aspect-square w-full object-cover" />
            <span className="absolute bottom-2 left-3 font-hand text-base sm:text-lg">伯尔尼纳快线，2024</span>
          </div>
        </div>

        <div data-collage-piece className="group absolute right-[5%] top-[8%] z-10 rotate-6 transition-transform duration-300 hover:z-40 hover:-translate-y-2 hover:rotate-2">
          <div className="w-36 border border-charcoal/5 bg-card p-2 pb-7 scrap-shadow sm:w-44 md:w-52">
            <img src={polaroidKyoto} alt="京都旅行街景" className="block aspect-[4/5] w-full object-cover" />
            <span className="absolute bottom-1.5 left-3 font-hand text-sm sm:text-base">京都，雨后</span>
          </div>
        </div>

        <div data-collage-piece className="absolute left-[32%] top-[8%] z-30 hidden w-28 rotate-3 sm:block md:w-36" data-float-sticker>
          <img src={cameraSticker.url} alt="银色数码相机贴纸" className="w-full object-contain drop-shadow-sm" />
        </div>
        <div data-collage-piece className="absolute left-[47%] top-[30%] z-30 w-14 -rotate-6 sm:w-20" data-float-sticker>
          <img src={starSticker.url} alt="银色立体星贴纸" className="w-full object-contain drop-shadow-sm" />
        </div>
        <div data-collage-piece className="absolute right-[23%] top-[2%] z-30 w-20 rotate-6 sm:w-28" data-float-sticker>
          <img src={bowSticker.url} alt="蓝色蝴蝶结贴纸" className="w-full object-contain" />
        </div>
        <div data-collage-piece className="absolute bottom-[17%] right-[4%] z-30 w-20 rotate-6 sm:w-28" data-float-sticker>
          <img src={ribbonSticker.url} alt="蓝色蝴蝶结拱贴纸" className="w-full object-contain" />
        </div>

        <div data-collage-piece className="absolute right-[8%] top-[47%] z-20 w-36 -rotate-3 sm:right-[13%] sm:w-48 md:w-56">
          <div className="overflow-hidden border border-charcoal/10 bg-cream scrap-shadow transition-transform duration-300 hover:-translate-y-1 hover:rotate-2">
            <img src={ticket} alt="巴黎旅行票券" className="block h-auto w-full" />
          </div>
        </div>

        <div data-collage-piece className="absolute bottom-[25%] left-[4%] z-10 w-40 -rotate-2 sm:left-[27%] sm:w-52 md:w-64">
          <img src={letterSticker.url} alt="手写爱心信纸贴纸" className="absolute inset-0 h-full w-full object-contain opacity-80" />
          <p className="relative px-5 py-8 font-hand text-lg leading-tight text-charcoal/85 sm:px-8 sm:text-xl md:text-2xl">
            「沿着铁轨走远，<br />再把雪山折进日记。」
          </p>
        </div>

        <div data-collage-piece className="absolute bottom-16 left-[5%] z-30 flex w-64 rotate-1 items-center gap-3 border border-charcoal/10 bg-card/90 px-3 py-2.5 scrap-shadow backdrop-blur-sm sm:bottom-6 sm:left-[30%] sm:w-72">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-9 shrink-0 rounded-full border border-charcoal/10"
            aria-label={isPlaying ? "暂停列车声音" : "播放列车声音"}
            onClick={() => toggleAudio(AUDIO_ID, trainAudio.url)}
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex h-5 items-center gap-[3px]" aria-hidden="true">
              {bars.map((height, index) => {
                const active = index / bars.length <= progress;
                return (
                  <span
                    key={index}
                    className={`w-[3px] origin-center rounded-full transition-colors duration-200 ${active ? "bg-charcoal" : "bg-dusty/50"} ${isPlaying ? "bar" : ""}`}
                    style={{ height: `${height * 100}%`, animationDelay: `${index * 0.07}s` }}
                  />
                );
              })}
            </div>
            <div className="mt-1 flex items-center justify-between text-[9px] font-bold uppercase text-charcoal/55">
              <span>列车经过雪原</span><span>{Math.round(progress * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 z-40 flex items-center gap-1 rounded-full border border-charcoal/10 bg-card/85 px-2 py-1.5 text-[10px] backdrop-blur-md scrap-shadow sm:bottom-6 sm:left-6 sm:px-3 sm:py-2 sm:text-[11px]">
          {["照片", "笔记", "音频", "贴纸"].map((label) => (
            <span key={label} className="rounded-full px-2 py-1 font-semibold text-charcoal/70 sm:px-3 sm:py-1.5">{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

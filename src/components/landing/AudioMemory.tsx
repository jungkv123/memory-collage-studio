import { Pause, Play } from "lucide-react";
import { toggleAudio, useAudioPlayer } from "@/lib/audio-player";
import sea from "@/assets/sea.mp3.asset.json";
import train from "@/assets/train.mp3.asset.json";
import market from "@/assets/market.mp3.asset.json";
import cafe from "@/assets/cafe.mp3.asset.json";

const clips = [
  { id: "sea", label: "海浪，里斯本", src: sea.url },
  { id: "train", label: "山手线，东京", src: train.url },
  { id: "market", label: "香料市集，非斯", src: market.url },
  { id: "cafe", label: "特拉斯泰韦雷的咖啡馆", src: cafe.url },
];

function fmt(s: number) {
  if (!isFinite(s) || s <= 0) return "0:10";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function AudioMemory() {
  const player = useAudioPlayer();
  const first = clips[0];
  const firstActive = player.id === first.id && player.playing;

  return (
    <section className="mt-32 bg-charcoal text-cream py-24 relative overflow-hidden">
      <div className="paper-texture absolute inset-0 opacity-10 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cream/50">
            §04 — 声音记忆
          </span>
          <h2 className="font-serif text-5xl md:text-6xl italic mt-4 leading-tight">
            某地的
            <br />
            十秒钟
          </h2>
          <p className="text-cream/65 leading-relaxed mt-6 max-w-md">
            为任意一片碎片别上一段环境声——海浪的白噪、火车站台、黄昏的市集。按下播放，整个房间都换了味道。
          </p>
          <button
            type="button"
            onClick={() => toggleAudio(first.id, first.src)}
            className="mt-8 inline-flex items-center gap-3 bg-cream/10 backdrop-blur-sm border border-cream/15 rounded-full pl-2 pr-5 py-2 hover:bg-cream/15 transition"
          >
            <span className="size-9 rounded-full bg-butter text-charcoal grid place-items-center">
              {firstActive ? <Pause className="size-4" /> : <Play className="size-4" />}
            </span>
            <span className="font-hand text-2xl text-cream">
              {firstActive ? "正在聆听…" : "聆听一段记忆"}
            </span>
          </button>
        </div>

        <div className="space-y-4">
          {clips.map((c, i) => (
            <Clip key={c.id} id={c.id} src={c.src} label={c.label} accent={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Clip({ id, src, label, accent }: { id: string; src: string; label: string; accent: number }) {
  const player = useAudioPlayer();
  const isCurrent = player.id === id;
  const isPlaying = isCurrent && player.playing;
  const progress = isCurrent ? player.progress : 0;

  const colors = ["bg-pinkv", "bg-butter", "bg-dusty", "bg-cream"];
  const bars = Array.from({ length: 36 }, (_, i) =>
    0.25 + Math.abs(Math.sin(i * 0.7 + accent)) * 0.75,
  );
  const played = Math.round(progress * bars.length);

  return (
    <button
      type="button"
      onClick={() => toggleAudio(id, src)}
      aria-label={`播放 ${label}`}
      className={`w-full text-left border rounded-2xl p-5 flex items-center gap-5 transition ${
        isCurrent ? "bg-cream/12 border-cream/30" : "bg-cream/5 border-cream/10 hover:bg-cream/10"
      }`}
    >
      <span
        className={`size-11 rounded-full ${colors[accent]} text-charcoal grid place-items-center scrap-shadow shrink-0`}
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
      </span>
      <span className="flex-1 min-w-0 block">
        <span className="text-sm font-semibold truncate block">{label}</span>
        <span className="mt-2 flex items-end gap-[2px] h-7">
          {bars.map((h, i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full transition-colors ${
                isCurrent && i < played ? "bg-butter" : "bg-cream/40"
              } ${isPlaying && i >= played ? "bar bg-cream/80" : ""}`}
              style={{ height: `${h * 100}%`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </span>
      </span>
      <span className="font-hand text-cream/60 text-lg shrink-0">
        {isCurrent && player.duration
          ? fmt(player.duration * (1 - progress))
          : fmt(player.duration && isCurrent ? player.duration : 0)}
      </span>
    </button>
  );
}

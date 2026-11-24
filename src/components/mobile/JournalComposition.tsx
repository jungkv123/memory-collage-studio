import { Link } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import type { Journal } from "@/data/journals";
import { Button } from "@/components/ui/button";
import { toggleAudio, useAudioPlayer } from "@/lib/audio-player";
import sea from "@/assets/sea.mp3.asset.json";
import train from "@/assets/train.mp3.asset.json";
import market from "@/assets/market.mp3.asset.json";
import ticket from "@/assets/ticket-paris.jpg";
import stamps from "@/assets/stamps.jpg";
import envelope from "@/assets/envelope-airmail.jpg";
import map from "@/assets/map-tokyo-torn.jpg";
import watercolor from "@/assets/map-watercolor.jpg";
import { distinctPhotos } from "./journal-presentation";

// Reuse the existing home ambient resources. JournalAudio has no recording URL.
const ambientSources: Record<string, string> = {
  "slow-train-west": train.url,
  "colorful-houses": sea.url,
  "lanterns-and-saffron": market.url,
};
const materials = new Set([ticket, stamps, envelope, map, watercolor]);

export function JournalSound({ journal }: { journal: Journal }) {
  const player = useAudioPlayer();
  const source = ambientSources[journal.slug];
  const clip = journal.audio?.[0];
  if (!source || !clip) return null;
  const id = `mobile-journal-${journal.slug}`;
  const active = player.id === id;
  const playing = active && player.playing;
  return (
    <div className="m-sound mt-4">
      <Button variant="ghost" size="icon" className="size-11 shrink-0 rounded-full bg-cream text-charcoal hover:bg-butter" aria-label={`${playing ? "暂停" : "试听"}环境声音：${clip.title}`} aria-pressed={playing} onClick={() => toggleAudio(id, source)}>
        {playing ? <Pause /> : <Play />}
      </Button>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-cream/80">环境声音</p>
        <p className="truncate text-sm font-medium">{clip.title}</p>
        <progress className="editorial-progress mt-1 block h-0.5 w-full" max={1} value={active ? player.progress : 0} aria-label={`${clip.title}播放进度`} />
      </div>
    </div>
  );
}

export function JournalComposition({ journal: j, index = 0 }: { journal: Journal; index?: number }) {
  const photos = distinctPhotos(j);
  const first = photos.find((p) => p.src === j.cover) ?? photos[0];
  const second = photos.find((p) => p.src !== (first?.src ?? j.cover));
  const note = j.notes[0];
  const textLed = index % 3 === 2 && Boolean(note);
  const double = !textLed && index % 3 === 1 && Boolean(second);
  return (
    <article className="min-w-0 border-b border-charcoal/15 pb-8" data-journal={j.slug}>
      <Link to="/journal/$slug" params={{ slug: j.slug }} className="block" aria-label={`查看作品：${j.title}`}>
        <p className="m-caption mb-3">{j.city} · {j.date}</p>
        {textLed && note ? (
          <div className="grid grid-cols-[1fr_104px] items-start gap-4">
            <div><p className="m-body mb-5">{note.text}</p><h2 className="m-h2">{j.title}</h2></div>
            <img src={j.cover} alt={first?.caption ?? j.title} loading="lazy" className="m-media aspect-[3/4]" />
          </div>
        ) : (
          <>
            <div className={double ? "m-diptych items-end" : ""}>
              <img src={j.cover} alt={first?.caption ?? j.title} loading="lazy" className={`m-media ${double ? "aspect-[4/5]" : "aspect-[4/3]"}`} />
              {double && second && <figure><img src={second.src} alt={second.caption ?? j.title} loading="lazy" className={`m-media aspect-[3/4] ${materials.has(second.src) ? "m-artifact object-contain bg-ivory" : ""}`} />{second.caption && <figcaption className="m-caption mt-2">{second.caption}</figcaption>}</figure>}
            </div>
            <h2 className="m-h2 mt-4">{j.title}</h2>
            {note && <p className="m-body mt-2">{note.text}</p>}
          </>
        )}
      </Link>
      <JournalSound journal={j} />
    </article>
  );
}
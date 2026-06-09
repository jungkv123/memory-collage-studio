import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/landing/Hero";
import { CanvasPreview } from "@/components/landing/CanvasPreview";
import { MemoryGlobe } from "@/components/landing/MemoryGlobe";
import { Features } from "@/components/landing/Features";
import { AudioMemory } from "@/components/landing/AudioMemory";
import { JournalGrid } from "@/components/landing/JournalGrid";
import { Manifesto, Marquee } from "@/components/landing/Manifesto";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fragmented — 旅行不是一条时间线，而是一幅拼贴画。" },
      { name: "description", content: "Fragmented 把零散的旅行记忆变成无限画布上的艺术拼贴——照片、车票、地图、笔记与声音。" },
      { property: "og:title", content: "Fragmented — 一份视觉化的旅行档案" },
      { property: "og:description", content: "在一张无限的拼贴画布上，把碎片化的记忆变成视觉故事。" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-cream text-charcoal selection:bg-pinkv/40">
      <SiteNav />
      <Hero />
      <CanvasPreview />
      <MemoryGlobe />
      <Features />
      <AudioMemory />
      <JournalGrid />
      <Manifesto />
      <Marquee />
      <SiteFooter />
    </div>
  );
}

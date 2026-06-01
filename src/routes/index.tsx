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
      { title: "Fragmented — Travel is not a timeline. It's a collage." },
      { name: "description", content: "Fragmented turns scattered travel memories into artistic digital collages on an infinite canvas — photos, tickets, maps, notes, and audio." },
      { property: "og:title", content: "Fragmented — A visual travel archive" },
      { property: "og:description", content: "Turn scattered memories into visual stories on an infinite collage canvas." },
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

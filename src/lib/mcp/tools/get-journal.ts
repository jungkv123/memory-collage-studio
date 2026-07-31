import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { journals } from "@/data/journals";

export default defineTool({
  name: "get_journal",
  title: "Get a travel journal",
  description:
    "Get the full content of one travel journal by its slug, including notes, photo captions, stickers and audio clips.",
  inputSchema: { slug: z.string().min(1).describe("Journal slug, e.g. slow-train-west.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const journal = journals.find((j) => j.slug === slug);
    if (!journal) {
      return {
        content: [{ type: "text" as const, text: `No journal found with slug "${slug}".` }],
        isError: true,
      };
    }

    const detail = {
      slug: journal.slug,
      title: journal.title,
      date: journal.date,
      city: journal.city,
      route: journal.route,
      status: journal.status,
      notes: journal.notes.map((n) => n.text),
      photoCaptions: journal.photos.map((p) => p.caption).filter(Boolean),
      stickers: journal.stickers.map((s) => s.emoji),
      audio: journal.audio ?? [],
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(detail, null, 2) }],
      structuredContent: { journal: detail },
    };
  },
});
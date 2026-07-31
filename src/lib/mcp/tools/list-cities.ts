import { defineTool } from "@lovable.dev/mcp-js";

import { journals } from "@/data/journals";

export default defineTool({
  name: "list_cities",
  title: "List visited cities",
  description:
    "List every city that has published journals in Memory Collage, with the journal count and slugs for each.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const map = new Map<string, string[]>();
    for (const j of journals) {
      if (j.status !== "published") continue;
      map.set(j.city, [...(map.get(j.city) ?? []), j.slug]);
    }
    const cities = Array.from(map, ([city, slugs]) => ({
      city,
      journalCount: slugs.length,
      slugs,
    }));

    return {
      content: [{ type: "text" as const, text: JSON.stringify(cities, null, 2) }],
      structuredContent: { cities },
    };
  },
});
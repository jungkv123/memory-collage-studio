import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { journals } from "@/data/journals";

export default defineTool({
  name: "list_journals",
  title: "List travel journals",
  description:
    "List the travel journals in Memory Collage, optionally filtered by city or status (published/draft/collected).",
  inputSchema: {
    city: z.string().optional().describe("Filter by city name, e.g. 京都."),
    status: z
      .enum(["published", "draft", "collected"])
      .optional()
      .describe("Filter by journal status."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ city, status }) => {
    const items = journals
      .filter((j) => (city ? j.city === city : true))
      .filter((j) => (status ? j.status === status : true))
      .map((j) => ({
        slug: j.slug,
        title: j.title,
        date: j.date,
        city: j.city,
        route: j.route,
        status: j.status,
        photoCount: j.photos.length,
      }));

    return {
      content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }],
      structuredContent: { journals: items },
    };
  },
});
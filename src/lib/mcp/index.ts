import { defineMcp } from "@lovable.dev/mcp-js";

import getJournalTool from "./tools/get-journal";
import listCitiesTool from "./tools/list-cities";
import listJournalsTool from "./tools/list-journals";

export default defineMcp({
  name: "memory-collage",
  title: "Memory Collage",
  version: "0.1.0",
  instructions:
    "Read-only tools for Memory Collage (Fragmented), a travel journaling app. Use `list_cities` to see visited cities, `list_journals` to browse journals, and `get_journal` to read one journal's notes, captions and audio clips.",
  tools: [listJournalsTool, getJournalTool, listCitiesTool],
});
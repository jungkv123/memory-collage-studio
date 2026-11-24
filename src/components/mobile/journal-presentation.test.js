import { test, expect } from "bun:test";
import { publishedJournals, homeJournalSections, distinctPhotos } from "./journal-presentation";

const journal = (slug, status, date = "2025 年 2 月", cover = slug) => ({ slug, status, date, cover, photos: [], notes: [], stickers: [], title: slug, city: "", route: "" });
test("Explore only includes published journals, never drafts or collected-only records", () => {
  expect(publishedJournals([journal("public", "published"), journal("unfinished", "draft"), journal("saved", "collected")]).map(j => j.slug)).toEqual(["public"]);
});
test("Home prioritizes drafts and then the latest publication", () => {
  const all = [journal("old", "published", "2024 年 6 月"), journal("new", "published", "2026年11月"), journal("draft", "draft")];
  expect(homeJournalSections(all, all).recent.map(j => j.slug)).toEqual(["draft", "new", "old"]);
});
test("Inspiration excludes recent works and their duplicate covers", () => {
  const recent = journal("recent", "published", "2026年11月", "shared");
  const other = journal("other", "published", "2024年6月", "shared");
  expect(homeJournalSections([recent], [recent, other, journal("discovery", "published")]).featured.map(j => j.slug)).toEqual(["discovery"]);
});
test("Double images cannot repeat the same resource", () => {
  const j = journal("photos", "published");
  j.photos = [{src: "one"}, {src: "one"}, {src: "two"}];
  expect(distinctPhotos(j).map(p => p.src)).toEqual(["one", "two"]);
});
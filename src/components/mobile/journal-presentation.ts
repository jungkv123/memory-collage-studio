import type { Journal } from "@/data/journals";

function monthValue(date: string) {
  const chinese = date.match(/(\d{4})\s*年\s*(\d{1,2})\s*月/);
  if (chinese?.[1] && chinese[2]) return Number(chinese[1]) * 12 + Number(chinese[2]);
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? 0 : new Date(parsed).getFullYear() * 12 + new Date(parsed).getMonth() + 1;
}

export function publishedJournals(all: Journal[]) {
  return all.filter((j) => j.status === "published");
}

export function homeJournalSections(all: Journal[], seeds: Journal[]) {
  // Month is the finest saved date precision; stable sorting preserves store order within a month.
  const newest = (a: Journal, b: Journal) => monthValue(b.date) - monthValue(a.date);
  const drafts = all.filter((j) => j.status === "draft").sort(newest);
  const published = publishedJournals(all).sort(newest);
  const recent = [...drafts.slice(0, 2), ...published].slice(0, 3);
  const shown = new Set(recent.map((j) => j.slug));
  const covers = new Set(recent.map((j) => j.cover));
  const featured = seeds.filter((j) => j.status === "published" && !shown.has(j.slug) && !covers.has(j.cover));
  return { recent, featured, published };
}

export function distinctPhotos(j: Journal) {
  return j.photos.filter((p, index, photos) => photos.findIndex((other) => other.src === p.src) === index);
}
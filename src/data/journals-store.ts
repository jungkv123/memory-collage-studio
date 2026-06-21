import { journals as seedJournals, type Journal } from "./journals";

const STORAGE_KEY = "fragmented:journals:v1";

type Listener = () => void;
const listeners = new Set<Listener>();
let userJournals: Journal[] = [];
let hydrated = false;

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) userJournals = JSON.parse(raw) as Journal[];
  } catch {
    userJournals = [];
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userJournals));
  } catch {
    /* quota / private mode — ignore */
  }
}

function emit() {
  for (const l of listeners) l();
}

export function getAllJournals(): Journal[] {
  hydrate();
  return [...userJournals, ...seedJournals];
}

export function addJournal(j: Journal) {
  hydrate();
  userJournals = [j, ...userJournals.filter((x) => x.slug !== j.slug)];
  persist();
  emit();
}

export function getJournalBySlugFromStore(slug: string): Journal | undefined {
  return getAllJournals().find((j) => j.slug === slug);
}

export function subscribeJournals(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function snapshotJournals() {
  return getAllJournals();
}
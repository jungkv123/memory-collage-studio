import { useSyncExternalStore } from "react";

export type TripType = "leisure" | "business" | "adventure";
export type ReminderKind = "flight" | "hotel" | "activity";

export type Reminder = {
  id: string;
  kind: ReminderKind;
  label: string;
  time?: string; // HH:mm
};

export type TimelineItem = {
  id: string;
  time: string; // HH:mm
  title: string;
  note?: string;
};

export type Trip = {
  id: string;
  title: string;
  city: string;
  type: TripType;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  notes?: string;
  reminders: Reminder[];
  timeline: TimelineItem[];
  weather?: string; // optional, e.g. "晴 22°"
};

const KEY = "fragmented:trips:v1";
const listeners = new Set<() => void>();
let trips: Trip[] = [];
let hydrated = false;

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) trips = JSON.parse(raw) as Trip[];
    else trips = seed();
  } catch {
    trips = [];
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trips));
  } catch {}
}

function emit() {
  for (const l of listeners) l();
}

function seed(): Trip[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const add = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return iso(d);
  };
  return [
    {
      id: "demo-kyoto",
      title: "京都赏枫",
      city: "京都",
      type: "leisure",
      start: add(3),
      end: add(6),
      notes: "贵船、岚山、伏见稻荷。",
      weather: "多云 18°",
      reminders: [
        { id: "r1", kind: "flight", label: "国航 CA929 06:55", time: "06:55" },
        { id: "r2", kind: "hotel", label: "京都四季 入住", time: "15:00" },
      ],
      timeline: [
        { id: "t1", time: "09:00", title: "岚山竹林", note: "早一点避开人群" },
        { id: "t2", time: "13:00", title: "% Arabica 咖啡" },
        { id: "t3", time: "18:30", title: "祇园晚餐" },
      ],
    },
    {
      id: "demo-berlin",
      title: "柏林会议",
      city: "柏林",
      type: "business",
      start: add(14),
      end: add(17),
      notes: "周三 keynote。",
      weather: "小雨 12°",
      reminders: [{ id: "r3", kind: "activity", label: "Keynote 14:00", time: "14:00" }],
      timeline: [],
    },
  ];
}

export const tripsStore = {
  subscribe(l: () => void) {
    hydrate();
    listeners.add(l);
    return () => listeners.delete(l);
  },
  snapshot() {
    hydrate();
    return trips;
  },
  add(t: Trip) {
    hydrate();
    trips = [t, ...trips];
    persist();
    emit();
  },
  update(id: string, patch: Partial<Trip>) {
    hydrate();
    trips = trips.map((t) => (t.id === id ? { ...t, ...patch } : t));
    persist();
    emit();
  },
  remove(id: string) {
    hydrate();
    trips = trips.filter((t) => t.id !== id);
    persist();
    emit();
  },
  reschedule(id: string, newStart: string) {
    hydrate();
    trips = trips.map((t) => {
      if (t.id !== id) return t;
      const ms = toDate(t.end).getTime() - toDate(t.start).getTime();
      const newEnd = iso(new Date(toDate(newStart).getTime() + ms));
      return { ...t, start: newStart, end: newEnd };
    });
    persist();
    emit();
  },
};

export function useTrips() {
  return useSyncExternalStore(
    tripsStore.subscribe,
    tripsStore.snapshot,
    tripsStore.snapshot,
  );
}

export const TYPE_META: Record<TripType, { label: string; color: string; dot: string }> = {
  leisure: { label: "休闲", color: "bg-butter/70 border-butter text-charcoal", dot: "bg-butter" },
  business: { label: "商务", color: "bg-dusty/40 border-dusty text-charcoal", dot: "bg-dusty" },
  adventure: { label: "探险", color: "bg-pinkv/40 border-pinkv text-charcoal", dot: "bg-pinkv" },
};

export const iso = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
export const toDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};
export const inRange = (day: string, start: string, end: string) =>
  day >= start && day <= end;
export const eachDay = (start: string, end: string) => {
  const out: string[] = [];
  const s = toDate(start);
  const e = toDate(end);
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) out.push(iso(d));
  return out;
};
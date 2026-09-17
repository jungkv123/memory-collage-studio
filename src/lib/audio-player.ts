import { useSyncExternalStore } from "react";

type State = {
  id: string | null;
  playing: boolean;
  progress: number; // 0..1
  duration: number; // seconds
};

let state: State = { id: null, playing: false, progress: 0, duration: 0 };
const listeners = new Set<() => void>();
let el: HTMLAudioElement | null = null;

function emit(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function ensureEl() {
  if (el || typeof window === "undefined") return el;
  el = new Audio();
  el.addEventListener("timeupdate", () => {
    if (!el) return;
    const d = el.duration || 0;
    emit({ progress: d ? el.currentTime / d : 0, duration: d });
  });
  el.addEventListener("loadedmetadata", () => emit({ duration: el?.duration || 0 }));
  el.addEventListener("ended", () => emit({ id: null, playing: false, progress: 0 }));
  el.addEventListener("pause", () => emit({ playing: false }));
  el.addEventListener("play", () => emit({ playing: true }));
  return el;
}

/** Play/pause a single global clip. Starting one stops any other. */
export function toggleAudio(id: string, src?: string) {
  const a = ensureEl();
  if (!a || !src) return;
  if (state.id === id) {
    if (a.paused) void a.play().catch(() => {});
    else a.pause();
    return;
  }
  a.pause();
  a.src = src;
  a.currentTime = 0;
  emit({ id, progress: 0, duration: 0 });
  void a.play().catch(() => emit({ id: null, playing: false }));
}

export function useAudioPlayer() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
}

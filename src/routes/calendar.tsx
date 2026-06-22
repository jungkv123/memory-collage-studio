import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Bell, Plane, Hotel, MapPin, Cloud, Calendar as CalIcon } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  tripsStore,
  useTrips,
  TYPE_META,
  iso,
  toDate,
  inRange,
  eachDay,
  type Trip,
  type TripType,
  type Reminder,
  type ReminderKind,
  type TimelineItem,
} from "@/data/trips-store";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "旅行日历 — Fragmented" },
      { name: "description", content: "在日历中规划行程，拖拽改期，标签分类，提醒与每日时间线。" },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const trips = useTrips();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDay, setSelectedDay] = useState<string>(iso(new Date()));
  const [editing, setEditing] = useState<Trip | null>(null);
  const [creatingForDay, setCreatingForDay] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 mb-2">Travel Calendar</p>
            <h1 className="font-serif italic text-4xl md:text-5xl text-charcoal">旅行日历</h1>
            <p className="text-sm text-charcoal/60 mt-2">月/周/日视图 · 拖拽改期 · 颜色标签 · 提醒与时间线</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const t = new Date();
                setCursor(new Date(t.getFullYear(), t.getMonth(), 1));
                setSelectedDay(iso(t));
              }}
            >
              今天
            </Button>
            <Button
              className="bg-charcoal text-cream hover:bg-charcoal/85"
              onClick={() => setCreatingForDay(selectedDay)}
            >
              <Plus className="size-4" /> 新建行程
            </Button>
          </div>
        </header>

        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <TabsList className="bg-cream border border-charcoal/15">
              <TabsTrigger value="month">月</TabsTrigger>
              <TabsTrigger value="week">周</TabsTrigger>
              <TabsTrigger value="day">日</TabsTrigger>
            </TabsList>
            <NavBar cursor={cursor} setCursor={setCursor} view={view} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            <Legend />
          </div>

          <TabsContent value="month">
            <MonthGrid
              cursor={cursor}
              trips={trips}
              onPick={(d) => { setSelectedDay(d); setView("day"); }}
              onCreate={(d) => setCreatingForDay(d)}
              onEdit={setEditing}
              onDropTrip={(id, day) => tripsStore.reschedule(id, day)}
            />
          </TabsContent>
          <TabsContent value="week">
            <WeekView
              anchor={selectedDay}
              trips={trips}
              onPick={(d) => { setSelectedDay(d); setView("day"); }}
              onCreate={(d) => setCreatingForDay(d)}
              onEdit={setEditing}
              onDropTrip={(id, day) => tripsStore.reschedule(id, day)}
            />
          </TabsContent>
          <TabsContent value="day">
            <DayView day={selectedDay} trips={trips} onEdit={setEditing} onCreate={(d) => setCreatingForDay(d)} />
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />

      <TripDialog
        open={!!editing || !!creatingForDay}
        trip={editing}
        defaultDay={creatingForDay ?? selectedDay}
        onClose={() => { setEditing(null); setCreatingForDay(null); }}
      />
    </div>
  );
}

function NavBar({
  cursor, setCursor, view, selectedDay, setSelectedDay,
}: {
  cursor: Date;
  setCursor: (d: Date) => void;
  view: "month" | "week" | "day";
  selectedDay: string;
  setSelectedDay: (d: string) => void;
}) {
  const label = view === "month"
    ? `${cursor.getFullYear()} 年 ${cursor.getMonth() + 1} 月`
    : view === "week"
      ? weekLabel(selectedDay)
      : toDate(selectedDay).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  const step = (n: number) => {
    if (view === "month") {
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));
    } else if (view === "week") {
      const d = toDate(selectedDay); d.setDate(d.getDate() + n * 7); setSelectedDay(iso(d));
    } else {
      const d = toDate(selectedDay); d.setDate(d.getDate() + n); setSelectedDay(iso(d));
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => step(-1)}><ChevronLeft className="size-4" /></Button>
      <span className="font-serif italic text-xl min-w-[12rem] text-center">{label}</span>
      <Button variant="outline" size="icon" onClick={() => step(1)}><ChevronRight className="size-4" /></Button>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[11px] text-charcoal/70">
      {(Object.keys(TYPE_META) as TripType[]).map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          <span className={`size-2.5 rounded-full ${TYPE_META[k].dot}`} />
          {TYPE_META[k].label}
        </span>
      ))}
    </div>
  );
}

function weekLabel(day: string) {
  const days = weekDays(day);
  const a = toDate(days[0]);
  const b = toDate(days[6]);
  return `${a.getMonth() + 1}/${a.getDate()} – ${b.getMonth() + 1}/${b.getDate()}`;
}

function weekDays(anchor: string) {
  const d = toDate(anchor);
  const dow = d.getDay(); // 0=Sun
  const start = new Date(d);
  start.setDate(d.getDate() - dow);
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const x = new Date(start); x.setDate(start.getDate() + i);
    out.push(iso(x));
  }
  return out;
}

function monthCells(cursor: Date) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startDow = first.getDay();
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startDow);
  const cells: { day: string; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart); d.setDate(gridStart.getDate() + i);
    cells.push({ day: iso(d), inMonth: d.getMonth() === cursor.getMonth() });
  }
  return cells;
}

function tripsOnDay(trips: Trip[], day: string) {
  return trips.filter((t) => inRange(day, t.start, t.end));
}

function MonthGrid({
  cursor, trips, onPick, onCreate, onEdit, onDropTrip,
}: {
  cursor: Date;
  trips: Trip[];
  onPick: (d: string) => void;
  onCreate: (d: string) => void;
  onEdit: (t: Trip) => void;
  onDropTrip: (id: string, day: string) => void;
}) {
  const cells = useMemo(() => monthCells(cursor), [cursor]);
  const today = iso(new Date());
  const weekHeads = ["日", "一", "二", "三", "四", "五", "六"];
  return (
    <div className="border border-charcoal/15 rounded-2xl bg-ivory overflow-hidden">
      <div className="grid grid-cols-7 bg-cream border-b border-charcoal/10 text-[11px] uppercase tracking-[0.18em] text-charcoal/60">
        {weekHeads.map((w) => <div key={w} className="px-3 py-2 text-center">{w}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map(({ day, inMonth }) => {
          const ts = tripsOnDay(trips, day);
          return (
            <div
              key={day}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData("text/trip-id");
                if (id) onDropTrip(id, day);
              }}
              className={`min-h-[110px] border-r border-b border-charcoal/10 p-2 flex flex-col gap-1 group ${
                inMonth ? "bg-ivory" : "bg-cream/60 text-charcoal/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onPick(day)}
                  className={`text-xs font-semibold size-6 rounded-full grid place-items-center transition ${
                    day === today ? "bg-charcoal text-cream" : "hover:bg-charcoal/10"
                  }`}
                >
                  {toDate(day).getDate()}
                </button>
                <button
                  onClick={() => onCreate(day)}
                  className="opacity-0 group-hover:opacity-100 transition text-charcoal/60 hover:text-charcoal"
                  aria-label="新建"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {ts.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/trip-id", t.id)}
                    onClick={() => onEdit(t)}
                    className={`text-left text-[11px] px-1.5 py-0.5 rounded border ${TYPE_META[t.type].color} truncate cursor-grab active:cursor-grabbing`}
                    title={`${t.title} · ${t.city}`}
                  >
                    {t.title}
                  </button>
                ))}
                {ts.length > 3 && (
                  <button onClick={() => onPick(day)} className="text-[10px] text-charcoal/50 text-left">+{ts.length - 3} 更多</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  anchor, trips, onPick, onCreate, onEdit, onDropTrip,
}: {
  anchor: string;
  trips: Trip[];
  onPick: (d: string) => void;
  onCreate: (d: string) => void;
  onEdit: (t: Trip) => void;
  onDropTrip: (id: string, day: string) => void;
}) {
  const days = weekDays(anchor);
  const today = iso(new Date());
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {days.map((day) => {
        const ts = tripsOnDay(trips, day);
        const d = toDate(day);
        return (
          <div
            key={day}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("text/trip-id");
              if (id) onDropTrip(id, day);
            }}
            className={`min-h-[200px] rounded-xl border p-3 bg-ivory ${day === today ? "border-charcoal" : "border-charcoal/15"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => onPick(day)} className="text-left">
                <div className="text-[10px] uppercase tracking-[0.18em] text-charcoal/60">{["日","一","二","三","四","五","六"][d.getDay()]}</div>
                <div className="font-serif italic text-2xl">{d.getMonth() + 1}/{d.getDate()}</div>
              </button>
              <button onClick={() => onCreate(day)} className="text-charcoal/60 hover:text-charcoal"><Plus className="size-4" /></button>
            </div>
            <div className="flex flex-col gap-1.5">
              {ts.length === 0 && <p className="text-[11px] text-charcoal/40">无安排</p>}
              {ts.map((t) => (
                <button
                  key={t.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/trip-id", t.id)}
                  onClick={() => onEdit(t)}
                  className={`text-left text-xs px-2 py-1 rounded border ${TYPE_META[t.type].color} cursor-grab active:cursor-grabbing`}
                >
                  <div className="font-semibold truncate">{t.title}</div>
                  <div className="text-[10px] opacity-70 truncate">{t.city}{t.weather ? ` · ${t.weather}` : ""}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayView({
  day, trips, onEdit, onCreate,
}: {
  day: string;
  trips: Trip[];
  onEdit: (t: Trip) => void;
  onCreate: (d: string) => void;
}) {
  const ts = tripsOnDay(trips, day);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const items: { time: string; trip: Trip; title: string; kind: "reminder" | "timeline"; icon?: string }[] = [];
  for (const t of ts) {
    for (const r of t.reminders) if (r.time) items.push({ time: r.time, trip: t, title: r.label, kind: "reminder", icon: r.kind });
    for (const tl of t.timeline) items.push({ time: tl.time, trip: t, title: tl.title, kind: "timeline" });
  }
  items.sort((a, b) => a.time.localeCompare(b.time));
  const d = toDate(day);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-charcoal/15 bg-ivory p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/60">{d.toLocaleDateString("zh-CN", { weekday: "long" })}</p>
          <p className="font-serif italic text-3xl">{d.getMonth() + 1} 月 {d.getDate()} 日</p>
        </div>
        {ts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-charcoal/20 p-6 text-center text-sm text-charcoal/60">
            这一天还没有行程。
            <Button variant="link" onClick={() => onCreate(day)} className="px-1">添加一个</Button>
          </div>
        ) : ts.map((t) => (
          <button key={t.id} onClick={() => onEdit(t)} className={`w-full text-left rounded-2xl border p-4 ${TYPE_META[t.type].color}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif italic text-lg">{t.title}</span>
              <span className="text-[10px] uppercase tracking-[0.15em]">{TYPE_META[t.type].label}</span>
            </div>
            <div className="text-xs flex items-center gap-2 text-charcoal/70">
              <MapPin className="size-3" />{t.city}
              {t.weather && <><Cloud className="size-3 ml-1" />{t.weather}</>}
            </div>
            <div className="text-[11px] mt-1 text-charcoal/60">{t.start} → {t.end}</div>
          </button>
        ))}
      </aside>

      <section className="rounded-2xl border border-charcoal/15 bg-ivory overflow-hidden">
        <div className="px-5 py-3 border-b border-charcoal/10 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60">每日时间线</span>
          <Button size="sm" variant="outline" onClick={() => onCreate(day)}><Plus className="size-3" /> 新建</Button>
        </div>
        <div className="divide-y divide-charcoal/5">
          {hours.map((h) => {
            const hh = String(h).padStart(2, "0");
            const slot = items.filter((it) => it.time.startsWith(hh));
            return (
              <div key={h} className="grid grid-cols-[64px_1fr] min-h-[44px]">
                <div className="text-[11px] text-charcoal/40 px-3 pt-2 border-r border-charcoal/5">{hh}:00</div>
                <div className="p-1.5 flex flex-col gap-1">
                  {slot.map((it, idx) => (
                    <button
                      key={idx}
                      onClick={() => onEdit(it.trip)}
                      className={`text-left text-xs px-2 py-1 rounded border ${TYPE_META[it.trip.type].color} flex items-center gap-2`}
                    >
                      <span className="font-semibold tabular-nums">{it.time}</span>
                      {it.kind === "reminder" && <Bell className="size-3" />}
                      <span className="truncate">{it.title}</span>
                      <span className="ml-auto text-[10px] opacity-60">{it.trip.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TripDialog({
  open, trip, defaultDay, onClose,
}: {
  open: boolean;
  trip: Trip | null;
  defaultDay: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Trip>(() => emptyTrip(defaultDay));
  // Re-init when dialog opens with a new trip or new defaultDay
  const [signature, setSignature] = useState("");
  const want = (trip?.id ?? "new") + ":" + defaultDay + ":" + (open ? "1" : "0");
  if (open && want !== signature) {
    setSignature(want);
    setForm(trip ? structuredClone(trip) : emptyTrip(defaultDay));
  }

  const save = () => {
    if (!form.title.trim()) return;
    if (form.end < form.start) form.end = form.start;
    if (trip) tripsStore.update(trip.id, form);
    else tripsStore.add({ ...form, id: crypto.randomUUID() });
    onClose();
  };
  const del = () => {
    if (trip) tripsStore.remove(trip.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif italic text-2xl flex items-center gap-2">
            <CalIcon className="size-5" /> {trip ? "编辑行程" : "新建行程"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="标题"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="京都赏枫" /></Field>
            <Field label="目的地"><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="京都" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="开始"><Input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></Field>
            <Field label="结束"><Input type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></Field>
            <Field label="类型">
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TripType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="leisure">休闲 / Leisure</SelectItem>
                  <SelectItem value="business">商务 / Business</SelectItem>
                  <SelectItem value="adventure">探险 / Adventure</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="天气（可选）"><Input value={form.weather ?? ""} onChange={(e) => setForm({ ...form, weather: e.target.value })} placeholder="晴 22°" /></Field>
          <Field label="备注"><Textarea value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="写点什么…" /></Field>

          <RemindersEditor value={form.reminders} onChange={(reminders) => setForm({ ...form, reminders })} />
          <TimelineEditor value={form.timeline} onChange={(timeline) => setForm({ ...form, timeline })} />
        </div>

        <DialogFooter className="flex sm:justify-between items-center gap-2 mt-2">
          <div>
            {trip && (
              <Button variant="ghost" onClick={del} className="text-destructive hover:text-destructive">
                <Trash2 className="size-4" /> 删除
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>取消</Button>
            <Button className="bg-charcoal text-cream hover:bg-charcoal/85" onClick={save}>保存</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] uppercase tracking-[0.15em] text-charcoal/60">{label}</Label>
      {children}
    </div>
  );
}

function RemindersEditor({ value, onChange }: { value: Reminder[]; onChange: (r: Reminder[]) => void }) {
  const add = () => onChange([...value, { id: crypto.randomUUID(), kind: "flight", label: "", time: "" }]);
  const ICONS: Record<ReminderKind, React.ReactNode> = {
    flight: <Plane className="size-3.5" />, hotel: <Hotel className="size-3.5" />, activity: <Bell className="size-3.5" />,
  };
  return (
    <div className="rounded-xl border border-charcoal/15 p-3 bg-cream/50">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-[11px] uppercase tracking-[0.15em] text-charcoal/60">提醒（航班 · 酒店 · 活动）</Label>
        <Button size="sm" variant="outline" onClick={add}><Plus className="size-3" /> 添加</Button>
      </div>
      <div className="space-y-2">
        {value.length === 0 && <p className="text-xs text-charcoal/50">还没有提醒。</p>}
        {value.map((r, i) => (
          <div key={r.id} className="grid grid-cols-[110px_90px_1fr_auto] gap-2 items-center">
            <Select value={r.kind} onValueChange={(v) => onChange(value.map((x, idx) => idx === i ? { ...x, kind: v as ReminderKind } : x))}>
              <SelectTrigger className="h-9"><span className="flex items-center gap-1.5">{ICONS[r.kind]}<SelectValue /></span></SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">航班</SelectItem>
                <SelectItem value="hotel">酒店</SelectItem>
                <SelectItem value="activity">活动</SelectItem>
              </SelectContent>
            </Select>
            <Input type="time" value={r.time ?? ""} onChange={(e) => onChange(value.map((x, idx) => idx === i ? { ...x, time: e.target.value } : x))} />
            <Input placeholder="例如 国航 CA929" value={r.label} onChange={(e) => onChange(value.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} />
            <Button size="icon" variant="ghost" onClick={() => onChange(value.filter((_, idx) => idx !== i))}><Trash2 className="size-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineEditor({ value, onChange }: { value: TimelineItem[]; onChange: (t: TimelineItem[]) => void }) {
  const add = () => onChange([...value, { id: crypto.randomUUID(), time: "09:00", title: "" }]);
  return (
    <div className="rounded-xl border border-charcoal/15 p-3 bg-cream/50">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-[11px] uppercase tracking-[0.15em] text-charcoal/60">每日时间线</Label>
        <Button size="sm" variant="outline" onClick={add}><Plus className="size-3" /> 添加</Button>
      </div>
      <div className="space-y-2">
        {value.length === 0 && <p className="text-xs text-charcoal/50">还没有安排。</p>}
        {value.map((t, i) => (
          <div key={t.id} className="grid grid-cols-[90px_1fr_auto] gap-2 items-center">
            <Input type="time" value={t.time} onChange={(e) => onChange(value.map((x, idx) => idx === i ? { ...x, time: e.target.value } : x))} />
            <Input placeholder="活动" value={t.title} onChange={(e) => onChange(value.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} />
            <Button size="icon" variant="ghost" onClick={() => onChange(value.filter((_, idx) => idx !== i))}><Trash2 className="size-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function emptyTrip(day: string): Trip {
  return {
    id: "",
    title: "",
    city: "",
    type: "leisure",
    start: day,
    end: day,
    notes: "",
    reminders: [],
    timeline: [],
  };
}

// keep eachDay export referenced for tree-shaking sanity
void eachDay;
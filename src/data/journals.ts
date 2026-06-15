import italy from "@/assets/polaroid-italy.jpg";
import kyoto from "@/assets/polaroid-kyoto.jpg";
import morocco from "@/assets/polaroid-morocco.jpg";
import train from "@/assets/polaroid-train.jpg";
import ticket from "@/assets/ticket-paris.jpg";
import envelope from "@/assets/envelope-airmail.jpg";
import tokyo from "@/assets/map-tokyo-torn.jpg";
import watercolor from "@/assets/map-watercolor.jpg";
import stamps from "@/assets/stamps.jpg";

export type JournalStatus = "published" | "draft" | "collected";

export type JournalPhoto = { src: string; caption?: string; tape?: string };
export type JournalNote = { text: string; color?: string };
export type JournalSticker = { emoji: string; color: string };
export type JournalAudio = { title: string; duration: string };

export type Journal = {
  slug: string;
  title: string;
  date: string;
  city: string;
  cover: string;
  route: string;
  photos: JournalPhoto[];
  notes: JournalNote[];
  stickers: JournalSticker[];
  audio?: JournalAudio[];
  status: JournalStatus;
  collected?: boolean;
};

export const journals: Journal[] = [
  {
    slug: "slow-train-west",
    title: "慢车，向西",
    date: "2024 年 6 月",
    city: "伯尔尼纳",
    cover: train,
    route: "苏黎世 → 库尔 → 伯尔尼纳 → 蒂拉诺",
    photos: [
      { src: train, caption: "伯尔尼纳快线", tape: "tape" },
      { src: ticket, caption: "二等座 · 14号车厢", tape: "tape-pink" },
      { src: tokyo, caption: "窗外的雪线", tape: "tape-blue" },
    ],
    notes: [
      { text: "山口处忽然安静，所有人放下相机看了一会儿云。", color: "bg-butter/40" },
      { text: "瑞士的列车员会用三种语言说'下一站'。", color: "bg-dusty/30" },
    ],
    stickers: [
      { emoji: "✈", color: "bg-dusty" },
      { emoji: "★", color: "bg-pinkv" },
      { emoji: "☼", color: "bg-butter" },
    ],
    audio: [{ title: "车轮，过隧道", duration: "0:18" }],
    status: "published",
  },
  {
    slug: "colorful-houses",
    title: "像水果般颜色的房子",
    date: "2024 年 7 月",
    city: "五渔村",
    cover: italy,
    route: "拉斯佩齐亚 → 里奥马焦雷 → 韦尔纳扎",
    photos: [
      { src: italy, caption: "韦尔纳扎，下午三点", tape: "tape-pink" },
      { src: envelope, caption: "寄给自己的明信片", tape: "tape" },
      { src: stamps, caption: "邮局的橱窗", tape: "tape-blue" },
    ],
    notes: [
      { text: "柠檬冰沙比海风更咸。", color: "bg-pinkv/20" },
      { text: "把房子涂成芒果色的人，一定爱过夏天。", color: "bg-butter/40" },
    ],
    stickers: [
      { emoji: "✿", color: "bg-pinkv" },
      { emoji: "☀", color: "bg-butter" },
      { emoji: "♥", color: "bg-dusty" },
    ],
    audio: [{ title: "海，五渔村", duration: "0:24" }],
    status: "published",
    collected: true,
  },
  {
    slug: "rain-through-cedars",
    title: "穿过雪松的雨",
    date: "2024 年 10 月",
    city: "京都",
    cover: kyoto,
    route: "京都站 → 岚山 → 贵船",
    photos: [
      { src: kyoto, caption: "贵船的午后", tape: "tape-blue" },
      { src: watercolor, caption: "手绘的地图", tape: "tape" },
    ],
    notes: [
      { text: "雨打在杉木上的声音，像有人在数硬币。", color: "bg-dusty/30" },
    ],
    stickers: [
      { emoji: "☂", color: "bg-charcoal" },
      { emoji: "✺", color: "bg-dusty" },
    ],
    status: "published",
    collected: true,
  },
  {
    slug: "lanterns-and-saffron",
    title: "灯笼与藏红花",
    date: "2025 年 2 月",
    city: "马拉喀什",
    cover: morocco,
    route: "卡萨布兰卡 → 马拉喀什 → 艾西拉",
    photos: [
      { src: morocco, caption: "麦地那入口", tape: "tape-pink" },
      { src: stamps, caption: "香料市集", tape: "tape" },
    ],
    notes: [
      { text: "藏红花的金，比想象中更安静。", color: "bg-butter/40" },
      { text: "夜里灯笼一盏一盏亮起，像有人在数星星。", color: "bg-pinkv/20" },
    ],
    stickers: [
      { emoji: "☼", color: "bg-butter" },
      { emoji: "✦", color: "bg-pinkv" },
    ],
    audio: [{ title: "市集的傍晚", duration: "0:32" }],
    status: "published",
  },
  {
    slug: "lisbon-spring-draft",
    title: "里斯本的一个小小春天",
    date: "2025 年 4 月",
    city: "里斯本",
    cover: envelope,
    route: "里斯本 → 辛特拉",
    photos: [{ src: envelope, caption: "未寄出的信", tape: "tape" }],
    notes: [{ text: "（还没写完……）", color: "bg-butter/40" }],
    stickers: [{ emoji: "✿", color: "bg-pinkv" }],
    status: "draft",
  },
  {
    slug: "tokyo-night-draft",
    title: "东京，深夜便利店",
    date: "2025 年 5 月",
    city: "东京",
    cover: tokyo,
    route: "新宿 → 下北泽",
    photos: [{ src: tokyo, caption: "凌晨两点的便利店灯", tape: "tape-blue" }],
    notes: [{ text: "（草稿：写一写关东煮的雾气。）", color: "bg-dusty/30" }],
    stickers: [{ emoji: "★", color: "bg-charcoal" }],
    status: "draft",
  },
];

export const getJournalBySlug = (slug: string) =>
  journals.find((j) => j.slug === slug);

export const getCities = () => {
  const map = new Map<string, Journal[]>();
  for (const j of journals) {
    if (j.status !== "published") continue;
    const list = map.get(j.city) ?? [];
    list.push(j);
    map.set(j.city, list);
  }
  return Array.from(map, ([city, items]) => ({ city, items }));
};
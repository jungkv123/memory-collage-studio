import collage001 from "@/assets/stickers/fragmented-collage-001.png.asset.json";
import collage002 from "@/assets/stickers/fragmented-collage-002.png.asset.json";
import collage003 from "@/assets/stickers/fragmented-collage-003.png.asset.json";
import collage004 from "@/assets/stickers/fragmented-collage-004.png.asset.json";
import collage005 from "@/assets/stickers/fragmented-collage-005.png.asset.json";
import collage006 from "@/assets/stickers/fragmented-collage-006.png.asset.json";
import collage007 from "@/assets/stickers/fragmented-collage-007.png.asset.json";
import collage008 from "@/assets/stickers/fragmented-collage-008.png.asset.json";
import collage009 from "@/assets/stickers/fragmented-collage-009.png.asset.json";
import collage010 from "@/assets/stickers/fragmented-collage-010.png.asset.json";
import collage011 from "@/assets/stickers/fragmented-collage-011.png.asset.json";
import collage012 from "@/assets/stickers/fragmented-collage-012.png.asset.json";
import collage013 from "@/assets/stickers/fragmented-collage-013.png.asset.json";
import collage014 from "@/assets/stickers/fragmented-collage-014.png.asset.json";
import collage015 from "@/assets/stickers/fragmented-collage-015.png.asset.json";

export type StickerDef = {
  id: string;
  label: string;
  src: string;
  w?: number;
};

export type StickerCategory = {
  name: string;
  key: string;
  items: StickerDef[];
};

export const stickerLibrary: StickerCategory[] = [
  {
    name: "爱意票据",
    key: "love-paper",
    items: [
      { id: "love-heart", label: "爱心宣言", src: collage002.url, w: 120 },
      { id: "love-card", label: "复古爱意卡", src: collage003.url, w: 100 },
      { id: "number-ticket", label: "编号票根", src: collage004.url, w: 80 },
      { id: "stars-note", label: "星星手写条", src: collage005.url, w: 105 },
      { id: "love-ticket", label: "爱意票券", src: collage009.url, w: 145 },
    ],
  },
  {
    name: "果园手作",
    key: "orchard-handmade",
    items: [
      { id: "gingham-paper", label: "红格纹纸", src: collage001.url, w: 135 },
      { id: "strawberry-left", label: "手绘草莓一", src: collage007.url, w: 105 },
      { id: "strawberry-right", label: "手绘草莓二", src: collage008.url, w: 95 },
      { id: "green-bow", label: "绿格蝴蝶结", src: collage011.url, w: 115 },
      { id: "green-apple", label: "青苹果", src: collage012.url, w: 105 },
      { id: "apple-note", label: "苹果便笺", src: collage013.url, w: 145 },
      { id: "rabbit-umbrella", label: "雨伞小兔", src: collage014.url, w: 115 },
    ],
  },
  {
    name: "纸张边框",
    key: "paper-frames",
    items: [
      { id: "floral-frame", label: "花朵边框", src: collage006.url, w: 125 },
      { id: "gingham-label", label: "红格标签", src: collage010.url, w: 145 },
      { id: "green-paper", label: "绿点撕纸", src: collage015.url, w: 135 },
    ],
  },
];
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

import packA01 from "@/assets/stickers/fragmented-a-01.png.asset.json";
import packA02 from "@/assets/stickers/fragmented-a-02.png.asset.json";
import packA03 from "@/assets/stickers/fragmented-a-03.png.asset.json";
import packA04 from "@/assets/stickers/fragmented-a-04.png.asset.json";
import packA05 from "@/assets/stickers/fragmented-a-05.png.asset.json";
import packA06 from "@/assets/stickers/fragmented-a-06.png.asset.json";
import packA07 from "@/assets/stickers/fragmented-a-07.png.asset.json";
import packA08 from "@/assets/stickers/fragmented-a-08.png.asset.json";
import packA09 from "@/assets/stickers/fragmented-a-09.png.asset.json";
import packA10 from "@/assets/stickers/fragmented-a-10.png.asset.json";
import packA11 from "@/assets/stickers/fragmented-a-11.png.asset.json";
import packA12 from "@/assets/stickers/fragmented-a-12.png.asset.json";
import packA13 from "@/assets/stickers/fragmented-a-13.png.asset.json";
import packB01 from "@/assets/stickers/fragmented-b-01.png.asset.json";
import packB02 from "@/assets/stickers/fragmented-b-02.png.asset.json";
import packB03 from "@/assets/stickers/fragmented-b-03.png.asset.json";
import packB04 from "@/assets/stickers/fragmented-b-04.png.asset.json";
import packB05 from "@/assets/stickers/fragmented-b-05.png.asset.json";
import packB06 from "@/assets/stickers/fragmented-b-06.png.asset.json";
import packB07 from "@/assets/stickers/fragmented-b-07.png.asset.json";
import packC01 from "@/assets/stickers/fragmented-c-01.png.asset.json";
import packC02 from "@/assets/stickers/fragmented-c-02.png.asset.json";
import packC03 from "@/assets/stickers/fragmented-c-03.png.asset.json";
import packC04 from "@/assets/stickers/fragmented-c-04.png.asset.json";
import packC05 from "@/assets/stickers/fragmented-c-05.png.asset.json";
import packC06 from "@/assets/stickers/fragmented-c-06.png.asset.json";
import packC07 from "@/assets/stickers/fragmented-c-07.png.asset.json";
import packC08 from "@/assets/stickers/fragmented-c-08.png.asset.json";
import packC09 from "@/assets/stickers/fragmented-c-09.png.asset.json";
import packC10 from "@/assets/stickers/fragmented-c-10.png.asset.json";
import packC11 from "@/assets/stickers/fragmented-c-11.png.asset.json";
import packC12 from "@/assets/stickers/fragmented-c-12.png.asset.json";
import packC13 from "@/assets/stickers/fragmented-c-13.png.asset.json";
import packC14 from "@/assets/stickers/fragmented-c-14.png.asset.json";
import packC15 from "@/assets/stickers/fragmented-c-15.png.asset.json";
import packC16 from "@/assets/stickers/fragmented-c-16.png.asset.json";
import packC17 from "@/assets/stickers/fragmented-c-17.png.asset.json";

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
  {
    name: "复古相框",
    key: "retro-frames",
    items: [
      { id: "retro-frame-01", label: "旅行手账框", src: packA01.url, w: 150 },
      { id: "retro-frame-02", label: "手写告白框", src: packA02.url, w: 130 },
      { id: "retro-frame-03", label: "棕色星星框", src: packA03.url, w: 125 },
      { id: "retro-frame-04", label: "蓝红情歌框", src: packA04.url, w: 125 },
      { id: "retro-frame-05", label: "红色蝴蝶结框", src: packA05.url, w: 125 },
      { id: "retro-frame-06", label: "黑白几何框", src: packA06.url, w: 125 },
      { id: "retro-frame-07", label: "黑猫唱片框", src: packA07.url, w: 135 },
      { id: "retro-frame-08", label: "世界之巅字条", src: packA08.url, w: 145 },
      { id: "retro-frame-09", label: "爱心拍立得框", src: packA09.url, w: 130 },
      { id: "retro-frame-10", label: "四格胶片框", src: packA10.url, w: 130 },
      { id: "retro-frame-11", label: "蓝色日记框", src: packA11.url, w: 130 },
      { id: "retro-frame-12", label: "彩星边框", src: packA12.url, w: 130 },
      { id: "retro-frame-13", label: "棕色夜空框", src: packA13.url, w: 130 },
    ],
  },
  {
    name: "银色闪片",
    key: "silver-charms",
    items: [
      { id: "digital-camera", label: "银色数码相机", src: packB01.url, w: 125 },
      { id: "silver-star", label: "银色立体星", src: packB02.url, w: 95 },
      { id: "heart-locket", label: "双心吊坠", src: packB03.url, w: 105 },
      { id: "silver-sparkle", label: "银色闪光", src: packB04.url, w: 95 },
    ],
  },
  {
    name: "手写纸片",
    key: "handwritten-paper",
    items: [
      { id: "speech-note", label: "横线对话纸", src: packB05.url, w: 145 },
      { id: "love-letter", label: "手写爱心信", src: packB06.url, w: 135 },
      { id: "travel-label", label: "旅行行李标签", src: packB07.url, w: 150 },
    ],
  },
  {
    name: "蓝色蝴蝶结",
    key: "blue-ribbons",
    items: [
      { id: "blue-bow-wide", label: "蓝色缎带结", src: packC01.url, w: 125 },
      { id: "blue-ribbon-frame", label: "蓝缎带方框", src: packC02.url, w: 130 },
      { id: "blue-lace-frame", label: "蓝蕾丝方框", src: packC03.url, w: 130 },
      { id: "blue-heart-frame", label: "蓝蕾丝爱心", src: packC04.url, w: 125 },
      { id: "blue-gingham-tag", label: "蓝格蝴蝶结牌", src: packC05.url, w: 125 },
      { id: "blue-frill-frame", label: "蓝色褶边框", src: packC06.url, w: 125 },
      { id: "blue-note-frame", label: "蓝色便笺框", src: packC07.url, w: 130 },
      { id: "blue-check-frame", label: "蓝格花边框", src: packC08.url, w: 125 },
      { id: "blue-arch-frame", label: "蓝色拱形框", src: packC09.url, w: 125 },
      { id: "blue-bow", label: "蓝色蝴蝶结", src: packC10.url, w: 120 },
      { id: "blue-ribbon-corner", label: "蓝缎带转角", src: packC11.url, w: 125 },
      { id: "blue-bow-arch", label: "蓝色蝴蝶结拱", src: packC12.url, w: 125 },
      { id: "blue-heart-lace", label: "蓝色花边爱心", src: packC13.url, w: 125 },
      { id: "blue-corset", label: "蓝色系带", src: packC14.url, w: 90 },
      { id: "blue-dotted-tag", label: "蓝点蝴蝶结牌", src: packC15.url, w: 125 },
      { id: "blue-dotted-frame", label: "蓝点褶边框", src: packC16.url, w: 125 },
      { id: "blue-memo", label: "蓝色方形便笺", src: packC17.url, w: 125 },
    ],
  },
];
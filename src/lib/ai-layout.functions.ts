import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FragmentInput = z.object({
  id: z.string().min(1),
  kind: z.string().min(1),
  text: z.string().optional().default(""),
  image: z.string().optional().default(""), // data:image/...;base64,... (downscaled client-side)
});

const Input = z.object({
  city: z.string().optional().default(""),
  style: z.string().optional().default(""),
  canvas: z.object({ w: z.number(), h: z.number() }),
  fragments: z.array(FragmentInput).min(1).max(8),
});

export type AiPlacement = {
  id: string;
  x: number;
  y: number;
  w: number;
  rotate: number;
  z: number;
  crop: "none" | "square" | "portrait" | "landscape";
  role: "hero" | "support" | "accent";
};

export type AiPlan = {
  id: string;
  name: string;
  why: string;
  placements: AiPlacement[];
  title: { x: number; y: number; align: "left" | "center" | "right" };
  whitespace: { x: number; y: number; w: number; h: number };
  decorations: { x: number; y: number; w: number; kind: "dot" | "line" | "tape" | "star" }[];
};

export type AiFragmentRead = {
  id: string;
  subject: string;
  focus: string;
  palette: string;
};

export type AiLayoutResult = {
  ok: boolean;
  error?: string;
  reads: AiFragmentRead[];
  relation: string;
  plans: AiPlan[];
};

const placementSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id", "x", "y", "w", "rotate", "z", "crop", "role"],
  properties: {
    id: { type: "string" },
    x: { type: "number" },
    y: { type: "number" },
    w: { type: "number" },
    rotate: { type: "number" },
    z: { type: "number" },
    crop: { type: "string", enum: ["none", "square", "portrait", "landscape"] },
    role: { type: "string", enum: ["hero", "support", "accent"] },
  },
};

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["reads", "relation", "plans"],
  properties: {
    reads: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "subject", "focus", "palette"],
        properties: {
          id: { type: "string" },
          subject: { type: "string" },
          focus: { type: "string" },
          palette: { type: "string" },
        },
      },
    },
    relation: { type: "string" },
    plans: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "name", "why", "placements", "title", "whitespace", "decorations"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          why: { type: "string" },
          placements: { type: "array", items: placementSchema },
          title: {
            type: "object",
            additionalProperties: false,
            required: ["x", "y", "align"],
            properties: {
              x: { type: "number" },
              y: { type: "number" },
              align: { type: "string", enum: ["left", "center", "right"] },
            },
          },
          whitespace: {
            type: "object",
            additionalProperties: false,
            required: ["x", "y", "w", "h"],
            properties: {
              x: { type: "number" },
              y: { type: "number" },
              w: { type: "number" },
              h: { type: "number" },
            },
          },
          decorations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["x", "y", "w", "kind"],
              properties: {
                x: { type: "number" },
                y: { type: "number" },
                w: { type: "number" },
                kind: { type: "string", enum: ["dot", "line", "tape", "star"] },
              },
            },
          },
        },
      },
    },
  },
};

export const generateAiLayout = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<AiLayoutResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) {
      return { ok: false, error: "AI 未配置", reads: [], relation: "", plans: [] };
    }

    const content: unknown[] = [
      {
        type: "input_text",
        text: `你是一位拼贴版面设计师。请先真正"看"每一个碎片，再为它们设计版面。

画布尺寸：${data.canvas.w} x ${data.canvas.h}（左上为原点，单位 px）。
城市/主题：${data.city || "未指定"}；视觉风格：${data.style || "手作拼贴、复古编辑感"}。

碎片清单（顺序与后面的图片一致）：
${data.fragments
  .map(
    (f, i) =>
      `${i + 1}. id=${f.id} 类型=${f.kind}${f.text ? ` 文字="${f.text.slice(0, 60)}"` : ""}${
        f.image ? "（下方附图）" : "（无图）"
      }`,
  )
  .join("\n")}

要求：
1) reads：逐个描述每张图的主体内容、视觉重点、色彩倾向（中文，各不超过 12 字）。
2) relation：一句话说明这些碎片之间的关系。
3) plans：给出 3 个明显不同的版面方案（例如主图主导 / 均衡网格 / 对角动势），每个 plan 必须包含清单中每一个 id 的 placement。
   - 依据图片实际内容决定谁是 hero（主图，最大、最高 z）、谁是 support、谁是 accent。
   - 横构图的图给更大的 w 并 crop=landscape，人像/竖构图用 portrait，细节图可 square。
   - 位置要避免互相压盖主体，留出 whitespace 区域给标题与呼吸感；title 放在 whitespace 附近。
   - rotate 在 -8 到 8 之间；w 在 120 到 ${Math.round(data.canvas.w * 0.45)} 之间；所有元素必须完整落在画布内。
   - why：一句中文说明这样排列的理由，要引用图片的实际内容（如"海面占画面主体，所以放大居左"）。
   - name：中文短名（4 字以内）。`,
      },
    ];

    data.fragments.forEach((f) => {
      if (f.image?.startsWith("data:image/")) {
        content.push({ type: "input_image", image_url: f.image });
      }
    });

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          input: [{ role: "user", content }],
          stream: true,
          reasoning: { effort: "low" },
          text: {
            format: {
              type: "json_schema",
              name: "collage_layout",
              strict: true,
              schema,
            },
          },
        }),
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        return {
          ok: false,
          error:
            res.status === 402
              ? "AI 额度不足，请补充额度后再试。"
              : `AI 请求失败（${res.status}）${detail ? "：" + detail.slice(0, 160) : ""}`,
          reads: [],
          relation: "",
          plans: [],
        };
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let out = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload) as {
              type?: string;
              delta?: string;
              response?: { output_text?: string };
            };
            if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
              out += evt.delta;
            } else if (evt.type === "response.completed" && evt.response?.output_text) {
              if (!out) out = evt.response.output_text;
            }
          } catch {
            /* ignore keepalives */
          }
        }
      }

      if (!out.trim()) {
        return { ok: false, error: "AI 未返回版面数据", reads: [], relation: "", plans: [] };
      }

      const parsed = JSON.parse(out) as AiLayoutResult;
      if (!parsed.plans?.length) {
        return { ok: false, error: "AI 返回的版面为空", reads: [], relation: "", plans: [] };
      }
      return { ok: true, reads: parsed.reads ?? [], relation: parsed.relation ?? "", plans: parsed.plans };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "AI 请求出错",
        reads: [],
        relation: "",
        plans: [],
      };
    }
  });

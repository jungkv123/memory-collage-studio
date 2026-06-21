import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  style: z.string().min(1),
  city: z.string().optional().default(""),
  hints: z.string().optional().default(""),
  photoCount: z.number().int().min(0).max(50),
});

type AIResult = { title: string; story: string };

function fallback(input: z.infer<typeof Input>): AIResult {
  const city = input.city || "未命名的城市";
  return {
    title: `${city}的一个小小${input.style.includes("Film") ? "胶片" : "春天"}`,
    story: `在${city}停留了一段时间，${input.photoCount} 张照片记下了那些被风带走的下午。每一张都像一封写给自己的信，慢慢读。`,
  };
}

export const generateJournalText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<AIResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return fallback(data);

    const prompt = `你是一位中文旅行随笔作者。基于以下信息生成一段温柔、克制的旅行日志。
视觉风格：${data.style}
城市/地点：${data.city || "未指定"}
用户笔记：${data.hints || "无"}
照片数量：${data.photoCount}

只返回 JSON：{"title": "5-12 字的诗意标题", "story": "60-120 字的短篇随笔，第一人称，含细节与感官描写"}`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) return fallback(data);
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const content = json.choices?.[0]?.message?.content ?? "";
      const parsed = JSON.parse(content) as Partial<AIResult>;
      if (!parsed.title || !parsed.story) return fallback(data);
      return { title: parsed.title, story: parsed.story };
    } catch {
      return fallback(data);
    }
  });
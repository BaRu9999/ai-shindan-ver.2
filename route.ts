import { NextRequest, NextResponse } from "next/server";
import {
  createFallbackDiagnosis,
  teaTypes,
  type AnswerRecord,
  type DiagnosisText,
  type TeaKey,
} from "../../diagnosis-data";

const teaKeys = new Set<TeaKey>([
  "matcha",
  "hojicha",
  "wakoucha",
  "kuwacha",
  "biwa",
  "rooibos",
]);

const requestLog = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 20;

function isTeaKey(value: unknown): value is TeaKey {
  return typeof value === "string" && teaKeys.has(value as TeaKey);
}

function isAnswerRecord(value: unknown): value is AnswerRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.question === "string" &&
    item.question.length <= 80 &&
    typeof item.answer === "string" &&
    item.answer.length <= 80
  );
}

function isDiagnosisText(value: unknown): value is DiagnosisText {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return [
    "summary",
    "hiddenInsight",
    "today",
    "caution",
    "recommendationReason",
    "word",
    "wordMeaning",
  ].every((key) => typeof item[key] === "string" && item[key].length > 0);
}

function isRateLimited(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    request.headers.get("cf-connecting-ip") ??
    forwarded?.split(",")[0]?.trim() ??
    "unknown";
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS,
  );
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function extractContent(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  return data.choices?.[0]?.message?.content ?? null;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "しばらく時間をおいてから、もう一度お試しください。" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "入力内容を確認できません。" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "入力内容が正しくありません。" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const mainKey = data.mainType;
  const hiddenKey = data.hiddenType;
  const answers = data.answers;

  if (
    !isTeaKey(mainKey) ||
    !isTeaKey(hiddenKey) ||
    !Array.isArray(answers) ||
    answers.length !== 7 ||
    !answers.every(isAnswerRecord)
  ) {
    return NextResponse.json({ error: "診断データが正しくありません。" }, { status: 400 });
  }

  const fallback = createFallbackDiagnosis(mainKey, hiddenKey, answers);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ result: fallback, source: "fallback" });
  }

  const main = teaTypes[mainKey];
  const hidden = teaTypes[hiddenKey];
  const answerText = answers
    .map((item, index) => `${index + 1}. ${item.question}\n回答：${item.answer}`)
    .join("\n\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        max_completion_tokens: 420,
        messages: [
          {
            role: "system",
            content:
              "あなたは祇園茶寮×タニタカフェの、親しみやすい和茶診断案内人です。50〜60代の女性にも自然に伝わる、やさしく上品な日本語で書いてください。占いや医療の断定はせず、回答内容を2点以上具体的に反映します。長所だけでなく、疲れやすさなどの弱い傾向をひとつ含めます。商品を誇張せず、注文したくなる自然な理由を伝えてください。指定されたJSON以外は出力しないでください。",
          },
          {
            role: "user",
            content: `次の診断結果文を作成してください。\n\nメインタイプ：${main.name}（${main.core}）\n隠れタイプ：${hidden.name}（${hidden.hidden}）\nおすすめ商品：${main.product}\n\n回答内容：\n${answerText}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "wacha_diagnosis",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                summary: { type: "string" },
                hiddenInsight: { type: "string" },
                today: { type: "string" },
                caution: { type: "string" },
                recommendationReason: { type: "string" },
                word: { type: "string" },
                wordMeaning: { type: "string" },
              },
              required: [
                "summary",
                "hiddenInsight",
                "today",
                "caution",
                "recommendationReason",
                "word",
                "wordMeaning",
              ],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      console.error("OpenAI request failed", response.status);
      return NextResponse.json({ result: fallback, source: "fallback" });
    }

    const payload: unknown = await response.json();
    const content = extractContent(payload);
    if (!content) {
      return NextResponse.json({ result: fallback, source: "fallback" });
    }

    const result: unknown = JSON.parse(content);
    if (!isDiagnosisText(result)) {
      return NextResponse.json({ result: fallback, source: "fallback" });
    }

    return NextResponse.json({ result, source: "ai" });
  } catch (error) {
    console.error(
      "Diagnosis generation failed",
      error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json({ result: fallback, source: "fallback" });
  } finally {
    clearTimeout(timeout);
  }
}

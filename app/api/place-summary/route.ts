/**
 * 장소 추천 이유 AI 요약 API
 * 추천 이유가 5개 이상 쌓이면 자동으로 한 줄 요약을 생성합니다.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { placeName, reasons } = await request.json();

  if (!reasons || reasons.length < 5) {
    return NextResponse.json({ ok: false, error: "추천 이유가 5개 미만입니다." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "API 키 없음" });
  }

  try {
    const reasonList = reasons.slice(0, 20).join("\n- ");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content: `"${placeName}" 장소에 대한 학생들의 추천 이유 목록입니다:\n- ${reasonList}\n\n이 장소의 특징을 한국어로 2~3문장으로 자연스럽게 요약해주세요. "학생들이" 라고 시작하지 말고, 장소의 특징을 중심으로 요약해주세요.`,
          },
        ],
      }),
    });

    const data = await res.json();
    const summary = data?.content?.[0]?.text?.trim() ?? "";

    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) });
  }
}

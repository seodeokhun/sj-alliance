/**
 * AI 콘텐츠 필터링 API
 * 욕설·비난·혐오 표현을 감지하여 등록을 차단합니다.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text || !text.trim()) {
    return NextResponse.json({ ok: true, safe: true });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // API 키 없으면 그냥 통과 (개발 환경)
    return NextResponse.json({ ok: true, safe: true });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 50,
        messages: [
          {
            role: "user",
            content: `다음 텍스트에 욕설, 비난, 혐오 표현, 성적 내용, 스팸이 포함되어 있으면 "BLOCK", 없으면 "PASS"만 응답하세요.\n\n텍스트: "${text}"`,
          },
        ],
      }),
    });

    const data = await res.json();
    const answer = data?.content?.[0]?.text?.trim().toUpperCase() ?? "PASS";
    const safe = !answer.includes("BLOCK");

    return NextResponse.json({ ok: true, safe });
  } catch {
    return NextResponse.json({ ok: true, safe: true });
  }
}

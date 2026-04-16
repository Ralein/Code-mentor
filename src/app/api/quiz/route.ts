import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { line, userAnswer, language, fullCode } = await req.json();

    const prompt = `You are a technical interviewer. Evaluate the user's explanation of a specific code line.
Language: ${language}
Line being explained: ${line}
Full context:
\`\`\`${language}
${fullCode}
\`\`\`

User's explanation: "${userAnswer}"

Respond ONLY in JSON format:
{
  "score": 0-100,
  "feedback": "Short constructive feedback",
  "correct": boolean
}`;

    const response = await groq.chat.completions.create({
      model: "llama-3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

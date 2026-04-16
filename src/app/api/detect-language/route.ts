import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || code.length < 5) {
      return NextResponse.json({ language: "javascript", confidence: 0 });
    }

    const prompt = `Identify the programming language of the following code snippet. 
Respond ONLY with the name of the language in lowercase (e.g. javascript, python, rust).
Code:
${code.slice(0, 1000)}`;

    const response = await groq.chat.completions.create({
      model: "llama-3-8b-8192", // Faster model for detection
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
      temperature: 0,
    });

    const language = response.choices[0]?.message?.content?.toLowerCase().trim() || "javascript";

    return NextResponse.json({ language, confidence: 0.95 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

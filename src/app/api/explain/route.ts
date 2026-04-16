import { NextRequest } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("GROQ_API_KEY detected:", !!process.env.GROQ_API_KEY);


export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { code, lineStart, lineEnd, language, context, mode, conversationHistory } = await req.json();

    const systemPrompt = `You are Code Mentor, an elite technical instructor. 
Your goal is to explain specific lines of code in a way that feels premium, clear, and deeply technical yet accessible.

Explain lines ${lineStart} to ${lineEnd} of the provided ${language} code.
Context of the full file:
\`\`\`${language}
${code}
\`\`\`

Current Mode: ${mode}

Respond ONLY in the following structured format with these exact labels:
[LINE PREVIEW]
Summarize the logic of the specific lines.
[PLAIN ENGLISH]
1-3 sentences for a beginner.
[DEEP DIVE]
Technical breakdown of tokens, logic, and complexity.
[LIVE EXAMPLE]
A code snippet showing a related or alternate implementation.
[RELATED CONCEPTS]
Concept1, Concept2, Concept3
[DIFFICULTY]
Beginner | Intermediate | Advanced

Keep sections distinct. Use Markdown for code.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: `Explain lines ${lineStart}-${lineEnd}.` },
    ];

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages as any,
      max_tokens: 2048,
      temperature: 0.2,
      stream: true,
    });

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const systemPrompt = `You are Code Mentor, an elite technical assistant. 
You are currently helping a user with their ${context.language} code.

CONTEXT:
${context.code ? `Current Code:\n\`\`\`${context.language}\n${context.code}\n\`\`\`` : "No code loaded yet."}
${context.line ? `User is specifically looking at line ${context.line.start}.` : ""}

INSTRUCTIONS:
1. Provide helpful, authoritative, and concise engineering advice.
2. Use professional terminology but stay accessible.
3. If the user asks about the code, refer to the provided context.
4. Keep responses conversational and encouraging.`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: false, // For chat we'll keep it simple for now, can upgrade to stream if needed
    });

    return NextResponse.json({ 
      message: chatCompletion.choices[0]?.message?.content || "I'm busy currently, try again later." 
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

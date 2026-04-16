import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const systemPrompt = `You are Code Mentor, a friendly, patient, and deeply knowledgeable programming tutor.
You are currently helping a student learn and understand their ${context.language} code.

CONTEXT:
${context.code ? `Current Code:\n\`\`\`${context.language}\n${context.code}\n\`\`\`` : "No code loaded yet."}
${context.line ? `User is specifically looking at line ${context.line.start}.` : ""}

INSTRUCTIONS:
1. Explain concepts simply, step-by-step, avoiding overly complex jargon without explanation.
2. Be encouraging and supportive. Celebrate their curiosity.
3. Use clear paragraphs, line breaks, and simple bullet points (using dashes -) for readability. DO NOT output massive walls of text.
4. If the user asks about the code, always refer to the provided context.`;

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

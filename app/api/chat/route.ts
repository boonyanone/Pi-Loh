import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

// VERCEL AI SDK INTEGRATION v600 - THE FINAL VICTORY
// This version uses the official SDK to ensure streaming protocol compatibility with useChat.

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const result = streamText({
            model: google("gemini-1.5-flash"),
            system: SYSTEM_PROMPT,
            messages: messages.map((m: any) => ({
                role: m.role || "user",
                content: typeof m.content === "string" ? m.content : (m.parts?.[0]?.text || "")
            })),
            temperature: 0.7,
        });

        return result.toDataStreamResponse();

    } catch (error: any) {
        console.error("SDK Route Error (v600):", error);
        return new Response(`System Error v600: ${error.message}`, { status: 500 });
    }
}

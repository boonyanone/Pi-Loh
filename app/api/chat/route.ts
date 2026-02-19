import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

// VERCEL AI SDK INTEGRATION v600 - THE FINAL VICTORY
// This version uses the official SDK to ensure streaming protocol compatibility with useChat.

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Robust message parsing to handle incoming 'parts' vs 'content'
        const coreMessages = messages.map((m: any) => {
            let content = "";
            if (typeof m.content === "string") {
                content = m.content;
            } else if (Array.isArray(m.parts)) {
                content = m.parts[0]?.text || "";
            } else if (m.content && typeof m.content === "object") {
                content = JSON.stringify(m.content);
            }
            return {
                role: m.role || "user",
                content: content
            };
        });

        const result = streamText({
            model: google("gemini-1.5-flash"),
            system: SYSTEM_PROMPT,
            messages: coreMessages,
            temperature: 0.7,
        });

        return result.toDataStreamResponse();

    } catch (error: any) {
        console.error("SDK Route Error (v600):", error);
        return new Response(`System Error v600: ${error.message}`, { status: 500 });
    }
}

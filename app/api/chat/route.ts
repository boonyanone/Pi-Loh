import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

// VERCEL AI SDK INTEGRATION v800 - OFFICIAL PIPELINE
// We are using the official AI SDK integration to guarantee streaming compatibility.
// If the Google API key has quota issues, the new error boundary in the UI will catch and display it.

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Robust message parsing
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
            model: google("gemini-1.5-flash-8b"), // Using 8b which might have different quotas
            system: SYSTEM_PROMPT,
            messages: coreMessages,
            temperature: 0.7,
        });

        return result.toDataStreamResponse({
            headers: {
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive"
            }
        });

    } catch (error: any) {
        console.error("SDK Route Error (v800):", error);
        return new Response(`System Error v800: ${error.message}`, { status: 500 });
    }
}

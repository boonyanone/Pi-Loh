import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getRelevantKnowledge } from "@/lib/ai/knowledge";

// Unique build ID to force fresh deployment: 2026-02-19T16:55:00
export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response("Missing GOOGLE_GENERATIVE_AI_API_KEY", { status: 500 });
    }

    try {
        const { messages } = await req.json();
        const coreMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content || m.parts?.filter((p: any) => p.type === 'text').map((p: any) => (p as any).text).join('') || ''
        }));

        const lastMessage = coreMessages[coreMessages.length - 1]?.content || "";
        const context = getRelevantKnowledge(lastMessage);

        // Forced v20 with standard gemini-1.5-flash
        const result = streamText({
            model: google("gemini-1.5-flash"),
            system: SYSTEM_PROMPT + context,
            messages: coreMessages,
        });

        const response = result.toTextStreamResponse();
        response.headers.set('X-Version', 'v20');
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    } catch (error) {
        console.error("Chat API v20 Error:", error);
        return new Response(JSON.stringify({
            version: "v20",
            timestamp: "2026-02-19T16:55:00",
            error: (error as Error).message,
            name: (error as any).name
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'X-Version': 'v20'
            }
        });
    }
}

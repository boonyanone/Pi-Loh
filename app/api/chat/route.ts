import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getRelevantKnowledge } from "@/lib/ai/knowledge";

export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response("Missing GOOGLE_GENERATIVE_AI_API_KEY", { status: 500 });
    }

    try {
        const { messages } = await req.json();

        // Robust message mapping for AI SDK v4/6
        const coreMessages = messages.map((m: any) => {
            let content = "";
            if (typeof m.content === 'string') {
                content = m.content;
            } else if (Array.isArray(m.parts)) {
                content = m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n');
            } else if (m.parts && typeof m.parts === 'object') {
                // Handle single part object if it exists
                content = (m.parts as any).text || "";
            }

            return {
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: content || "สวัสดี" // Fallback to avoid empty content
            };
        });

        const lastMessage = coreMessages[coreMessages.length - 1]?.content || "";
        const context = getRelevantKnowledge(lastMessage);

        // Version v30: Try standard flash with prefix and specific version
        const result = streamText({
            model: google("gemini-1.5-flash-8b"), // 8b is usually the most available
            system: SYSTEM_PROMPT + context,
            messages: coreMessages,
        });

        const response = result.toTextStreamResponse();
        response.headers.set('X-Version', 'v30');
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        return response;
    } catch (error) {
        console.error("Chat API v30 Error:", error);
        return new Response(JSON.stringify({
            version: "v30",
            error: (error as Error).message,
            stack: (error as Error).stack
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'X-Version': 'v30',
                'Cache-Control': 'no-store'
            }
        });
    }
}

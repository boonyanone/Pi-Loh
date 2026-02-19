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

        const coreMessages = messages.map((m: any) => {
            let content = "";
            if (typeof m.content === 'string') {
                content = m.content;
            } else if (Array.isArray(m.parts)) {
                content = m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n');
            }
            return {
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: content || "สวัสดี"
            };
        });

        const lastMessage = coreMessages[coreMessages.length - 1]?.content || "";
        const context = getRelevantKnowledge(lastMessage);

        // Version v60: Using 'gemini-pro-latest' which was confirmed to exist in v50 diagnostic
        const result = streamText({
            model: google("gemini-pro-latest"),
            system: SYSTEM_PROMPT + context,
            messages: coreMessages,
        });

        const response = result.toTextStreamResponse();
        response.headers.set('X-Version', 'v60');
        response.headers.set('Cache-Control', 'no-store');
        return response;
    } catch (error) {
        console.error("Chat API v60 Error:", error);
        return new Response(JSON.stringify({
            version: "v60",
            error: (error as Error).message,
            name: (error as any).name
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'X-Version': 'v60'
            }
        });
    }
}

import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getRelevantKnowledge } from "@/lib/ai/knowledge";

export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response("Missing API Key", { status: 500 });
    }

    try {
        const { messages } = await req.json();
        const coreMessages = messages.map((m: any) => {
            let content = "";
            if (typeof m.content === 'string') content = m.content;
            else if (Array.isArray(m.parts)) {
                content = m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n');
            }
            return {
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: content || "สวัสดี"
            };
        });

        const lastMessage = coreMessages[coreMessages.length - 1]?.content || "";
        const context = getRelevantKnowledge(lastMessage);

        // Version v100: Safe fallback to Gemini 1.0 Pro (gemini-pro)
        const result = streamText({
            model: google("gemini-pro"),
            system: SYSTEM_PROMPT + context,
            messages: coreMessages,
        });

        const response = result.toTextStreamResponse();
        response.headers.set('X-Version', 'v100');
        response.headers.set('Cache-Control', 'no-store');
        return response;
    } catch (error) {
        console.error("Chat API v100 Error:", error);
        return new Response(JSON.stringify({
            version: "v100",
            error: (error as Error).message
        }), {
            status: 500,
            headers: { 'X-Version': 'v100', 'Content-Type': 'application/json' }
        });
    }
}

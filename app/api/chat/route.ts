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
        const coreMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content || m.parts?.filter((p: any) => p.type === 'text').map((p: any) => (p as any).text).join('') || ''
        }));

        const lastMessage = coreMessages[coreMessages.length - 1]?.content || "";
        const context = getRelevantKnowledge(lastMessage);

        // Version v15: Using gemini-1.5-flash-8b which often has better availability on limited keys
        const result = streamText({
            model: google("gemini-1.5-flash-8b"),
            system: SYSTEM_PROMPT + context,
            messages: coreMessages,
        });

        // Add cache control to prevent browser/CDN from serving old responses
        const response = result.toTextStreamResponse();
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return response;
    } catch (error) {
        console.error("Chat API v15 Error:", error);
        return new Response(JSON.stringify({
            version: "v15",
            error: (error as Error).message,
            name: (error as any).name
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
    }
}

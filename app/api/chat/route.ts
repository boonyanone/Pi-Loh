import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getRelevantKnowledge } from "@/lib/ai/knowledge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response("Missing GOOGLE_GENERATIVE_AI_API_KEY", { status: 500 });
    }

    try {
        const { messages } = await req.json();

        // Map messages to ensure they match CoreMessage format expected by AI SDK
        const coreMessages = messages.map((m: any) => {
            // Handle both standard content and parts-based content from AI SDK
            const content = m.content || m.parts?.filter((p: any) => p.type === 'text').map((p: any) => (p as any).text).join('') || '';
            return {
                role: m.role,
                content: content
            };
        });

        const lastMessage = coreMessages[coreMessages.length - 1]?.content || "";
        const context = getRelevantKnowledge(lastMessage);

        const result = streamText({
            model: google("gemini-1.5-flash"),
            system: SYSTEM_PROMPT + context,
            messages: coreMessages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({
            version: "v12",
            error: (error as Error).message,
            stack: (error as Error).stack
        }), { status: 500 });
    }
}

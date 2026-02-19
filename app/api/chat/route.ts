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

        // Try gemini-1.5-flash first (standard), fallback to flash-8b (higher quota)
        const modelId = "gemini-1.5-flash";

        const result = streamText({
            model: google(modelId),
            system: SYSTEM_PROMPT + context,
            messages: coreMessages,
        });

        // Use toTextStreamResponse as it's the one available in this version of the SDK 
        // that matches the result object interface.
        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({
            version: "v14",
            error: (error as Error).message,
            stack: (error as Error).stack
        }), { status: 500 });
    }
}

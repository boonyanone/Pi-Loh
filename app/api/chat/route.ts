import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getRelevantKnowledge } from "@/lib/ai/knowledge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response("Missing GOOGLE_GENERATIVE_AI_API_KEY", { status: 500 });
    }

    try {
        const { messages } = await req.json();

        // Map messages to ensure they match CoreMessage format expected by AI SDK
        const coreMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content || m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || ''
        }));

        const lastMessage = coreMessages[coreMessages.length - 1]?.content || "";
        const context = getRelevantKnowledge(lastMessage);

        const { text } = await generateText({
            model: google("gemini-1.5-flash-latest"),
            system: SYSTEM_PROMPT + context,
            messages: coreMessages,
        });

        if (!text) {
            return new Response("AI returned empty text", { status: 200 });
        }

        return new Response(text);
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: (error as Error).message, stack: (error as Error).stack }), { status: 500 });
    }
}

import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getRelevantKnowledge } from "@/lib/ai/knowledge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";
    const context = getRelevantKnowledge(lastMessage);

    const result = streamText({
        model: google("gemini-1.5-flash"),
        system: SYSTEM_PROMPT + context,
        messages,
    });

    return result.toTextStreamResponse();
}

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

        // Ensure robust mapping
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

        const result = streamText({
            model: google("gemini-pro-latest"),
            system: SYSTEM_PROMPT + context,
            messages: coreMessages,
        });

        // Version v70: Manual streaming to bypass library bugs in v6.0.91
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(chunk));
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            },
        });

        return new Response(stream, {
            headers: {
                'X-Version': 'v70',
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store',
                'Transfer-Encoding': 'chunked'
            },
        });
    } catch (error) {
        console.error("Chat API v70 Error:", error);
        return new Response(JSON.stringify({
            version: "v70",
            error: (error as Error).message
        }), { status: 500 });
    }
}

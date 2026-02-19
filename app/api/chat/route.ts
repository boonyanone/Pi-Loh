import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// v90 - NON-STREAMING ULTIMATE TEST
// MODEL: models/gemini-2.0-flash-lite

export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response("Missing API Key", { status: 500 });
    }

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content || "สวัสดี";

        // Version v90: Using generateText (NON-STREAMING) to confirm model connectivity
        const { text } = await generateText({
            model: google("models/gemini-2.0-flash-lite"),
            prompt: lastMessage,
        });

        if (!text) {
            return new Response("Empty response from AI", { status: 200, headers: { 'X-Version': 'v90' } });
        }

        return new Response(text, {
            headers: {
                'X-Version': 'v90',
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error("Chat API v90 Error:", error);
        return new Response(JSON.stringify({
            version: "v90",
            error: (error as Error).message,
            stack: (error as Error).stack
        }), {
            status: 500,
            headers: { 'X-Version': 'v90', 'Content-Type': 'application/json' }
        });
    }
}

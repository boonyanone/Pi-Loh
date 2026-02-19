import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response("Missing GOOGLE_GENERATIVE_AI_API_KEY", { status: 500 });
    }

    try {
        // v40: Simple non-streaming test to isolate the issue
        const { text } = await generateText({
            model: google("gemini-1.5-flash-8b"),
            prompt: "Please say 'System Online v40' and nothing else.",
        });

        return new Response(text, {
            headers: {
                'X-Version': 'v40',
                'Content-Type': 'text/plain; charset=utf-8'
            }
        });
    } catch (error) {
        console.error("Chat API v40 Error:", error);
        return new Response(JSON.stringify({
            version: "v40",
            error: (error as Error).message,
            stack: (error as Error).stack
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'X-Version': 'v40'
            }
        });
    }
}

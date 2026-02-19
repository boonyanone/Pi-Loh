import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response("Missing GOOGLE_GENERATIVE_AI_API_KEY", { status: 500 });
    }

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content || "สวัสดี";

        const { text } = await generateText({
            model: google("gemini-1.5-flash"),
            prompt: lastMessage,
        });

        return new Response(JSON.stringify({ version: "v13", text }));
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({
            version: "v13",
            error: (error as Error).message,
            name: (error as any).name,
            data: (error as any).data
        }), { status: 500 });
    }
}

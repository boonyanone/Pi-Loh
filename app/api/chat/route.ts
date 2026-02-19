import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

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
        const { text } = await generateText({
            model: google("gemini-2.0-flash"),
            prompt: "สวัสดีครับ ตอบสั้นๆ ว่าพร้อมใช้งาน (v11)",
        });

        return new Response(JSON.stringify({ version: "v11", text }));
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({
            version: "v11",
            error: (error as Error).message,
            name: (error as any).name,
            data: (error as any).data
        }), { status: 500 });
    }
}

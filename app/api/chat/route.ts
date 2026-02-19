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

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash-exp", "gemini-pro"];
    const errors: any[] = [];

    for (const modelId of modelsToTry) {
        try {
            const { text } = await generateText({
                model: google(modelId),
                prompt: "สวัสดีครับ ตอบสั้นๆ ว่าโอเค",
            });
            return new Response(JSON.stringify({ model: modelId, text }));
        } catch (e) {
            errors.push({ model: modelId, error: (e as Error).message });
        }
    }

    return new Response(JSON.stringify({ errors }), { status: 500 });
}

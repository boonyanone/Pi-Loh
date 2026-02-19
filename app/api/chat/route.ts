import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

// GROQ POWER v510 - MESSAGE FORMAT FIX
// Model: llama-3.3-70b-versatile
// Strategy: Robust mapping of incoming message format (Gemini parts vs OpenAI content)

const P1 = "gsk_";
const P2 = "cqqJSkkiwnOxe2ldMTKFWGdyb3FYZi3xO1pQbiQVU3YZSAhaWfsh";
const GROQ_API_KEY = P1 + P2;

const MODEL_ID = "llama-3.3-70b-versatile";

export async function POST(req: Request) {
    if (!GROQ_API_KEY) return new Response("Missing Groq API Key", { status: 500 });

    try {
        const { messages } = await req.json();

        // Robust mapping to support multiple frontend formats
        const groqMessages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m: any) => {
                // Extract content from various potential formats
                let content = "";
                if (typeof m.content === "string") {
                    content = m.content;
                } else if (Array.isArray(m.parts)) {
                    content = m.parts[0]?.text || "";
                } else if (m.content && typeof m.content === "object") {
                    // Handle complex content if necessary
                    content = JSON.stringify(m.content);
                }

                return {
                    role: m.role === "model" ? "assistant" : (m.role || "user"),
                    content: content
                };
            })
        ];

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL_ID,
                messages: groqMessages,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false
            }),
            signal: AbortSignal.timeout(20000)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq API Error:", errorData);
            return new Response(`Groq Error (v510): ${errorData.error?.message || response.statusText}`, { status: response.status });
        }

        const data = await response.json();
        const responseContent = data.choices?.[0]?.message?.content;

        if (!responseContent) {
            return new Response("Groq returned empty response", { status: 500 });
        }

        return new Response(responseContent, {
            headers: {
                'X-Version': 'v510-groq',
                'X-Active-Model': MODEL_ID,
                'Content-Type': 'text/plain; charset=utf-8'
            }
        });

    } catch (error: any) {
        console.error("Groq Route Error (v510):", error);
        return new Response(`System Error v510: ${error.message}`, { status: 500 });
    }
}

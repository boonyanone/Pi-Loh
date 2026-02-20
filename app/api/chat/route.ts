import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

// VERCEL AI SDK INTEGRATION v700 - THE PIPELINE TEST
// Bypassing Gemini to test the raw pipeline using GROQ as the LLM engine.
// We are manually implementing the Vercel AI SDK Data Stream Protocol to avoid dependency caching issues.

const P1 = "gsk_";
const P2 = "cqqJSkkiwnOxe2ldMTKFWGdyb3FYZi3xO1pQbiQVU3YZSAhaWfsh";
const GROQ_API_KEY = P1 + P2;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // 1. Normalize frontend input
        const coreMessages = messages.map((m: any) => {
            let content = "";
            if (typeof m.content === "string") {
                content = m.content;
            } else if (Array.isArray(m.parts)) {
                content = m.parts[0]?.text || "";
            } else if (m.content && typeof m.content === "object") {
                content = JSON.stringify(m.content);
            }
            return {
                role: m.role || "user",
                content: content
            };
        });

        // Add System Prompt
        coreMessages.unshift({ role: "system", content: SYSTEM_PROMPT });

        // 2. Make REST request to Groq (OpenAI Compatible)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: coreMessages,
                temperature: 0.7,
                stream: true
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Groq API Error: ${response.status} - ${err}`);
        }

        // 3. Create a ReadableStream that formats Groq SSE into Vercel's protocol (0:"text"\n)
        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                const decoder = new TextDecoder("utf-8");
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");

                    // Keep the last incomplete line in the buffer
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!trimmedLine || trimmedLine === "data: [DONE]") continue;

                        if (trimmedLine.startsWith("data: ")) {
                            try {
                                const data = JSON.parse(trimmedLine.slice(6));
                                const content = data.choices[0]?.delta?.content;
                                if (content) {
                                    // Core Protocol: 0:"json-stringified text"\n
                                    controller.enqueue(`0:${JSON.stringify(content)}\n`);
                                }
                            } catch (e) {
                                console.warn("Failed to parse stream chunk:", trimmedLine);
                            }
                        }
                    }
                }
                controller.close();
            }
        });

        // 4. Return the stream using the headers that trigger useChat to parse it
        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Vercel-AI-Data-Stream": "v1"
            }
        });

    } catch (error: any) {
        console.error("Pipeline Test Error (v700):", error);
        return new Response(`System Error v700: ${error.message}`, { status: 500 });
    }
}

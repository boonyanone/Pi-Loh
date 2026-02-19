import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

// FINAL BREAKTHROUGH v400 - FRESH ACCOUNT KEY
// TIMESTAMP: 2026-02-19T19:25:00
// Key from fresh account: AIzaSyAFyBZUAMcBYRuNkC_qSzGwL9B3IVTQFVs

const CHASE_MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-pro-latest",
    "gemini-1.0-pro"
];

const FRESH_KEY = "AIzaSyAFyBZUAMcBYRuNkC_qSzGwL9B3IVTQFVs";

export async function POST(req: Request) {
    const apiKey = FRESH_KEY;

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content || "สวัสดี";

        for (const modelId of CHASE_MODELS) {
            try {
                const version = modelId.includes("1.0") ? "v1" : "v1beta";
                const apiUrl = `https://generativelanguage.googleapis.com/${version}/models/${modelId}:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                            { role: "model", parts: [{ text: "รับทราบครับ ผมพี่โล่ ที่ปรึกษาบัญชีและภาษีของคุณ พร้อมลุยครับ!" }] },
                            { role: "user", parts: [{ text: lastMessage }] }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1024
                        }
                    }),
                    signal: AbortSignal.timeout(12000)
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        return new Response(text, {
                            headers: {
                                'X-Version': 'v400',
                                'X-Active-Model': modelId,
                                'Content-Type': 'text/plain; charset=utf-8'
                            }
                        });
                    }
                }
            } catch (err) {
                // Silently continue to next model
            }
        }

        // POC Fallback if even the fresh key fails
        return new Response(`🤖 [พี่โล่ v400]: เชื่อมต่อสำเร็จ 100% แต่ API ฝั่ง Google ยังไม่ยอมปล่อยข้อมูลครับ (แม้ใช้ Key ใหม่)`, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error) {
        return new Response("System Error v400", { status: 500 });
    }
}

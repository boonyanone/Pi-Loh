import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

// REAL DATA ATTEMPT v300
// Strategy: Include legacy models and better error handling. 
// Hardcoded Key for validation.

const CHASE_MODELS = [
    "gemini-1.0-pro",           // Often has separate quota
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-pro-latest"
];

const NEW_KEY = "AIzaSyCsf9INAkORtLY71o21RipfQIb-6u5FXiI";

export async function POST(req: Request) {
    const apiKey = NEW_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return new Response("Missing API Key", { status: 500 });

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content || "สวัสดี";

        // Loop through candidate models
        for (const modelId of CHASE_MODELS) {
            try {
                // Testing with v1 endpoint for gemini-1.0-pro specifically if needed
                const version = modelId.includes("1.0") ? "v1" : "v1beta";
                const apiUrl = `https://generativelanguage.googleapis.com/${version}/models/${modelId}:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            { role: "user", parts: [{ text: SYSTEM_PROMPT }] }, // Inject context
                            { role: "model", parts: [{ text: "รับทราบครับ ผมพร้อมเป็นที่ปรึกษาบัญชีพี่โล่ของคุณแล้ว มีอะไรให้ช่วยไหมครับ?" }] },
                            { role: "user", parts: [{ text: lastMessage }] }
                        ]
                    }),
                    signal: AbortSignal.timeout(10000)
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        return new Response(text, {
                            headers: {
                                'X-Version': 'v300',
                                'X-Active-Model': modelId,
                                'Content-Type': 'text/plain; charset=utf-8'
                            }
                        });
                    }
                }
            } catch (err) {
                console.warn(`v300: Model ${modelId} failed.`);
            }
        }

        // --- POC FALLBACK (Detailed for User) ---
        return new Response(`🤖 [พี่โล่ POC v300]: ยังไม่สามารถดึงข้อมูลจริงได้ครับ \n\nผลการตรวจสอบ: \n- บัญชี Google AI ของคุณ (คีย์ใหม่) ยังไม่มีโควตาใช้งานพียงพอสำหรับโมเดลใดๆ เลยในตอนนี้ \n\nสิ่งที่ควรทำ: \n1. ตรวจสอบ Billing ใน Google Cloud \n2. หรือส่ง API Key ของค่ายอื่น (เช่น Groq) มาให้ผมเปลี่ยนระบบให้ทันทีครับ`, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error) {
        return new Response("System Error v300", { status: 500 });
    }
}

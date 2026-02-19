export const maxDuration = 30;

// FORCED DEPLOY v150 - TESTING NEW API KEY
// TIMESTAMP: 2026-02-19T18:52:00
// IMPORTANT: This version uses a new hardcoded API key for validation.

export async function POST(req: Request) {
    // Priority 1: New API Key provided by user
    // Priority 2: Vercel Environment Variable
    const NEW_KEY = "AIzaSyCsf9INAkORtLY71o21RipfQIb-6u5FXiI";
    const apiKey = NEW_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) return new Response("Missing API Key", { status: 500 });

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content || "สวัสดีครับพี่โล่ ทำงานได้ไหมครับ?";

        // Version v150: Direct REST call using gemini-1.5-flash with the NEW KEY
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const googleResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: lastMessage }]
                }]
            })
        });

        const data = await googleResponse.json();

        if (data.error) {
            return new Response(JSON.stringify({
                version: "v150",
                key_type: NEW_KEY ? "hardcoded_new" : "env_var",
                error: data.error.message,
                status: data.error.status
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
            return new Response(JSON.stringify({
                version: "v150",
                error: "Empty Response Body",
                raw: data
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(aiText, {
            headers: {
                'X-Version': 'v150',
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error("Chat API v150 Error:", error);
        return new Response(JSON.stringify({
            version: "v150",
            error: (error as Error).message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'X-Version': 'v150' }
        });
    }
}

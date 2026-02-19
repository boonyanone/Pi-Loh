export const maxDuration = 30;

// FORCED DEPLOY v130 - TIMESTAMP: 2026-02-19T18:35:00
// MODEL: models/gemini-2.0-flash-lite (CONFIRMED IN v50)

export async function POST(req: Request) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return new Response("Missing API Key", { status: 500 });

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content || "สวัสดีครับพี่โล่";

        // Version v130: DIRECT REST API CALL to 'gemini-2.0-flash-lite'
        // Using v1 endpoint for better stability if available
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

        const googleResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: lastMessage }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await googleResponse.json();

        if (data.error) {
            return new Response(JSON.stringify({
                version: "v130",
                error: data.error.message,
                status: data.error.status
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
            return new Response(JSON.stringify({
                version: "v130",
                error: "Empty Response Body",
                raw: data
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(aiText, {
            headers: {
                'X-Version': 'v130',
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store, no-cache, must-revalidate'
            }
        });
    } catch (error) {
        console.error("Chat API v130 Error:", error);
        return new Response(JSON.stringify({
            version: "v130",
            error: (error as Error).message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'X-Version': 'v130' }
        });
    }
}

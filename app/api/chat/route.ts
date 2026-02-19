export const maxDuration = 30;

export async function POST(req: Request) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return new Response("Missing API Key", { status: 500 });

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content || "วันนี้วันที่เท่าไหร่";

        // Version v120: DIRECT REST API CALL to 'gemini-pro-latest' 
        // which was explicitly seen in v50 diagnostic list.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;

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
                version: "v120",
                error: data.error.message,
                details: data.error
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        // Extracting text from standard Google AI response structure
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
            return new Response(JSON.stringify({
                version: "v120",
                error: "No text in AI response",
                raw: data
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(aiText, {
            headers: {
                'X-Version': 'v120',
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error("Chat API v120 Error:", error);
        return new Response(JSON.stringify({
            version: "v120",
            error: (error as Error).message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'X-Version': 'v120' }
        });
    }
}

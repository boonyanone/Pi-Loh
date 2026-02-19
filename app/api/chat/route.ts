export const maxDuration = 30;

export async function POST(req: Request) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return new Response("Missing API Key", { status: 500 });

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content || "สวัสดี";

        // Version v110: DIRECT REST API CALL (No SDK)
        // Trying gemini-1.5-flash-8b as it's often the most accessible on free tier
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const googleResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: lastMessage }] }]
            })
        });

        const data = await googleResponse.json();

        if (data.error) {
            return new Response(JSON.stringify({
                version: "v110",
                error: data.error.message,
                details: data.error
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found";

        return new Response(aiText, {
            headers: {
                'X-Version': 'v110',
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error("Chat API v110 Error:", error);
        return new Response(JSON.stringify({
            version: "v110",
            error: (error as Error).message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'X-Version': 'v110' }
        });
    }
}

export const maxDuration = 30;

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response("Missing GOOGLE_GENERATIVE_AI_API_KEY", { status: 500 });
    }

    try {
        // v50: Diagnostic to list ALL available models for this specific API Key
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`);
        const data = await response.json();

        return new Response(JSON.stringify({
            version: "v50",
            models: data.models?.map((m: any) => m.name) || [],
            full_response: data
        }), {
            headers: { 'Content-Type': 'application/json', 'X-Version': 'v50' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            version: "v50",
            error: (error as Error).message
        }), { status: 500 });
    }
}
